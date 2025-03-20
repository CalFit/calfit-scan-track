import React, { useState } from 'react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateSelectorProps {
  date: Date;
  onChange: (date: Date) => void;
}

const DateSelector = ({ date, onChange }: DateSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handlePreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    onChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    onChange(newDate);
  };

  const formatDate = (date: Date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: fr });
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      onChange(newDate);
      setOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mb-4">
      <Button 
        variant="outline" 
        size="icon"
        onClick={handlePreviousDay}
        className="h-8 w-8 rounded-full hover:bg-muted transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 min-w-44 hover:bg-muted transition-colors"
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">
              {formatDate(date)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleNextDay}
        className="h-8 w-8 rounded-full hover:bg-muted transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DateSelector;
