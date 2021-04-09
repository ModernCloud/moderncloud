const ApiAction = require('../action');
const axios = require('axios');

class SearchNpmsAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        return this.response.success(await this.searchPackages());
    }

    async searchPackages() {
        let query = this.req.query.q || '';
        if (query.length === 0) {
            return {total: 0, results: []};
        }
        let response = await axios.get(`https://api.npms.io/v2/search?q=${encodeURIComponent(query)}&size=10`);
        return response.data;
    }
}

module.exports = SearchNpmsAction;