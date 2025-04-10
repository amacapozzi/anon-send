import { Input } from "@/components/ui/input";
import { HtmlHTMLAttributes } from "react";
import { Control, Controller, FieldError } from "react-hook-form";

interface Props extends HtmlHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  name: string;
  control: Control<any>;
  type?: string;
}

export const AuthInput = ({
  placeholder,
  name,
  control,
  type,
  ...rest
}: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Input
          id={name}
          {...field}
          type={type}
          {...rest}
          placeholder={placeholder}
        />
      )}
    />
  );
};
