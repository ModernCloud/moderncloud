const { User } = require('../../common/db');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const startTrialSubscription = async(transaction, user) => {
    let subscription = await stripe.subscriptions.create({
        customer: user.stripe_customer_id,
        items: [{
            price: process.env.STRIPE_PACKAGE_PERSONAL_PRICE_ID
        }],
        trial_period_days: 30
    });
    user.current_subscription_id = subscription.id;
    user.current_subscription_status = subscription.status;
    await User.query(transaction).where('id', user.id).update({
        current_subscription_id: subscription.id,
        current_subscription_status: subscription.status
    });
};

module.exports = async(transaction, user) => {
    let customer = await stripe.customers.create({
        name: user.name,
        email: user.email
    });
    user.stripe_customer_id = customer.id;
    await User.query(transaction).where('id', user.id).update({
        stripe_customer_id: user.stripe_customer_id
    });
    await startTrialSubscription(transaction, user);
}