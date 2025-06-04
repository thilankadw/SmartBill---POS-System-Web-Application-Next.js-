import React from "react";

interface NumericKeyboardModalProps {
  isVisible: boolean;
  onClose: () => void;
  onKeyPress: (key: string) => void;
  value: string | number;
  onSubmit: () => void;
  title?: string; // Added title prop
}

const NumericKeyboardModal: React.FC<NumericKeyboardModalProps> = ({
  isVisible,
  onClose,
  onKeyPress,
  value,
  onSubmit,
  title = "Enter Value", // Default title
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-80 shadow-xl">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-center text-black">{title}</h3>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold text-black">{value}</span>
          <button onClick={onClose} className="text-black font-bold">
            X
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              className="bg-soft p-4 rounded-lg text-lg text-black"
              onClick={() => onKeyPress(number.toString())}
            >
              {number}
            </button>
          ))}
          <button className="bg-soft p-4 rounded-lg text-lg text-black" onClick={() => onKeyPress("0")}>
            0
          </button>
          <button className="bg-soft p-4 rounded-lg text-lg text-black" onClick={() => onKeyPress(".")}>
            .
          </button>
          <button
            className="bg-soft p-4 rounded-lg text-lg text-black"
            onClick={() => onKeyPress("backspace")}
          >
            ←
          </button>
          <button
            className="bg-soft p-4 rounded-lg text-lg text-black col-span-3"
            onClick={onSubmit}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumericKeyboardModal;