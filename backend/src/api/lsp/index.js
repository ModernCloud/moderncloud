const ws = require('ws');
const rpc = require('vscode-ws-jsonrpc/lib');
const rpcServer = require('vscode-ws-jsonrpc/lib/server');

const wss = new ws.Server({
    noServer: true,
    perMessageDeflate: false
});

let launch = socket => {
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    const serverConnection = rpcServer.createServerProcess('ts', '/usr/local/bin/typescript-language-server', ['--stdio']);
    const socketConnection = rpcServer.createConnection(reader, writer, () => {
        console.log('connection on close');
        socket.dispose()
    });
    rpcServer.forward(socketConnection, serverConnection);
    socket.onClose(() => {
        console.log('socket on close');
        serverConnection.dispose();
    });
};

module.exports = server => {
    server.on('upgrade', (request, socket, head) => {
        if (request.url === '/lsp') {
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
                    launch(socket);
                } else {
                    webSocket.on('open', () => launch(socket));
                }
            });
        }
    });
};