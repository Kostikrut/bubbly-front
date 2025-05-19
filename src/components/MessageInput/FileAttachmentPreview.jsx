import { X, FileText } from "lucide-react";

function FileAttachmentPreview({ fileName, onRemove, isSending }) {
  if (!fileName) return null;

  return (
    <div className="mb-3 flex items-center gap-2 bg-base-200 rounded-lg px-3 py-2 w-fit max-w-full">
      <FileText size={18} className="text-blue-600" />
      <span className="truncate max-w-[200px] text-sm">{fileName}</span>

      <button
        onClick={onRemove}
        className="ml-2 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
        type="button"
        disabled={isSending}
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

export default FileAttachmentPreview;
