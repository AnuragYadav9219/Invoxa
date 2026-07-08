export const sampleInvoice = {

    shop: {
        name: "Invoxa Technologies",
        owner: "Anurag Yadav",
        phone: "+91 9876543210",
        email: "contact@invoxa.com",
        address: "Lucknow, Uttar Pradesh",
    },

    customer: {
        name: "John Smith",
        phone: "+91 9999999999",
        address: "Delhi, India",
    },

    invoiceInfo: {
        number: "INV-2026-0001",
        createdAt: "2026-07-05",
        dueDate: "2026-07-15",
    },

    payment: {
        total: 42500,
        paid: 12000,
        remaining: 30500,
    },

    items: [

        {
            itemName: "Laptop",
            quantity: 1,
            unit: "PIECE",
            price: 35000,
            total: 35000,
        },

        {
            itemName: "Wireless Mouse",
            quantity: 2,
            unit: "PIECE",
            price: 2500,
            total: 5000,
        },

        {
            itemName: "Keyboard",
            quantity: 1,
            unit: "PIECE",
            price: 2500,
            total: 2500,
        },

    ],

};