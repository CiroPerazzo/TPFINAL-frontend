import { useLayoutEffect, useRef } from "react";

export default function Modal({ title, onClose, openerRef, children }) {
  const dialogRef = useRef(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const opener = openerRef.current;
    dialog.showModal();
    return () => {
      dialog.close();
      // Wait for the commit to finish in case the opener was disabled while saving.
      queueMicrotask(() => {
        if (!dialog.open) opener?.focus();
      });
    };
  }, [openerRef]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const bounds = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < bounds.left ||
          e.clientX >= bounds.right ||
          e.clientY < bounds.top ||
          e.clientY >= bounds.bottom
        ) {
          onClose();
        }
      }}
    >
      <div className="section-title">
        <h2>{title}</h2>
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
