const { exec } = require('child_process');

class Result {
    constructor() {
        this.exitCode = 0;
        this.output = [];
    }

    stdout() {
        return this.output.filter(line => line.type === 'stdout').map(line => line.message).join('');
    }

    stderr() {
        return this.output.filter(line => line.type === 'stderr').map(line => line.message).join('');
    }

    all() {
        return this.output.map(line => line.message).join('');
    }
}

function promiseExec(result, child, settings = {}) {
    return new Promise((resolve, reject) => {
        child.stdout.on('data', data => {
            let message = data.toString();
            result.output.push({type: 'stdout', message: message})
            if (settings.logger) {
                settings.logger.info(message);
            }
        });
        child.stderr.on('data', data => {
            let message = data.toString();
            result.output.push({type: 'stderr', message: message});
            if (settings.logger) {
                settings.logger.error(message);
            }
        });
        child.on('close', exitCode => {
            result.exitCode = exitCode;
            if (result.exitCode > 0) {
                reject(result);
            } else {
                resolve(result);
            }
        });
    });
}

async function run(settings = {}) {
    if (settings.logger) {
        settings.logger.info(`\n$ ${settings.command}`);
    }
    let result = new Result();
    let child = exec(settings.command, settings.options);
    return promiseExec(result, child, settings);
}

exports.run = run;