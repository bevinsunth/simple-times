import { addWeeks, subWeeks, format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WeekSelectorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({
  currentDate,
  onDateChange,
}) => {
  return (
    <div className="mb-4 flex items-center justify-center gap-4">
      <Button onClick={() => onDateChange(subWeeks(currentDate, 1))}>
        <span className="hidden md:inline">Previous Week</span>
        <span className="inline md:hidden">&lt;</span>
      </Button>
      <Select
        value={format(currentDate, 'yyyy-MM-dd')}
        onValueChange={(value: string) => onDateChange(new Date(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a week" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 21 }, (_, i) => {
            const date = subWeeks(new Date(), 10 - i);
            return (
              <SelectItem key={i} value={format(date, 'yyyy-MM-dd')}>
                {format(date, 'MMM d, yyyy')}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Button onClick={() => onDateChange(addWeeks(currentDate, 1))}>
        <span className="hidden md:inline">Next Week</span>
        <span className="inline md:hidden">&gt;</span>
      </Button>
    </div>
  );
};

export { WeekSelector };
