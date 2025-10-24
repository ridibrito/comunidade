import { ReactNode } from "react";
import { AlertDialog } from "./AlertDialog";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "warning" | "default";
  children?: ReactNode;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "destructive",
  children
}: ConfirmModalProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onClose}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      variant={variant}
      onConfirm={onConfirm}
      onCancel={onClose}
    >
      {children}
    </AlertDialog>
  );
}
