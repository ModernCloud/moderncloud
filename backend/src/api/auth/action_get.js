const ApiAction = require('../action');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        return this.response.success({user: {
            id: this.currentUser.id,
            name: this.currentUser.name,
            email: this.currentUser.email
        }}, 200);
    }
}

module.exports = GetAction;