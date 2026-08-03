"use client";

import * as React from "react";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
}: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const digits = React.useMemo(() => {
    const val = value || "";
    return Array.from({ length }, (_, i) => val[i] || "");
  }, [value, length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const digit = inputVal.substring(inputVal.length - 1);
    
    if (digit && !/^\d$/.test(digit)) return;

    const newDigits = [...digits];
    newDigits[index] = digit;
    const combined = newDigits.join("");
    onChange(combined);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    const numericData = pastedData.replace(/\D/g, "").slice(0, length);
    if (numericData) {
      onChange(numericData);
      const focusIndex = Math.min(numericData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digits[index] || ""}
          disabled={disabled}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`h-12 w-10 sm:h-14 sm:w-12 text-center text-xl sm:text-2xl font-bold font-space rounded-xl transition-all duration-200 focus:outline-none ${
            error
              ? "border-2 border-red-500 bg-red-500/10 text-red-200"
              : digits[index]
              ? "border-2 border-[#FFB81B] bg-[#FFB81B]/10 text-[#FFB81B] shadow-[0_0_15px_rgba(255,184,27,0.2)]"
              : "border border-[#003599]/40 bg-[#00173d]/60 text-white hover:border-[#003599] focus:border-[#FFB81B] focus:ring-2 focus:ring-[#FFB81B]/40"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
}
