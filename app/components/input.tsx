import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-2 bg-background border border-soft rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  );
};

export default Input;
