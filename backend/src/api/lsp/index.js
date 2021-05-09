const ws = require('ws');
const rpc = require('vscode-ws-jsonrpc/lib');
const rpcServer = require('vscode-ws-jsonrpc/lib/server');
const JWT = require('../../api/jwt');
const {User, Project} = require('../../common/db');

const serverConnection = rpcServer.createServerProcess('ts', 'docker', [
    'run',
    '-v', `${process.env.STORAGE}/packages:/packages`,
    '-a', 'STDIN', '-a', 'STDOUT', '-a', 'STDERR', '-i', '--rm',
    'moderncloud/runner:0.1',
    'node', '/startserver.js', '--stdio'
]);

const wss = new ws.Server({
    noServer: true,
    perMessageDeflate: false
});

async function checkUser(token) {
    let jwtResult = await JWT.verify({
        headers: {
            authorization: 'Bearer ' + token
        }
    });
    return User.query().findById(jwtResult.data.id);
}

function launch(projectId, socket) {
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    const socketConnection = rpcServer.createConnection(reader, writer, () => {
        socket.dispose();
    });
    rpcServer.forward(socketConnection, serverConnection);
}

module.exports = server => {
    server.on('upgrade', async (request, socket, head) => {
        let requestUrl = request.url.split('/');
        if (requestUrl.length !== 4) {
            return;
        }
        let user = await checkUser(requestUrl[2]);
        let project = await Project.query()
            .where('user_id', user?.id)
            .where('id', requestUrl[3])
            .first();
        if (user instanceof User && project instanceof Project && requestUrl[1] === 'lsp') {
            wss.handleUpgrade(request, socket, head, webSocket => {
                let socket = {
                    send: content => webSocket.send(content),
                    onMessage: cb => {
                        webSocket.on('message', data => {
                            cb(Buffer.from(data));
                        })
                    },
                    onError: cb => {
                        webSocket.on('error', err => {
                            console.log('onError', err);
                            cb(err);
                        })
                    },
                    onClose: cb => {
                        webSocket.on('close', cb);
                    },
                    dispose: () => webSocket.close()
                };
                if (webSocket.readyState === webSocket.OPEN) {
                    launch(project.id, socket);
                } else {
                    webSocket.on('open', () => launch(project.id, socket));
                }
            });
        }
    });
};