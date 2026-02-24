/* ==================================================================
   SketchyDialog — hand-drawn styled dialog box for the Home page
   ================================================================== */

interface DialogState {
    message: string;
    type: "success" | "error";
    onClose?: () => void;
}

interface SketchyDialogProps {
    dialog: DialogState;
    onDismiss: () => void;
}

export const SketchyDialog = ({ dialog, onDismiss }: SketchyDialogProps) => {
    const handleClose = () => {
        dialog.onClose?.();
        onDismiss();
    };

    return (
        <div className="dialog-overlay" onClick={handleClose}>
            <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
                <span className="dialog-nail dialog-nail-tl" />
                <span className="dialog-nail dialog-nail-tr" />
                <p className="dialog-message">{dialog.message}</p>
                <button className="dialog-close" onClick={handleClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export type { DialogState };
