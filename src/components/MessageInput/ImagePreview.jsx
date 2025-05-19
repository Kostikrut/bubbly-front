import { X, Loader2 } from "lucide-react";

function ImagePreview({ imageUrl, onRemove, isSending }) {
  if (!imageUrl) return null;

  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="relative">
        <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />

        <button
          onClick={onRemove}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
          type="button"
          disabled={isSending}
        >
          <X className="size-3" />
        </button>

        {isSending && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <Loader2 className="animate-spin text-white size-6" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ImagePreview;
