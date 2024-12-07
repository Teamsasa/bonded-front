import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import { Calendar } from "../types";

interface CalendarSelectorProps {
  calendars: Calendar[];
  selectedCalendarId: string | null;
  onCalendarChange: (calendarId: string) => void;
  currentUserId: string;
  onUnfollow: (calendarId: string) => void;
}

export const CalendarSelector: React.FC<CalendarSelectorProps> = ({
  calendars,
  selectedCalendarId,
  onCalendarChange,
  currentUserId,
  onUnfollow,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <FormControl fullWidth>
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
      {selectedCalendarId &&
        calendars.find(
          (c) =>
            c.calendarId === selectedCalendarId &&
            c.ownerUserId !== currentUserId,
        ) && (
          <Button
            onClick={() => onUnfollow(selectedCalendarId)}
            variant="outlined"
            color="error"
          >
            アンフォロー
          </Button>
        )}
    </Box>
  );
};
