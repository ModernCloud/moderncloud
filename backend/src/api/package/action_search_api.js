const ApiAction = require('../action');
const axios = require('axios');
const {PythonPackage} = require('../../common/db');

class SearchApiAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        if (this.req.query.language && this.req.query.language === 'javascript') {
            return this.response.success(await this.searchNodejsPackages());
        } else if (this.req.query.language && this.req.query.language === 'python') {
                return this.response.success(await this.searchPythonPackages());
        } else {
            return this.response.success([]);
        }
    }

    async searchNodejsPackages() {
        let query = this.req.query.q || '';
        if (query.length === 0) {
            return []
        }
        let response = await axios.get(`https://api.npms.io/v2/search?q=${encodeURIComponent(query)}&size=10`);
        return response.data.results.map(item => {
            return {
                label: item.package.name,
                description: item.package.description,
                version: item.package.version
            }
        });
    }

    async searchPythonPackages() {
        let query = this.req.query.q || '';
        if (query.length === 0) {
            return {total: 0, results: []};
        }
        let result = await PythonPackage.query()
            .select('name')
            .max('version', {as: 'version'})
            .where('name', 'like', `${query}%`)
            .groupBy('name')
            .limit(10);
        return result.map(row => {
            return {
                label: row.name,
                description: null,
                version: row.version
            }
        });
    }
}

module.exports = SearchApiAction;