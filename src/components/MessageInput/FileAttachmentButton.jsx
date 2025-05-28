import { Paperclip } from "lucide-react";

function FileAttachmentButton({ onClick, disabled, hasFile }) {
  return (
    <button
      type="button"
      className={`sm:flex btn btn-circle ${hasFile ? "text-emerald-500" : "text-zinc-400"}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Paperclip size={20} />
    </button>
  );
}

export default FileAttachmentButton;
