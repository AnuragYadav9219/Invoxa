export const entityConfig = {
  item: {
    label: (item) => item.name,
  },

  invoice: {
    label: (inv) => `${inv.invoiceNumber}`,
  },

  customer: {
    label: (cus) => cus.name,
  },

  payment: {
    label: (pay) =>
      `₹${pay.amount} • ${pay.method} • ${pay.referenceNumber || "No Ref"}`,
  }
};