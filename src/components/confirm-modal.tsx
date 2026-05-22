"use client";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-sm bg-background border border-border p-8 shadow-xl">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">
          Confirm
        </p>
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">{description}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors disabled:opacity-50 ${
              destructive
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-foreground text-background hover:opacity-90"
            }`}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
