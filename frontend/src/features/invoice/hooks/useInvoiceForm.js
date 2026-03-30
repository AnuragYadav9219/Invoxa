import React, { useEffect, useState } from 'react'
import { useInvoiceActions } from './useInvoiceActions';
import { showWarning } from '@/components/toast/toast';

export default function useInvoiceForm(invoice, open, setOpen, itemsData = []) {
    const isEditMode = !!invoice;

    const { handleCreate, handleUpdate, isCreating, isUpdating } = useInvoiceActions();

    const initialForm = {
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        dueDate: null,
    };

    const [form, setForm] = useState(initialForm);
    const [items, setItems] = useState([]);

    const createItemObj = () => ({
        id: crypto.randomUUID(),
        name: "",
        quantity: 1,
        price: 0,
    });

    const [newItem, setNewItem] = useState(createItemObj());

    /* ================= HELPERS ================= */

    const toNumber = (val) => Number(val) || 0;

    const isValidEmail = (email) =>
        !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValidPhone = (phone) =>
        !phone || /^[0-9]{7,15}$/.test(phone);

    const isValidDate = (date) =>
        !date || !isNaN(new Date(date).getTime());

    /* ================= EFFECT ================== */
    useEffect(() => {
        if (!open) return;

        if (invoice) {
            setForm({
                customerName: invoice.customerName || "",
                customerEmail: invoice.customerEmail || "",
                customerPhone: invoice.customerPhone || "",
                dueDate: invoice.dueDate || null,
            });

            setItems(
                (invoice.items || []).map((item) => ({
                    id: crypto.randomUUID(),
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

    /* ================ ADD ITEM ================= */
    const handleAddItem = () => {
        const price = toNumber(newItem.price);
        const quantity = toNumber(newItem.quantity);

        if (!newItem.name?.trim()) {
            return showWarning("Item name is required");
        }

        if (price <= 0) {
            return showWarning("Price must be greater than 0");
        }

        if (quantity <= 0) {
            return showWarning("Quantity must be at least 1");
        }

        const exists = items.find(
            (i) => i.itemId === newItem.itemId
        );

        if (exists) {
            return showWarning("Item already added");
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
    }

    /* =============== REMOVE ================== */
    const removeItem = (id) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    /* =============== TOTAL =================== */
    const totalAmount = items.reduce(
        (sum, i) => sum + toNumber(i.quantity) * toNumber(i.price),
        0
    );

    /* =============== VALIDATION ================ */
    const validate = () => {
        if (!form.customerName?.trim()) {
            showWarning("Customer name required");
            return false;
        }

        if (!isValidEmail(form.customerEmail)) {
            showWarning("Invalid email");
            return false;
        }

        if (!isValidPhone(form.customerPhone)) {
            showWarning("Invalid phone");
            return false;
        }

        if (!isValidDate(form.dueDate)) {
            showWarning("Invalid date");
            return false;
        }

        if (!items.length) {
            showWarning("Add at least one item");
            return false;
        }

        return true;
    };

    /* =============== FORMAT ================= */
    const formatItems = () =>
        items.map((item) => ({
            itemName: item.name,
            price: toNumber(item.price),
            quantity: toNumber(item.quantity),
        }));

    /* ================= SUBMIT ================ */
    const handleSubmit = async () => {
        if (!validate()) return;

        const payload = {
            ...form,
            items: formatItems(),
        };

        if (isEditMode) {
            await handleUpdate(invoice.id, payload);
        } else {
            await handleCreate(payload);
        }

        setOpen(false);
    }

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
