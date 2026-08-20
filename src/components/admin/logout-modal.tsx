"use client";

interface LogoutModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutModal({ open, onConfirm, onCancel }: LogoutModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-xs rounded-3xl border border-border bg-background p-6 text-center shadow-2xl">
        <h3 className="text-xl font-bold text-foreground">Sign out?</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You&apos;ll be returned to the login screen.
        </p>

        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
