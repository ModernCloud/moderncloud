const fs = require('fs');
const path = require('path');
const { Package } = require('../../common/db');
const render = require('../../common/template/render');
const shelljs = require('shelljs');

module.exports = async (projectId) => {
    let projectPackages = process.env.STORAGE + '/packages/' + projectId;
    let packages = await Package.query()
        .select('name')
        .select(Package.raw('MAX(version) AS version'))
        .where('project_id', projectId)
        .groupBy(['name']);
    fs.mkdirSync(projectPackages, {recursive: true});
    render(
        path.join(__dirname, 'package.json.twig'),
        path.join(projectPackages, 'package.json'),
        {packages: packages}
    )
    shelljs.exec(`npm install --no-fund --no-audit --prod --no-optional --ignore-scripts --no-bin-links --prefix "${projectPackages}"`, {silent: true});
};