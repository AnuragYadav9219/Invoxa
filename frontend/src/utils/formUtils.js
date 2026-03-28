import { showPromise, showWarning } from '@/components/toast/toast';
import {
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
} from '@/features/invoice/invoiceApi';
import { useEffect, useState } from 'react';

export default function formUtils(invoice, open, setOpen) {
  const isEditMode = !!invoice;

  const [createInvoice, { isLoading: isCreating }] =
    useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: isUpdating }] =
    useUpdateInvoiceMutation();

  /* ================= STATE ================= */

  const initialForm = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    dueDate: null,
  };

  const [form, setForm] = useState(initialForm);

  const createItemObj = () => ({
    id: crypto.randomUUID(),
    itemId: null,
    name: '',
    quantity: 1,
    price: 0,
  });

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState(createItemObj());

  /* ================= HELPERS ================= */

  const toNumber = (val) => Number(val) || 0;

  const isValidEmail = (email) =>
    !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone) =>
    !phone || /^[0-9]{7,15}$/.test(phone);

  const isValidDate = (date) =>
    !date || !isNaN(new Date(date).getTime());

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (!open) return;

    if (invoice) {
      setForm({
        customerName: invoice.customerName || '',
        customerEmail: invoice.customerEmail || '',
        customerPhone: invoice.customerPhone || '',
        dueDate: invoice.dueDate || null,
      });

      setItems(
        (invoice.items || []).map((item) => ({
          id: crypto.randomUUID(),
          itemId: item.itemId,         
          name: item.itemName,
          quantity: item.quantity,
          price: item.price,
        }))
      );
    } else {
      resetForm();
    }
  }, [invoice, open]);

  const resetForm = () => {
    setForm(initialForm);
    setItems([]);
    setNewItem(createItemObj());
  };

  /* ================= ADD ITEM ================= */

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

    const exists = items.find(
      (i) => i.itemId === newItem.itemId
    );

    if (exists) {
      return showWarning('Item already added');
    }

    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        itemId: newItem.itemId,
        name: newItem.name.trim(),
        quantity,
        price,
      },
    ]);

    setNewItem(createItemObj());
  };

  /* ================= REMOVE ================= */

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  /* ================= TOTAL ================= */

  const totalAmount = items.reduce(
    (sum, i) => sum + toNumber(i.quantity) * toNumber(i.price),
    0
  );

  /* ================= FORMAT ITEMS ================= */

  const formatItems = () => {
    return items.map((item) => ({
      itemId: item.itemId,
      quantity: toNumber(item.quantity),
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      if (!form.customerName?.trim()) {
        return showWarning('Customer name is required');
      }

      if (!isValidEmail(form.customerEmail)) {
        return showWarning('Invalid email');
      }

      if (!isValidPhone(form.customerPhone)) {
        return showWarning('Invalid phone');
      }

      if (!isValidDate(form.dueDate)) {
        return showWarning('Invalid date');
      }

      if (!items.length) {
        return showWarning('Add at least one item');
      }

      const payload = {
        ...form,
        items: formatItems(),
      };

      const action = isEditMode
        ? updateInvoice({ id: invoice.id, body: payload }).unwrap()
        : createInvoice(payload).unwrap();

      showPromise(action, {
        loading: isEditMode ? 'Updating invoice...' : 'Creating invoice...',
        success: isEditMode
          ? 'Invoice updated successfully'
          : 'Invoice created successfully',
        error: 'Something went wrong',
      });

      await action;
      setOpen(false);
    } catch (err) {
      console.error(err);
      showWarning(err.message || 'Something went wrong');
    }
  };

  /* ================= RETURN ================= */

  return {
    form,
    setForm,
    items,
    setItems,
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