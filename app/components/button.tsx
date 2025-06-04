import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, ...props }) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg transition-all hover:bg-opacity-80"
    >
      {text}
    </button>
  );
};

export default Button;
