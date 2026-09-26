import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

export const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDanger = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => !isLoading && onCancel()}
      />

      {/* Centered Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Danger/Warning Icon Badge */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
              isDanger ? "bg-rose-50 text-rose-500" : "bg-cyan-50 text-cyan-600"
            }`}
          >
            {isDanger ? (
              <Trash2 className="w-7 h-7" />
            ) : (
              <AlertTriangle className="w-7 h-7" />
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h3>

          <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-sm">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50 cursor-pointer"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer ${
                isDanger
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                  : "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200"
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
