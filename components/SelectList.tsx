"use client";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ArrowUpDown, Check } from "lucide-react";

interface SelectListProps<T> {
  value: T | null;
  onChange: (value: T | null) => void;
  options: T[];
  placeholder: string;
  className?: string;
  display?: (item: T) => string;
}

export default function SelectList<T extends string>({ value, onChange, options, placeholder, className, display }: SelectListProps<T>) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative w-full ${className || "sm:w-48"}`}>
        <ListboxButton className="relative w-full cursor-pointer rounded border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-gray-700 shadow-sm">
          <span>{value || placeholder}</span>
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          </span>
        </ListboxButton>
        <ListboxOptions className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded border border-gray-200 bg-white py-1 shadow-lg focus:outline-none">
          <ListboxOption key="all" value={null}>
            {({ selected, active }) => (
              <div className={`px-4 py-2 cursor-pointer ${active ? "bg-green-100 text-green-800" : "text-gray-700"}`}>
                {placeholder}
                {selected && <Check className="w-4 h-4 text-green-600 inline ml-2" />}
              </div>
            )}
          </ListboxOption>
          {options.map((opt) => (
            <ListboxOption key={opt} value={opt}>
              {({ selected, active }) => (
                <div className={`px-4 py-2 cursor-pointer ${active ? "bg-green-100 text-green-800" : "text-gray-700"}`}>
                  {display ? display(opt) : opt}
                  {selected && <Check className="w-4 h-4 text-green-600 inline ml-2" />}
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
