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
}
