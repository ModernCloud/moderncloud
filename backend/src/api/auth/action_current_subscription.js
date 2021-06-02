const ApiAction = require('../action');
const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

class GetCurrentSubscription extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadSubscription();
        return this.response.success({
            subscription: {
                cancel_at: this.subscription.cancel_at,
                start_at: this.subscription.start_at,
                current_period_end: this.subscription.current_period_end,
                package_name: this.subscription.items.data[0].price.id === process.env.STRIPE_PACKAGE_PERSONAL_PRICE_ID ? 'Personal' : 'Team',
                is_trial: this.subscription.trial_end > (Math.floor(Date.now() / 1000))
            }
        }, 200);
    }

    async loadSubscription() {
        if (process.env.BILLING_ENABLED === false) {
            this.subscription = {
                cancel_at: null,
                start_at: moment().add(-11, 'year').unix(),
                current_period_end: moment().add(1, 'year').unix(),
                package_name: 'Personal',
                is_trial: true
            };
            return;
        }
        this.subscription = await stripe.subscriptions.retrieve(this.currentUser.current_subscription_id);
    }
}

module.exports = GetCurrentSubscription;