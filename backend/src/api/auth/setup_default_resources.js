const { Project, Environment, Endpoint, Function } = require('../../common/db');
const updatePackagesFolder = require('../package/update_packages_folder');

async function createDefaultProject(transaction, user) {
    return Project.query(transaction).insert({
        user_id: user.id,
        name: 'default'
    });
}

async function createDefaultEnvironments(transaction, project) {
    await Environment.query(transaction).insert({
        user_id: project.user_id,
        project_id: project.id,
        name: 'dev',
        region: 'us-east-1'
    });
    await Environment.query(transaction).insert({
        user_id: project.user_id,
        project_id: project.id,
        name: 'prod',
        region: 'us-east-1'
    });
}

async function createDefaultEndpoints(transaction, project) {
    await Endpoint.query(transaction).insert({
        user_id: project.user_id,
        project_id: project.id,
        user_name: 'Hello World',
        name: 'endpoint_function_' + Date.now(),
        main_file: 'index.js',
        handler: 'index.handler',
        runtime: 'nodejs14.x',
        code: `exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({time: Date.now(), message: "Hello World"}),
  }
}`,
        method: 'GET',
        path: '/hello-world'
    });
}

async function createDefaultFunctions(transaction, project) {
    await Function.query(transaction).insert({
        user_id: project.user_id,
        project_id: project.id,
        user_name: 'My Function',
        name: 'function_' + Date.now(),
        main_file: 'index.js',
        handler: 'index.handler',
        runtime: 'nodejs14.x',
        code: `exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({time: Date.now(), message: "my function"}),
  }
}`,
    });
}

module.exports = async (transaction, user) => {
    let project = await createDefaultProject(transaction, user);
    await createDefaultEnvironments(transaction, project);
    await createDefaultEndpoints(transaction, project);
    await createDefaultFunctions(transaction, project);
    await updatePackagesFolder(project.id);
};