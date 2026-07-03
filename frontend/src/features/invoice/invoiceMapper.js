export function mapInvoice(invoice, shop, user) {

    return {

        shop: {
            name: user?.shopName,
            owner: user?.ownerName,
            phone: user?.phone,
            email: user?.email,
            address: user?.address,
        },

        customer: {

            name: invoice.customerName,
            phone: invoice.customerPhone,
            address: invoice.customerAddress,

        },

        invoiceInfo: {

            number: invoice.invoiceNumber,
            createdAt: invoice.createdAt,
            dueDate: invoice.dueDate,

        },

        items: invoice.items,

        payment: {

            total: invoice.totalAmount,
            paid: invoice.paidAmount,
            remaining: invoice.remainingAmount

        }

    };

}