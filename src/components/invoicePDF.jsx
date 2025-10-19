import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

export const generateInvoicePDF = async (appointmentGroup, customer) => {
    if (!appointmentGroup || appointmentGroup.length === 0) return;

    const firstAppointment = appointmentGroup[0];
    const { rawDate, time } = firstAppointment;

    // --- Totals computation ---
    const totalCost = appointmentGroup.reduce((acc, a) => acc + Number(a.cost || 0), 0);
    const totalPaid = appointmentGroup.reduce((acc, a) => acc + Number(a.paid || 0), 0);
    const totalDue = appointmentGroup.reduce((acc, a) => acc + Number(a.due || 0), 0);

    // --- Colors ---
    const BLACK = [0, 0, 0];
    const WHITE = [255, 255, 255];
    const GOLD = [212, 175, 55];
    const LIGHT_GRAY = [247, 247, 247];
    const DARK_GRAY = [228, 228, 228];
    const DARK_TEXT = [40, 40, 40];
    const MUTED_TEXT = [100, 100, 100];
    const RED = [255, 73, 73];
    const GREEN = [0, 120, 0];

    // --- Currency Formatting Helper ---
    const formatUSD = (amount) => {
        const num = Number(amount) || 0;
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(num);
    };


    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 20;

    // --- HEADER ---
    const headerHeight = 45;
    doc.setFillColor(...BLACK);
    doc.rect(0, 0, pageWidth, headerHeight, "F");

    // --- Salon Logo ---
    try {
        const logo = new Image();
        logo.src = "/LUSTRE.jpg";
        await new Promise((res, rej) => {
            logo.onload = res;
            logo.onerror = rej;
        });
        doc.addImage(logo, "PNG", 15, 8, 30, 28);
    } catch {
        console.warn("Logo failed to load");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...RED);
    doc.text("LUSTRE SALON", pageWidth - 15, 15, { align: "right" });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(230, 230, 230);
    doc.text("Your Premium Grooming Partner", pageWidth - 15, 22, { align: "right" });

    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(25);
    doc.setTextColor(...GOLD);
    doc.text("INVOICE", pageWidth - 15, 30, { align: "right" });

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.8);
    doc.line(15, headerHeight, pageWidth - 15, headerHeight);

    let currentY = headerHeight + 12;

    // --- CUSTOMER + APPOINTMENT DETAILS BOX ---
    const boxWidth = pageWidth * 0.85;
    const boxX = (pageWidth - boxWidth) / 2;
    const boxHeight = 35;
    const boxPaddingX = 10;
    const boxPaddingY = 6;

    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(boxX, currentY - 4, boxWidth, boxHeight, 4, 4, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...DARK_TEXT);
    doc.text("BILL TO", boxX + boxPaddingX, currentY + boxPaddingY);
    doc.text("APPOINTMENT DETAILS", boxX + boxWidth / 2 + 10, currentY + boxPaddingY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED_TEXT);

    doc.text(`Name: ${customer?.name || "Valued Customer"}`, boxX + boxPaddingX, currentY + boxPaddingY + 7);
    doc.text(`Mobile: ${customer?.mobile || "(555) 555-5555"}`, boxX + boxPaddingX, currentY + boxPaddingY + 13);
    doc.text(`Email: ${customer?.email || "customer@email.com"}`, boxX + boxPaddingX, currentY + boxPaddingY + 19);

    doc.text(`Invoice Date: ${dayjs().format("DD MMM YYYY")}`, boxX + boxWidth / 2 + 10, currentY + boxPaddingY + 7);
    doc.text(`Appointment Date: ${dayjs(rawDate).format("DD MMM YYYY")}`, boxX + boxWidth / 2 + 10, currentY + boxPaddingY + 13);
    doc.text(`Time: ${time}`, boxX + boxWidth / 2 + 10, currentY + boxPaddingY + 19);

    currentY += boxHeight + 2;

    // --- SERVICE TABLE ---
    const tableData = appointmentGroup.map((apt, i) => [
        i + 1,
        apt.service,
        apt.subName || "-",
        apt.stylist || "-",
        apt.time,
        formatUSD(apt.cost || 0),
        formatUSD(apt.paid || 0),
        formatUSD(apt.due || 0),
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [["#", "Service", "Sub Name", "Stylist", "Time", "Total (USD)", "Paid (USD)", "Due (USD)"]],
        body: tableData,
        theme: "grid",
        headStyles: {
            fillColor: DARK_GRAY,
            textColor: BLACK,
            fontStyle: "bold",
            halign: "center",
        },
        styles: {
            fontSize: 8,
            textColor: DARK_TEXT,
            cellPadding: 3,
            lineColor: [230, 230, 230],
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        columnStyles: {
            0: { halign: "center", cellWidth: 10 },
            4: { halign: "center", cellWidth: 20 },
            5: { halign: "right", cellWidth: 25 },
            6: { halign: "right", cellWidth: 25 },
            7: { halign: "right", cellWidth: 25 },
        },
        margin: { left: marginX, right: marginX },
    });

    currentY = doc.lastAutoTable.finalY + 2;

    // --- PAYMENT SUMMARY ---
    const sumBoxW = pageWidth * 0.85;
    const sumBoxH = 48;
    const sumBoxX = (pageWidth - sumBoxW) / 2;
    const sumBoxY = currentY;

    doc.setFillColor(...WHITE);
    doc.roundedRect(sumBoxX, sumBoxY, sumBoxW, sumBoxH, 3, 3, "F");

    const innerPad = 10;
    let y = sumBoxY + 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...DARK_TEXT);
    doc.text("Payment Summary", sumBoxX + innerPad, y - 2);

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.line(sumBoxX + innerPad, y + 2, sumBoxX + sumBoxW - innerPad, y + 2);

    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.setTextColor(...MUTED_TEXT);
    doc.text("Total Cost", sumBoxX + innerPad, y);
    doc.setFont("helvetica", "bold");
    doc.text(formatUSD(totalCost), sumBoxX + sumBoxW - innerPad, y, { align: "right" });

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREEN);
    doc.text("Amount Paid", sumBoxX + innerPad, y);
    doc.setFont("helvetica", "bold");
    doc.text(formatUSD(totalPaid), sumBoxX + sumBoxW - innerPad, y, { align: "right" });

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...RED);
    doc.text("Amount Due", sumBoxX + innerPad, y);
    doc.setFont("helvetica", "bold");
    doc.text(formatUSD(totalDue), sumBoxX + sumBoxW - innerPad, y, { align: "right" });

    currentY += sumBoxH + 10;

    // --- MESSAGE BAR ---
    const msgBoxW = pageWidth * 0.85;
    const msgBoxX = (pageWidth - msgBoxW) / 2;
    const msgBoxY = currentY;
    const msgBoxH = 22;

    doc.setFillColor(255, 250, 235);
    doc.roundedRect(msgBoxX, msgBoxY, msgBoxW, msgBoxH, 3, 3, "F");

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);

    const messageText =
        "Please arrive 10 minutes before your scheduled appointment time. We will be waiting for you. Thank you for your patience. Selecting multiple services will increase the total time duration of your booking.";

    const splitText = doc.splitTextToSize(messageText, msgBoxW - 20);
    doc.text(splitText, pageWidth / 2, msgBoxY + 10, { align: "center" });

    currentY += msgBoxH + 10;

    // --- FOOTER ---
    const footerHeight = 32;
    const footerY = pageHeight - footerHeight;

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(0, headerHeight, pageWidth, headerHeight);

    doc.setFillColor(...BLACK);
    doc.rect(0, footerY, pageWidth, footerHeight, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...WHITE);

    doc.text(
        "123 Main Street, New York, NY 10001 | info@lustresalon.com | www.lustresalon.com",
        pageWidth / 2,
        footerY + 10,
        { align: "center" }
    );
    doc.text("Hotline: (800) 555-0199", pageWidth / 2, footerY + 17, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...GOLD);
    doc.text("Thank you for choosing LUSTRE SALON!", pageWidth / 2, footerY + 26, { align: "center" });

    // --- OPEN PDF IN NEW WINDOW ---
    const pdfDataUri = doc.output("dataurlstring");
    const win = window.open();
    win.document.write(`
    <iframe src="${pdfDataUri}" width="100%" height="100%" style="border:none;"></iframe>
    <script>
      setTimeout(() => { window.frames[0].focus(); window.frames[0].print(); }, 500);
    </script>
  `);
};
