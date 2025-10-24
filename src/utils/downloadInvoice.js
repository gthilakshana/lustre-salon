// src/utils/downloadInvoice.js
import axios from "axios";

export const downloadInvoice = async (appointmentGroup, customer) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/invoices/generate`,
      { appointmentGroup, customer },
      { responseType: "blob" } // important for mobile download
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Invoice download failed", err);
    alert("Failed to download invoice");
  }
};
