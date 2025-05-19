import { useEffect, useRef, useState } from "react";
import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

function EmojiPickerButton({ onSelect, disabled }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative">
      <button
        type="button"
        className="btn mx-2 btn-circle btn-sm text-zinc-500"
        onClick={() => setShowPicker((prev) => !prev)}
        disabled={disabled}
      >
        <Smile size={25} />
      </button>

      {showPicker && (
        <div className="absolute bottom-12 z-50" ref={pickerRef}>
          <EmojiPicker onEmojiClick={(emoji) => onSelect(emoji)} theme="dark" />
        </div>
      )}
    </div>
  );
}

export default EmojiPickerButton;
