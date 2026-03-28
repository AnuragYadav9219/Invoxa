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
  const normalize = (str) => str?.trim().toLowerCase();

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

      // ✅ Replace items (NO duplication)
      setItems(
        (invoice.items || []).map((item, index) => ({
          id: item.itemId || `${index}`,
          itemId: item.itemId || null,
          name: item.itemName || '',
          quantity: item.quantity || 1,
          price: item.price || 0,
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
      (i) => normalize(i.name) === normalize(newItem.name)
    );

    if (exists) {
      return showWarning('Item already added');
    }

    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        itemId: newItem.itemId || null,
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

  const formatItems = async () => {
    const formatted = [];

    for (const item of items) {
      let itemId = item.itemId;

      // Step 1: find existing item
      if (!itemId) {
        const existing = itemsData?.find(
          (i) => normalize(i.name) === normalize(item.name)
        );

        if (existing?.id) {
          itemId = existing.id;
        } else {
          // Step 2: create new item
          try {
            const res = await createItem({
              name: item.name.trim(),
              price: item.price,
            }).unwrap();

            itemId = res?.data?.id || res?.id;

            if (!itemId) {
              throw new Error('Item creation failed');
            }
          } catch {
            throw new Error('Failed to create item');
          }
        }
      }

      // Step 3: merge duplicates
      const existingFormatted = formatted.find(
        (f) => f.itemId === itemId
      );

      if (existingFormatted) {
        existingFormatted.quantity += toNumber(item.quantity);
      } else {
        formatted.push({
          itemId,
          quantity: toNumber(item.quantity),
        });
      }
    }

    return formatted;
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

      const formattedItems = await formatItems();

      const payload = {
        ...form,
        items: formattedItems,
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