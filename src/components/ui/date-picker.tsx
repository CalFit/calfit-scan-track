
import * as React from "react";
import { fr } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export type DatePickerProps = React.ComponentProps<typeof CalendarComponent>;

export function DatePicker({
  className,
  classNames,
  locale = fr,
  ...props
}: DatePickerProps) {
  return (
    <CalendarComponent
      locale={locale}
      className={className}
      classNames={classNames}
      {...props}
    />
  );
}
