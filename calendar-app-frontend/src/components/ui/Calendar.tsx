import React, { useEffect, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import DateDialog from "./DateDialog";

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventCount, setEventCount] = useState<{ [date: string]: number }>({});

  const fetchEventCount = async () => {
    try {
      const count = await api.getEventCountForMonth(
        currentMonth.getMonth() + 1, // Months are 0-indexed, so add 1
        currentMonth.getFullYear()
      );
      setEventCount(count);
    } catch (error) {
      console.error("Error fetching event count:", error);
    }
  };

  useEffect(() => {
    fetchEventCount();
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day names
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="space-x-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}
        {monthDays.map((day) => (
          <div
            key={day.toString()}
            className={`bg-white px-2 py-2 ${
              !isSameMonth(day, currentMonth) ? "text-gray-400" : ""
            }`}
          >
            <time dateTime={format(day, "yyyy-MM-dd")} className="text-sm">
              {format(day, "d")}
            </time>
            <div className="mt-2">
              <DateDialog
                date={format(day, "yyyy-MM-dd")}
                buttonText={`${
                  eventCount[format(day, "yyyy-MM-dd")] ?? 0
                } events`}
                onClose={fetchEventCount} // Pass fetchEventCount as onClose
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
