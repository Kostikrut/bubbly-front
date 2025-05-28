import { Image } from "lucide-react";

function ImageUploadButton({ onChange, fileInputRef, hasImage, isDisabled }) {
  return (
    <>
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onChange} />
      <button
        type="button"
        className={`sm:flex btn btn-circle ${hasImage ? "text-emerald-500" : "text-zinc-400"}`}
        onClick={() => fileInputRef.current?.click()}
        disabled={isDisabled}
      >
        <Image size={20} />
      </button>
    </>
  );
}

export default ImageUploadButton;
