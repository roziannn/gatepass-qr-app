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
      // A4 300dpi
      canvas.width = 2480;
      canvas.height = 3508;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ===== Fungsi wrap text =====
      const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(" ");
        let line = "";
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, y);
        return y; // y akhir
      };

      // ===== Header Event =====
      ctx.fillStyle = "#00695C";
      ctx.font = "bold 120px sans-serif";
      ctx.textAlign = "center";
      // Wrap text maksimal width 2200px, lineHeight 140
      const headerY = 200;
      const afterHeaderY = wrapText(ctx, eventName, canvas.width / 2, headerY, 2200, 140);

      // Divider horizontal
      ctx.strokeStyle = "#004D40";
      ctx.lineWidth = 5;
      ctx.setLineDash([30, 30]);
      ctx.beginPath();
      ctx.moveTo(100, afterHeaderY + 50);
      ctx.lineTo(canvas.width - 100, afterHeaderY + 50);
      ctx.stroke();
      ctx.setLineDash([]);

      // ===== QR Code Tengah =====
      const qrSize = 1000; // cukup besar
      const qrCanvas = document.createElement("canvas");
      await QRCodeLib.toCanvas(qrCanvas, qrData, { width: qrSize });
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = afterHeaderY + 150;
      ctx.drawImage(qrCanvas, qrX, qrY);

      // Kotak border QR
      ctx.strokeStyle = "#004D40";
      ctx.lineWidth = 8;
      ctx.strokeRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);

      // ===== Info Peserta Bawah QR =====
      ctx.fillStyle = "#000";
      ctx.font = "bold 80px sans-serif";
      ctx.textAlign = "center";
      let textY = qrY + qrSize + 100;
      ctx.fillText(`Ticket ID: ${ticketCode}`, canvas.width / 2, textY);

      ctx.font = "60px sans-serif";
      textY += 100;
      ctx.fillText(`Name: ${fullName}`, canvas.width / 2, textY);

      textY += 80;
      ctx.fillText(`Email: ${email}`, canvas.width / 2, textY);

      // ===== Footer =====
      ctx.font = "40px sans-serif";
      ctx.fillStyle = "#555555";
      ctx.textAlign = "center";
      ctx.fillText("Powered by GatePass-QR-Code", canvas.width / 2, canvas.height - 200);
      ctx.fillText("Please bring this ticket to the event", canvas.width / 2, canvas.height - 120);

      // Download
      const link = document.createElement("a");
      const sanitizedEvent = eventName.replace(/\s+/g, "");
      const sanitizedName = fullName.replace(/\s+/g, "");
      link.href = canvas.toDataURL("image/png");
      link.download = `${sanitizedEvent}-${sanitizedName}-${ticketCode}.png`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengunduh tiket.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 bg-white p-6 rounded-2xl shadow-lg shadow-green-200 border border-green-200 mt-6 w-full max-w-lg">
      <div className="flex justify-center my-4">
        <QRCode value={qrData} size={180} />
      </div>

      <div className="w-full flex flex-col gap-2 bg-green-50 p-4 rounded-lg border border-green-200 text-center">
        <p className="text-sm font-semibold text-slate-600 mt-2">Ticket ID</p>
        <p className="text-base font-mono bg-slate-100 px-3 py-1 rounded-lg shadow-inner">{ticketCode}</p>

        <p className="font-bold text-slate-800">{fullName}</p>
        <p className="text-base text-slate-800">{email}</p>

        <p className="text-sm font-semibold text-slate-600 mt-4">Event</p>
        <p className="text-base text-slate-800">{eventName}</p>
      </div>

      <button onClick={downloadETicket} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg w-full font-semibold transition-transform transform hover:scale-[1.02]">
        <Download className="w-5 h-5" /> Download E-Ticket
      </button>
    </div>
  );
};

export default DownloadTicket;
