import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Box,
  Button,
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useCalendar } from "../hooks/useCalendar";
import { Event, Calendar } from "../types";
import { ErrorSnackbar } from "../components/ErrorSnackbar";
import { CalendarForm } from "../components/CalendarForm";
import { CalendarSelector } from "../components/CalendarSelector";

const Home: React.FC = () => {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
  });
  const [isCreateCalendarOpen, setIsCreateCalendarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);

  const { getUserCalendars, createCalendar, getPublicCalendars, createEvent } =
    useCalendar();

  const userId = "dummy-user-id";
  const { data: userCalendars } = getUserCalendars(userId);
  const { data: publicCalendars } = getPublicCalendars();

  const handleCreateCalendar = async (data: Partial<Calendar>) => {
    try {
      await createCalendar.mutateAsync({ userId, data });
    } catch (error) {
      setError("カレンダーの作成に失敗しました");
    }
  };

  const handleCreateEvent = async () => {
    if (userCalendars?.[0]) {
      await createEvent.mutateAsync({
        calendarId: userCalendars[0].calendarId,
        data: newEvent,
      });
      setIsCreateEventOpen(false);
    }
  };

  const handleCalendarChange = (calendarId: string) => {
    setSelectedCalendar(calendarId);
  };

  const selectedCalendarData = userCalendars?.find(
    (calendar) => calendar.calendarId === selectedCalendar,
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setIsCreateCalendarOpen(true)}
          >
            カレンダーを作成
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsCreateEventOpen(true)}
          >
            イベントを作成
          </Button>
        </Box>

        <CalendarSelector
          calendars={userCalendars || []}
          selectedCalendarId={selectedCalendar}
          onCalendarChange={handleCalendarChange}
        />

        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="ja"
          events={selectedCalendarData?.events.map((event: Event) => ({
            title: event.title,
            start: event.startTime,
            end: event.endTime,
          }))}
        />

        <CalendarForm
          open={isCreateCalendarOpen}
          onClose={() => setIsCreateCalendarOpen(false)}
          onSubmit={handleCreateCalendar}
        />

        <Dialog
          open={isCreateEventOpen}
          onClose={() => setIsCreateEventOpen(false)}
        >
          <DialogTitle>新規イベント作成</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="タイトル"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="説明"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="開始時間"
              value={newEvent.startTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, startTime: e.target.value })
              }
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="終時間"
              value={newEvent.endTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, endTime: e.target.value })
              }
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="場所"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateEventOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleCreateEvent} variant="contained">
              作成
            </Button>
          </DialogActions>
        </Dialog>

        <ErrorSnackbar
          open={!!error}
          message={error || ""}
          onClose={() => setError(null)}
        />
      </Box>
    </Container>
  );
};

export default Home;
