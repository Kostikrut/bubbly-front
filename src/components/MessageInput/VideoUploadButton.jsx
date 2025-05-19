import { Video } from "lucide-react";

function VideoUploadButton({ onClick, disabled, hasVideo }) {
  return (
    <button
      type="button"
      className={`hidden sm:flex btn btn-circle ${hasVideo ? "text-emerald-500" : "text-zinc-400"}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Video size={20} />
    </button>
  );
}

export default VideoUploadButton;
