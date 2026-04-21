import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Phone, Mail, MapPin, Eye, Download } from "lucide-react";

import { useDownloadInvoicePDFMutation, useGetInvoiceByIdQuery } from "@/features/invoice/invoiceApi";
import { useGetShopQuery } from "@/features/shop/shopApi";
import PageLoader from "@/components/loaders/PageLoader";

import { formatCurrency, formatDate, formatUnit } from "@/utils/formatters";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function InvoiceDetails() {
  const { id } = useParams();

  const { data: invoice, isLoading, error } = useGetInvoiceByIdQuery(id);
  const [downloadPDF, { isLoading: isDownloading }] = useDownloadInvoicePDFMutation();

  const user = useSelector((state) => state.auth.user);

  const { data: shopData } = useGetShopQuery(user?.shopId, {
    skip: !user?.shopId,
  });

  const shop = shopData?.data;


  const handleDownload = async () => {
    const res = await downloadPDF({ id });

    if (res.data?.blob) {
      const url = window.URL.createObjectURL(res.data.blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      a.click();
    }
  };

  const handlePreview = async () => {
    const res = await downloadPDF({ id });

    if (res.data?.blob) {
      const url = window.URL.createObjectURL(res.data?.blob);

      window.open(url, "_blank");
    }
  };

  if (isLoading) return <PageLoader />;

  if (error || !invoice) {
    return (
      <div className="p-6 text-center text-gray-500">
        Invoice not found
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-4 md:py-10 px-0 sm:px-4">

      <div className="max-w-[210mm] mx-auto overflow-x-auto">

        <div className="flex justify-end gap-3 mb-4 px-4 sm:px-0 no-print">

          {/* PREVIEW */}
          <button
            onClick={handlePreview}
            disabled={isDownloading}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50 shadow-sm"
          >
            <Eye size={16} />
            Preview
          </button>

          {/* DOWNLOAD */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm bg-[#0e8388] text-white rounded-md hover:bg-[#0c6f73] shadow"
          >
            <Download size={16} />
            {isDownloading ? "Downloading..." : "Download"}
          </button>

        </div>

        <div id="invoice-root">
          <Card className="w-full min-w-[320px] md:w-[210mm] bg-white shadow-lg border-none rounded-none overflow-hidden">

            <CardContent className="p-0 flex flex-col h-full">

              {/* ================= HEADER ================= */}
              <div className="px-6 md:px-12 pt-8 md:pt-12 pb-6 border-b">

                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">

                  <div className="max-w-xs">
                    <h2 className="text-xl md:text-2xl font-bold text-[#0e8388]">
                      {user?.shopName}
                    </h2>

                    <div className="mt-2 space-y-1 text-[11px] md:text-sm text-gray-600">
                      <p>{shop?.ownername}</p>
                      <p>{shop?.address}</p>
                      <p>{shop?.phone}</p>
                    </div>
                  </div>

                  {/* RIGHT -> INVOICE META */}
                  <div className="w-full sm:w-auto border border-[#0e8388]/20 rounded-md p-3 sm:p-4 bg-[#0e8388]/5 text-[11px] md:text-sm text-gray-700 space-y-1">

                    <div className="flex justify-between gap-6">
                      <span className="font-medium text-gray-500">Invoice No</span>
                      <span className="font-semibold text-[#0e8388]">
                        #{invoice.invoiceNumber}
                      </span>
                    </div>

                    <div className="flex justify-between gap-6">
                      <span className="font-medium text-gray-500">Issued Date</span>
                      <span>{formatDate(invoice.createdAt)}</span>
                    </div>

                    <div className="flex justify-between gap-6">
                      <span className="font-medium text-gray-500">Due Date</span>
                      <span>{formatDate(invoice.dueDate)}</span>
                    </div>

                  </div>
                </div>

                <div className="mt-6 h-0.5 w-full bg-[#0e8388]/20"></div>

                {/* CUSTOMER */}
                <div className="mt-4 flex justify-end">
                  <div className="w-full sm:w-1/2 sm:text-right">

                    <h3 className="font-semibold text-[#0e8388] text-[12px] md:text-sm mb-1 tracking-wide">
                      CUSTOMER DETAILS
                    </h3>

                    <div className="text-[12px] md:text-sm text-gray-700">
                      <p className="font-bold uppercase">
                        Name: {invoice.customerName}
                      </p>
                      <p className="text-gray-600">
                        Address: {invoice.customerAddress || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Phone: {invoice.customerPhone || "N/A"}
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              {/* ================= TABLE ================= */}
              <div className="px-6 md:px-12 mt-4 grow overflow-hidden">

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#e0f2f1]">
                      <TableRow>
                        <TableHead className="text-[#0e8388] text-[10px] md:text-sm">NO</TableHead>
                        <TableHead className="text-[#0e8388] text-[10px] md:text-sm">DESCRIPTION</TableHead>
                        <TableHead className="text-center text-[#0e8388] text-[10px] md:text-sm">PRICE</TableHead>
                        <TableHead className="text-center text-[#0e8388] text-[10px] md:text-sm">QTY</TableHead>
                        <TableHead className="text-right text-[#0e8388] text-[10px] md:text-sm">TOTAL</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {invoice.items.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell className="text-center">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center items-center gap-1">
                              <span>{item.quantity}</span>
                              <span className="text-[10px] text-gray-500">
                                {formatUnit(item.unit)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(item.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* ================= TOTAL ================= */}
                <div className="flex flex-col sm:flex-row justify-between mt-10 gap-6">

                  {/* LEFT */}
                  <div className="order-2 sm:order-1 flex items-end">
                    <p className="text-[#0e8388] font-semibold text-[12px] md:text-sm tracking-wide">
                      THANK YOU FOR YOUR BUSINESS
                    </p>
                  </div>

                  {/* RIGHT SUMMARY CARD */}
                  <div className="order-1 sm:order-2 w-full sm:w-60">

                    <div className="bg-gray-50 border rounded-lg p-4 shadow-sm space-y-3">

                      {/* SUBTOTAL */}
                      <div className="flex justify-between text-[12px] md:text-sm">
                        <span className="text-gray-600 font-medium">Subtotal</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(invoice.totalAmount)}
                        </span>
                      </div>

                      {/* PAID */}
                      <div className="flex justify-between text-[12px] md:text-sm">
                        <span className="text-green-600 font-medium">Paid</span>
                        <span className="font-semibold text-green-600">
                          + {formatCurrency(invoice.paidAmount)}
                        </span>
                      </div>

                      {/* DIVIDER */}
                      <div className="border-t my-2"></div>

                      {/* BALANCE */}
                      <div className="flex justify-between items-center text-[13px] md:text-base font-bold">
                        <span className="text-red-600 uppercase">Balance</span>
                        <span className="text-red-600 text-lg">
                          {formatCurrency(invoice.remainingAmount)}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* ================= TERMS + SIGNATURE ================= */}
              <div className="px-6 md:px-12 py-8 border-t flex flex-col sm:flex-row justify-between gap-10">

                {/* TERMS */}
                <div className="max-w-sm space-y-2">
                  <h4 className="font-semibold text-[12px] md:text-sm uppercase tracking-wide text-gray-700">
                    Terms & Conditions
                  </h4>

                  <p className="text-[10px] md:text-[11px] text-gray-500 leading-relaxed">
                    Thank you for doing business with us. Please ensure payment is made by the due date.
                    Late payments may be subject to additional charges.
                  </p>
                </div>

                {/* SIGNATURE */}
                <div className="flex flex-col items-center sm:items-end justify-end w-full sm:w-56">

                  <div className="w-full sm:w-44 border-b border-gray-400 mb-2"></div>

                  <p className="text-[11px] md:text-sm font-medium text-gray-700">
                    Authorized Signature
                  </p>
                </div>
              </div>

              {/* ================= FOOTER ================= */}
              <div className="bg-[#e0f2f1] px-6 md:px-12 py-5 border-t">

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[10px] md:text-[11px] text-gray-700">

                  {/* PHONE */}
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#0e8388]" />
                    <span className="truncate">{shop?.phone || "N/A"}</span>
                  </div>

                  {/* EMAIL */}
                  <div className="flex items-center gap-2 break-all justify-start sm:justify-center">
                    <Mail size={14} className="text-[#0e8388]" />
                    <span>{user?.email || "N/A"}</span>
                  </div>

                  {/* ADDRESS */}
                  <div className="flex items-center gap-2 justify-start sm:justify-end">
                    <MapPin size={14} className="text-[#0e8388]" />
                    <span className="truncate">{shop?.address || "N/A"}</span>
                  </div>

                </div>

              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}