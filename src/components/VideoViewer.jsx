import { X } from "lucide-react";

function VideoViewer({ videoUrl, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-5 right-5 bg-base-300 rounded-full p-1">
        <X className="text-white" />
      </button>
      <video src={videoUrl} controls autoPlay className="w-full max-w-4xl rounded-lg shadow-lg" />
    </div>
  );
}

export default VideoViewer;
