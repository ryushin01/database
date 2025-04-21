import { ChangeEvent } from "react";

type InputFieldProps = {
  id?: string;
  name: string;
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  inputSize?: "sm" | "md" | "lg";
  isError?: boolean;
};

/**
 * @name CurrencyFormat
 * @version 1.0.0
 * @author 류창선 <zero.ryushin@bankle.co.kr>
 */
export default function CurrencyFormat({
                                         id,
                                         name,
                                         value,
                                         onChange,
                                         placeholder,
                                         required,
                                         inputSize = "sm",
                                         isError = false,
                                       }: InputFieldProps) {


  let setSize = "";
  switch (inputSize) {
    case "sm":
      setSize = "py-2 text-[14px]";
      break;
    case "md":
      setSize = "py-3 text-[16px]";
      break;
    case "lg":
      setSize = "py-4 text-[18px]";
      break;
    default:
      setSize = "py-2 text-[14px]";
  }

  return (
    <div className={`_label-text-input ${setSize} ${isError ? "_error" : ""}`}>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-0 outline-none"
      />
    </div>
  );
}

