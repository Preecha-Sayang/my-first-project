import { Textarea } from "@/components/ui/textarea"

export function TextareaDemo({ placeholder, value, onChange }) {
  return (
    <Textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}