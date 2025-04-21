import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import "@styles/select.css";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  id: string;
  isError?: boolean;
  disabled?: boolean;
  name: string;
  value: string;
  shape?: "default" | "none";
  selectSize: "xs" | "sm" | "md" | "lg";
  options?: SelectOption[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  placeholder?: string;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
  "className"
>;

/**
 * @name Select
 * @version 1.1.0
 * @author 홍다인 <hdi0104@bankle.co.kr>
 *         류창선 <zero.ryushin@bankle.co.kr>
 * @property {string} id           - 셀렉트 id를 정의합니다.
 * @property {boolean} isError     - 셀렉트의 에러 상태를 정의합니다.
 * @property {boolean} disabled    - 셀렉트의 비활성화 상태를 정의합니다.
 * @property {string} name         - form에 담길 셀렉트의 이름을 정의합니다.
 * @property {string} value        - 선택된 값을 정의합니다.
 * @property {string} label        - 선택된 값의 라벨을 정의합니다.
 * @property {function} options    - 셀렉트 선택 옵션들을 정의합니다.
 * @property {function} onChange   - 셀렉트 동작 위해 정의합니다.
 */

export default function Select({
  id,
  options,
  name,
  value,
  isError,
  selectSize,
  disabled,
  onChange,
  shape = "default",
  className = "",
  placeholder = "",
  required = false,
}: SelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  let setSize = "";
  const border = shape === "none";
  switch (selectSize) {
    case "xs":
      setSize = "py-0.5 rounded-md text-[14px] leading-[20px]";
      break;
    case "sm":
      setSize = "py-2 rounded-md text-[14px] leading-[20px]";
      break;
    case "md":
      setSize = "py-3 rounded-lg text-[16px] leading-[24px]";
      break;
    case "lg":
      setSize = "py-4 rounded-lg text-[18px] leading-[26px]";
      break;
    default:
      setSize = "py-0.5 text-[14px] leading-[20px]";
  }

  const style = `${border ? "_border-none" : ""} ${isError ? "_error" : ""}`;

  return (
    <label className={`_select-label ${className} ${style}`}>
      <select
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        className={`_select ${setSize}`}
        required={required}
      >
        {placeholder && (
          <option value={placeholder} hidden>
            {placeholder}
          </option>
        )}
        {options?.map((option: SelectOption, index: number) => (
          <option key={`${option.value}${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
