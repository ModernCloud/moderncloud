// TODO: Kill child process
process.on('SIGINT', () => {
    process.exit();
});
process.on('SIGTERM', () => {
    process.exit();
});
require('./typescript-language-server/server/lib/cli');