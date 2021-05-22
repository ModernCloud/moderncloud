const axios = require('axios');

module.exports = async (projectId, runtime = null) => {
    try {
        await axios.post(
            `${process.env.LSP_URL}/packages/sync`,
            {project_id: projectId, runtime: runtime},
            {headers: {authorization: `Bearar ${process.env.LSP_TOKEN}`}}
        );
    } catch (e) {
        console.log(e);
    }
};