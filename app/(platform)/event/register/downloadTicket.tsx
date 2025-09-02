"use client";

import { FC } from "react";
import QRCodeLib from "qrcode";
import QRCode from "react-qr-code";
import { Download } from "lucide-react";

interface DownloadTicketProps {
  qrData: string;
  fullName: string;
  email: string;
  eventName: string;
  ticketCode: string;
}

const DownloadTicket: FC<DownloadTicketProps> = ({ qrData, fullName, email, eventName, ticketCode }) => {
  const downloadETicket = async () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 700; // horizontal
      canvas.height = 320;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background gradient ringan
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#E0F7FA");
      gradient.addColorStop(1, "#FFFFFF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header Event di pojok kiri
      ctx.fillStyle = "#00695C";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(eventName, 20, 50);

      // Divider horizontal putus-putus di bawah header
      ctx.strokeStyle = "#004D40";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(20, 70);
      ctx.lineTo(canvas.width - 20, 70);
      ctx.stroke();
      ctx.setLineDash([]);

      // QR Code di kiri bawah header
      const qrSize = 180;
      const qrCanvas = document.createElement("canvas");
      await QRCodeLib.toCanvas(qrCanvas, qrData, { width: qrSize });
      ctx.drawImage(qrCanvas, 20, 90);

      // Info peserta di kanan QR
      ctx.fillStyle = "#000";
      ctx.font = "bold 18px sans-serif";
      const textX = qrSize + 40;
      let textY = 120;

      ctx.fillText(`Ticket ID: ${ticketCode}`, textX, textY);
      textY += 40;
      ctx.font = "16px sans-serif";
      ctx.fillText(`Name: ${fullName}`, textX, textY);
      textY += 30;
      ctx.fillText(`Email: ${email}`, textX, textY);

      // Garis vertikal putus-putus di sisi kanan QR
      ctx.strokeStyle = "#004D40";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      const verticalLineX = 20 + qrSize + 10; // 10px di kanan QR
      ctx.moveTo(verticalLineX, 90); // start di atas QR
      ctx.lineTo(verticalLineX, 90 + qrSize); // sampai bawah QR
      ctx.stroke();
      ctx.setLineDash([]);

      // Garis tipis horizontal di atas footer
      ctx.strokeStyle = "#004D40";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, canvas.height - 50);
      ctx.lineTo(canvas.width - 20, canvas.height - 50);
      ctx.stroke();

      // Footer: Powered by & note
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#555";
      ctx.textAlign = "left";
      ctx.fillText("Powered by GatePass-QR-Code", 20, canvas.height - 30);

      ctx.textAlign = "right";
      ctx.fillText("Please bring this ticket to the event", canvas.width - 20, canvas.height - 30);

      // Download
      const link = document.createElement("a");
      const sanitizedEvent = eventName.replace(/\s+/g, "");
      const sanitizedName = fullName.replace(/\s+/g, "");
      const sanitizedCode = ticketCode;
      link.href = canvas.toDataURL("image/png");
      link.download = `${sanitizedEvent}-${sanitizedName}-${sanitizedCode}.png`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengunduh tiket.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 bg-white p-6 rounded-2xl shadow-lg shadow-green-200 border border-green-200 mt-6 w-full max-w-lg">
      <h2 className="font-extrabold text-2xl text-center mb-2 text-green-700">E-Ticket Preview</h2>

      <div className="flex justify-center my-4">
        <QRCode value={qrData} size={180} />
      </div>

      <div className="w-full flex flex-col gap-2 bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-sm font-semibold text-slate-600 mt-2">Participant Name</p>
        <p className="text-base text-slate-800">{fullName}</p>

        <p className="text-sm font-semibold text-slate-600 mt-2">Email</p>
        <p className="text-base text-slate-800">{email}</p>

        <p className="text-sm font-semibold text-slate-600 mt-2">Event</p>
        <p className="text-base text-slate-800">{eventName}</p>

        <p className="text-sm font-semibold text-slate-600 mt-2">Ticket ID</p>
        <p className="text-base font-mono bg-slate-100 px-3 py-1 rounded-lg shadow-inner text-center">{JSON.parse(qrData).ticketCode}</p>
      </div>

      <button onClick={downloadETicket} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg w-full font-semibold transition-transform transform hover:scale-[1.02]">
        <Download className="w-5 h-5" /> Download E-Ticket
      </button>
    </div>
  );
};

export default DownloadTicket;
