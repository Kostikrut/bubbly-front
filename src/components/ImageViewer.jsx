import { X } from "lucide-react";

function ImageViewer({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full"
        >
          <X size={20} />
        </button>
        <img src={imageUrl} alt="Full View" className="max-h-[90vh] object-contain rounded-lg shadow-lg" />
      </div>
    </div>
  );
}

export default ImageViewer;
