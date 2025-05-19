import { useState, useEffect } from "react";
import tailwindColors from "../utils/tailwindColors";

function ColorPicker({ action, onCancel }) {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleApply = () => {
    if (selectedColor) {
      action(selectedColor);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-base-100 rounded-xl shadow-xl p-6 w-[500px] max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Pick a color</h3>

        {/* grid */}
        <div className="grid grid-cols-11 gap-1 justify-center">
          {tailwindColors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`
                w-6 h-6 rounded-sm border transition
                ${selectedColor === color ? "ring-2 ring-black border-white" : "border-gray-300"}
                ${color}
              `}
              title={color.replace("bg-", "")}
            />
          ))}
        </div>

        {/* buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 bg-blue-500  rounded  text-white hover:bg-blue-700"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedColor}
            className="cursor-pointer px-4 py-2 bg-blue-500 rounded text-white  hover:bg-blue-700 disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;
