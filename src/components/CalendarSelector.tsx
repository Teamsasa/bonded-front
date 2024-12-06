import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Calendar } from "../types";

interface CalendarSelectorProps {
  calendars: Calendar[];
  selectedCalendarId: string | null;
  onCalendarChange: (calendarId: string) => void;
}

export const CalendarSelector: React.FC<CalendarSelectorProps> = ({
  calendars,
  selectedCalendarId,
  onCalendarChange,
}) => {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>カレンダー</InputLabel>
      <Select
        value={selectedCalendarId || ""}
        label="カレンダー"
        onChange={(e) => onCalendarChange(e.target.value as string)}
      >
        {calendars.map((calendar) => (
          <MenuItem key={calendar.calendarId} value={calendar.calendarId}>
            {calendar.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
