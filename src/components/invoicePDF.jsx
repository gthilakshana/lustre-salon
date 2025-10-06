// src/components/invoicePDF.js
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import dayjs from "dayjs";

export const generateInvoicePDF = async (appointmentGroup, customer) => {
    if (!appointmentGroup || appointmentGroup.length === 0) return;

    // Use appointmentGroup[0] for core details
    const firstAppointment = appointmentGroup[0];
    const { rawDate, time } = firstAppointment;

    const totalCost = appointmentGroup.reduce((acc, a) => acc + (a.cost || 0), 0);
    const totalDue = appointmentGroup.reduce((acc, a) => acc + (a.due || 0), 0);
    const totalPaid = totalCost - totalDue;

    // Define Colors
    const BLACK = [0, 0, 0];
    const WHITE = [255, 255, 255];
    const RED = [205, 0, 0];
    const LIGHT_GRAY = [245, 245, 245];
    const DARK_GRAY_TEXT = [50, 50, 50];

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 20;
    let currentY = 0;

    // --- Header (BLACK Background) ---
    const headerHeight = 45;
    doc.setFillColor(...BLACK);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    // Load salon logo safely
    try {
        const img = new Image();
        img.src = "/LUSTRE.jpg";
        await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });

        doc.addImage(img, "PNG", 14, 7, 35, 30);
    } catch (err) {
        console.warn("Salon logo failed to load:", err);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...WHITE);
    doc.text("LUSTRE SALON", pageWidth - 14, 18, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Your Premium Grooming Partner", pageWidth - 14, 25, { align: "right" });

    doc.setFontSize(14);
    doc.text("SERVICE INVOICE", pageWidth - 14, 35, { align: "right" });

    currentY = headerHeight + 10;

    // --- Customer Details and Appointment Info ---
    doc.setDrawColor(...RED);
    doc.setLineWidth(0.5);
    doc.line(marginX, currentY, pageWidth - marginX, currentY);
    currentY += 8;

    // Left Column: Customer Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BLACK);
    doc.text("BILLED TO:", marginX, currentY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK_GRAY_TEXT);
    doc.text(`Name: ${customer?.name || "Valued Customer"}`, marginX, currentY + 6);
    // Corrected mobile number prefix
    doc.text(`Mobile: +94 ${customer?.mobile || "Customer Number"}`, marginX, currentY + 12);
    doc.text(`Email: ${customer?.email || "Customer email"}`, marginX, currentY + 18);

    // Right Column: Invoice/Booking Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BLACK);
    doc.text("APPOINTMENT INFO:", pageWidth / 2, currentY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK_GRAY_TEXT);
    doc.text(`Invoice Date: ${dayjs().format("DD MMMM YYYY")}`, pageWidth / 2, currentY + 6);
    doc.text(`Appointment Date: ${dayjs(rawDate).format("DD MMMM YYYY")}`, pageWidth / 2, currentY + 12);
    doc.text(`Time: ${time}`, pageWidth / 2, currentY + 18);

    currentY += 28;

    // --- Salon Description (Middle Section) ---
    const descriptionBlockY = currentY + 5;
    const descriptionBlockHeight = 15;
    doc.setFillColor(...LIGHT_GRAY);
    doc.rect(marginX, descriptionBlockY, pageWidth - (2 * marginX), descriptionBlockHeight, 'F');

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...DARK_GRAY_TEXT);
    doc.text("Lustre Salon is committed to providing a luxurious experience with expert stylists and premium products.", pageWidth / 2, descriptionBlockY + 9, { align: 'center' });

    currentY += descriptionBlockHeight + 10;

    // --- Services Table ---
    const tableData = appointmentGroup.map((apt, idx) => [
        (idx + 1).toString(),
        apt.service,
        apt.subName || "-",
        apt.stylist || "-",
        apt.time,
        apt.payment === "Book Only" ? "-" : Number(apt.cost || 0).toLocaleString() + " LKR",
        apt.payment === "Full Payment" ? "-" : Number(apt.due || 0).toLocaleString() + " LKR",
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [["#", "Service", "Sub Name", "Stylist", "Time", "Cost (LKR)", "Due (LKR)"]],
        body: tableData,
        theme: 'striped',
        styles: { fontSize: 9, textColor: DARK_GRAY_TEXT, cellPadding: 4 },
        headStyles: { fillColor: BLACK, textColor: WHITE, fontStyle: 'bold', halign: 'center' },
        alternateRowStyles: { fillColor: LIGHT_GRAY },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            4: { halign: 'center' },
            5: { halign: 'right' },
            6: { halign: 'right' }
        },
        margin: { left: marginX, right: marginX },
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // --- Totals Box ---
    const summaryBoxWidth = 70;
    const summaryBoxHeight = 35;
    const summaryBoxX = pageWidth - summaryBoxWidth - marginX;

    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(summaryBoxX, currentY, summaryBoxWidth, summaryBoxHeight, 2, 2, 'F');

    let yOffset = currentY + 7;

    // 1. Total Cost
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...DARK_GRAY_TEXT);
    doc.text("Subtotal:", summaryBoxX + 4, yOffset);
    doc.text(`${totalCost.toLocaleString()} LKR`, summaryBoxX + summaryBoxWidth - 4, yOffset, { align: 'right' });
    yOffset += 8;

    // 2. Amount Paid
    doc.text("Amount Paid:", summaryBoxX + 4, yOffset);
    doc.text(`${totalPaid.toLocaleString()} LKR`, summaryBoxX + summaryBoxWidth - 4, yOffset, { align: 'right' });
    yOffset += 9;

    // 3. Due Amount (Highlighted)
    doc.setDrawColor(...RED);
    doc.line(summaryBoxX + 3, yOffset - 2, summaryBoxX + summaryBoxWidth - 3, yOffset - 2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...RED);
    doc.text("AMOUNT DUE:", summaryBoxX + 4, yOffset + 4);
    doc.text(`${totalDue.toLocaleString()} LKR`, summaryBoxX + summaryBoxWidth - 4, yOffset + 4, { align: 'right' });

    // --- Footer & Contact Info (Bottom Bar) ---
    const footerHeight = 40;
    const pageHeight = doc.internal.pageSize.getHeight();
    currentY = pageHeight - footerHeight;
    doc.setFillColor(...BLACK);
    doc.rect(0, currentY, pageWidth, footerHeight, 'F');

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...WHITE);

    // Salon Contact/Address
    doc.text("123 Main Street, Colombo, Sri Lanka | info@lustresalon.com", pageWidth / 2, currentY + 10, { align: 'center' });
    doc.text("Hotline: +94 77 133 456", pageWidth / 2, currentY + 18, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for choosing LUSTRE SALON!", pageWidth / 2, currentY + 30, { align: 'center' });

    // --- Open PDF ---
    const pdfDataUri = doc.output('dataurlstring');
    const win = window.open();
    win.document.write(`
        <iframe src="${pdfDataUri}" width="100%" height="100%" style="border:none;"></iframe>
        <script>
            setTimeout(() => { window.frames[0].focus(); window.frames[0].print(); }, 500);
        </script>
    `);
};