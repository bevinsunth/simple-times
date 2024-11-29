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
    <div className="mb-4 flex items-center justify-between">
      <Button onClick={() => onDateChange(subWeeks(currentDate, 1))}>
        Previous Week
      </Button>
      <Select
        value={format(currentDate, 'yyyy-MM-dd')}
        onValueChange={(value: string) => onDateChange(new Date(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a week" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 52 }, (_, i) => {
            const date = subWeeks(new Date(), i);
            return (
              <SelectItem key={i} value={format(date, 'yyyy-MM-dd')}>
                {format(date, 'MMM d, yyyy')}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Button onClick={() => onDateChange(addWeeks(currentDate, 1))}>
        Next Week
      </Button>
    </div>
  );
};

export { WeekSelector };
