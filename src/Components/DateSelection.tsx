// DateSelection.tsx
import React, { useState } from 'react';

interface DateSelectionProps {
  onChange: (selectedDate: string) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
    onChange(selectedDate);
  };

  return (
    <div>
      <label htmlFor="date-select">Select Date:</label>
      <select id="date-select" value={selectedDate} onChange={handleDateChange}>
        {/* Render dropdown options from your data */}
      </select>
    </div>
  );
};

export default DateSelection;
