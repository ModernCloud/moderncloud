const axios = require('axios');

module.exports = async (projectId) => {
    try {
        await axios.post(
            `${process.env.LSP_URL}/packages/sync`,
            {project_id: projectId},
            {headers: {authorization: `Bearar ${process.env.LSP_TOKEN}`}}
        );
    } catch (e) {
        console.log(e);
    }
};