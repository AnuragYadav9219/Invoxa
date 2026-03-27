import { showPromise, showWarning } from '@/components/toast/toast';
import {
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} from '@/features/invoice/invoiceApi';
import { useCreateItemMutation } from '@/features/item/itemApi';
import { useEffect, useState } from 'react';

export default function formUtils(invoice, open, setOpen, itemsData = []) {
  const isEditMode = !!invoice;

  const [createItem] = useCreateItemMutation();
  const [createInvoice, { isLoading: isCreating }] =
    useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: isUpdating }] =
    useUpdateInvoiceMutation();

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    dueDate: null,
  });

  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    price: '',
    itemId: '',
  });

  /* ================= HELPERS ================= */

  const toNumber = (val) => {
    if (val === '' || val === null || val === undefined) return 0;
    return Number(val);
  };

  const normalize = (str) => str?.trim().toLowerCase();

  const isValidEmail = (email) =>
    !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone) =>
    !phone || /^[0-9]{7,15}$/.test(phone);

  const isValidDate = (date) =>
    !date || !isNaN(new Date(date).getTime());

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (invoice && open) {
      setForm({
        customerName: invoice.customerName || '',
        customerEmail: invoice.customerEmail || '',
        customerPhone: invoice.customerPhone || '',
        dueDate: invoice.dueDate || null,
      });
      setItems(invoice.items || []);
    } else if (!open) {
      resetForm();
    }
  }, [invoice, open]);

  const resetForm = () => {
    setForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      dueDate: null,
    });
    setItems([]);
  };

  /* ================= ITEM ADD ================= */

  const handleAddItem = () => {
    const price = toNumber(newItem.price);
    const quantity = toNumber(newItem.quantity);

    if (!newItem.name?.trim()) {
      return showWarning('Item name is required');
    }

    if (price <= 0) {
      return showWarning('Price must be greater than 0');
    }

    if (quantity <= 0) {
      return showWarning('Quantity must be at least 1');
    }

    // Prevent duplicate items (SaaS behavior)
    const exists = items.find(
      (i) => normalize(i.name) === normalize(newItem.name)
    );

    if (exists) {
      return showWarning('Item already added');
    }

    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        itemId: newItem.itemId || null,
        name: newItem.name.trim(),
        quantity,
        price,
      },
    ]);

    setNewItem({
      name: '',
      quantity: 1,
      price: '',
      itemId: '',
    });
  };

  const removeItem = (id) => {
    setItems((prev) =>
      prev.filter((i) => (i.id || i._id) !== id)
    );
  };

  /* ================= TOTAL ================= */

  const totalAmount = items.reduce(
    (sum, i) => sum + toNumber(i.quantity) * toNumber(i.price),
    0
  );

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      /* -------- FORM VALIDATION -------- */

      if (!form.customerName?.trim()) {
        return showWarning('Customer name is required');
      }

      if (!isValidEmail(form.customerEmail)) {
        return showWarning('Invalid email format');
      }

      if (!isValidPhone(form.customerPhone)) {
        return showWarning('Invalid phone number');
      }

      if (!isValidDate(form.dueDate)) {
        return showWarning('Invalid due date');
      }

      if (!items.length) {
        return showWarning('Add at least one item');
      }

      /* -------- ITEMS PROCESS -------- */

      const formattedItems = [];

      for (const item of items) {
        let itemId = item.itemId;

        if (!itemId) {
          const existing = itemsData.find(
            (i) => normalize(i.name) === normalize(item.name)
          );

          if (existing) {
            itemId = existing.id;
          } else {
            try {
              const res = await createItem({
                name: item.name.trim(),
                price: item.price,
              }).unwrap();

              itemId = res?.data?.id || res?.id;
            } catch (err) {
              return showWarning('Failed to create item');
            }
          }
        }

        formattedItems.push({
          itemId,
          itemName: item.name,
          quantity: toNumber(item.quantity),
          price: toNumber(item.price),
        });
      }

      /* -------- PAYLOAD -------- */

      const payload = {
        ...form,
        items: formattedItems,
      };

      const action = isEditMode
        ? updateInvoice({ id: invoice.id, ...payload }).unwrap()
        : createInvoice(payload).unwrap();

      showPromise(action, {
        loading: isEditMode ? 'Updating...' : 'Creating...',
        success: isEditMode ? 'Updated' : 'Created',
        error: 'Failed',
      });

      await action;
      setOpen(false);

    } catch (err) {
      showWarning('Something went wrong. Please try again.');
    }
  };

  return {
    form,
    setForm,
    items,
    newItem,
    setNewItem,
    handleAddItem,
    removeItem,
    handleSubmit,
    totalAmount,
    isEditMode,
    isCreating,
    isUpdating,
  };
}