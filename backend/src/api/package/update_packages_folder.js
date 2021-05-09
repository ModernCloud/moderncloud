const fs = require('fs');
const { Package } = require('../../common/db');
const render = require('../../common/template/render');

module.exports = async (projectId) => {
    let projectPackages = process.env.STORAGE + '/projects/' + projectId + '/packages';
    let packages = await Package.query().where('project_id', projectId).groupBy(['name']);
    fs.mkdirSync(projectPackages, {recursive: true});
    render(
        path.join(__dirname, 'package.json.twig'),
        path.join(projectPackages, 'package.json'),
        {packages: packages}
    )
};