"use client";

import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";

interface ModalAlertProps {
  isOpen: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalConfirm({ isOpen, title, message, onClose, onConfirm }: ModalAlertProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm bg-white rounded-xl p-6 shadow-lg">
          <DialogTitle className="text-lg font-bold text-slate-800">{title}</DialogTitle>
          {message && <DialogBackdrop className="mt-2 text-lg text-gray-600">{message}</DialogBackdrop>}

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-slate-700">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
              Yes
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
