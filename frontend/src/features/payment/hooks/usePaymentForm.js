import { useEffect, useMemo, useState } from "react";
import { usePaymentActions } from "./usePaymentActions";

export default function usePaymentForm(payment, open, setOpen, invoices = []) {
  const isEditMode = !!payment;

  const {
    handleCreate,
    handleUpdate,
    isCreating,
    isUpdating,
  } = usePaymentActions();

  /* ================= INITIAL FORM ================= */
  const initialForm = useMemo(
    () => ({
      invoiceId: "",
      amount: "",
      method: "CASH",
      referenceNumber: "",
    }),
    []
  );

  const [form, setForm] = useState(initialForm);

  /* ================= SELECTED INVOICE ================= */
  const selectedInvoice = useMemo(() => {
    if (!form.invoiceId) return null;

    return (
      invoices.find((inv) => String(inv.id) === String(form.invoiceId)) || null
    );
  }, [form.invoiceId, invoices]);

  /* ================= PREFILL / RESET ================= */
  useEffect(() => {
    if (!open) return;

    if (payment && invoices.length > 0) {
      setForm({
        invoiceId: String(payment.invoiceId),
        amount: payment.amount || "",
        method: payment.method || "CASH",
        referenceNumber: payment.referenceNumber || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [payment, invoices, open, initialForm]);

  /* ================= HANDLE INVOICE CHANGE ================= */
  const handleInvoiceChange = (id) => {
    setForm((prev) => ({
      ...prev,
      invoiceId: id,
      amount: "", // reset amount when invoice changes
    }));
  };

  /* ================= ALLOWED AMOUNT ================= */
  const allowedAmount = useMemo(() => {
    if (!selectedInvoice) return 0;

    let remaining = Number(selectedInvoice.remainingAmount || 0);

    // In edit mode, allow previous amount to be reused
    if (isEditMode && payment?.amount) {
      remaining += Number(payment.amount);
    }

    return remaining;
  }, [selectedInvoice, payment, isEditMode]);

  /* ================= VALIDATION ================= */
  const isValid = useMemo(() => {
    if (!form.invoiceId) return false;

    const amount = Number(form.amount);
    if (!amount || amount <= 0) return false;

    if (selectedInvoice && amount > allowedAmount) {
      return false;
    }

    return true;
  }, [form, selectedInvoice, allowedAmount]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!isValid) return;

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    try {
      if (isEditMode) {
        await handleUpdate(payment.id, payload);
      } else {
        await handleCreate(payload);
      }

      setForm(initialForm);
      setOpen(false);
    } catch (err) {
      console.error("Payment submission failed:", err);
    }
  };

  /* ================= RETURN ================= */
  return {
    form,
    setForm,
    selectedInvoice,
    handleInvoiceChange,
    allowedAmount,
    isValid,
    handleSubmit,
    isEditMode,
    isCreating,
    isUpdating,
  };
}