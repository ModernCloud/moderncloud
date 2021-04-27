const ApiAction = require('../action');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

class GetCurrentSubscription extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadInvoices();
        return this.response.success({
            invoices: this.invoices.data.map(invoice => {
                return {
                    number: invoice.number,
                    total: (invoice.total / 100),
                    invoice_pdf: invoice.invoice_pdf,
                    is_paid: invoice.paid,
                    due_date: invoice.due_date,
                    created: invoice.created
                }
            })
        }, 200);
    }

    async loadInvoices() {
        this.invoices = await stripe.invoices.list({
            customer: this.currentUser.stripe_customer_id,
            limit: 24
        });
    }
}

module.exports = GetCurrentSubscription;