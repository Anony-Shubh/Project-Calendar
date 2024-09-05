import React, { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '@/services/api';
import { Button } from '@/components/ui/button';

interface CalendarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day names
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
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
          <div key={day} className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-700">
            {day}
          </div>
        ))}
        {monthDays.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={`bg-white px-2 py-2 ${
              !isSameMonth(day, currentMonth) ? 'text-gray-400' : ''
            }`}
          >
            <time dateTime={format(day, 'yyyy-MM-dd')} className="text-sm">
              {format(day, 'd')}
            </time>
            <div className="mt-1 space-y-1">
              {events
                .filter((event) => isSameDay(new Date(event.startDate), day))
                .map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="block w-full text-left text-xs leading-5 text-blue-700 bg-blue-100 rounded px-1 py-0.5 truncate hover:bg-blue-200"
                  >
                    {event.title}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;