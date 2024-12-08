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
  onFollow?: (calendarId: string) => void;
  isPublicView?: boolean;
}

export const CalendarSelector: React.FC<CalendarSelectorProps> = ({
  calendars,
  selectedCalendarId,
  onCalendarChange,
  currentUserId,
  onUnfollow,
  onFollow,
  isPublicView,
}) => {
  const selectedCalendar = calendars.find(c => c.calendarId === selectedCalendarId);
  const isFollowed = selectedCalendar?.users.some(u => u.userId === currentUserId);
  const isOwner = selectedCalendar?.ownerUserId === currentUserId;

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
      {selectedCalendarId && !isOwner && (
        <>
          {isPublicView && currentUserId && !isFollowed && (
            <Button
              onClick={() => onFollow?.(selectedCalendarId)}
              variant="contained"
              color="primary"
            >
              フォロー
            </Button>
          )}
          {isFollowed && (
            <Button
              onClick={() => onUnfollow(selectedCalendarId)}
              variant="outlined"
              color="error"
            >
              アンフォロー
            </Button>
          )}
        </>
      )}
    </Box>
  );
};
