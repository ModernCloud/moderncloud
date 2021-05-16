const {URL} = require('url');
const ws = require('ws');
const rpc = require('vscode-ws-jsonrpc/lib');
const rpcServer = require('vscode-ws-jsonrpc/lib/server');
const JWT = require('./jwt');
const {User, Project} = require('./db');

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
    const serverConnection = rpcServer.createServerProcess('ts', 'docker', [
        'run',
        '-v', `${process.env.PACKAGES_ROOT}/${projectId}:/packages`,
        '-a', 'STDIN', '-a', 'STDOUT', '-a', 'STDERR', '-i', '--rm',
        'moderncloud/runner:0.3',
        'node', '/runner/startserver.js', '--stdio'
    ]);
    const socketConnection = rpcServer.createConnection(reader, writer, () => {
        socket.dispose();
    });
    rpcServer.forward(socketConnection, serverConnection, message => {
        if (rpc.isRequestMessage(message)) {
            if (message.method === 'initialize') {
                message.processId = process.pid;
            }
        }
        return message;
    });
    socket.onClose(() => {
        serverConnection.dispose();
    });
}

module.exports = server => {
    server.on('upgrade', async (request, socket, head) => {
        let requestUrl = new URL('https://moderncloud.io' + request.url);
        if (requestUrl.searchParams.has('token') === false
            || requestUrl.searchParams.has('project_id') === false) {
            return;
        }
        let user = await checkUser(requestUrl.searchParams.get('token'));
        let project = await Project.query()
            .where('user_id', user?.id)
            .where('id', requestUrl.searchParams.get('project_id'))
            .first();
        if (user instanceof User && project instanceof Project && requestUrl.pathname === '/js') {
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