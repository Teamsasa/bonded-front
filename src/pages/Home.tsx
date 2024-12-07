import React, { useState, useEffect } from "react";
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
  Typography,
} from "@mui/material";
import { useCalendar } from "../hooks/useCalendar";
import { Event, Calendar } from "../types";
import { ErrorSnackbar } from "../components/ErrorSnackbar";
import { CalendarForm } from "../components/CalendarForm";
import { CalendarSelector } from "../components/CalendarSelector";
import { useAuth } from "../hooks/useAuth";
import GoogleIcon from "@mui/icons-material/Google";
import { Button as MuiButton, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DefaultCalendarDialog } from '../components/DefaultCalendarDialog';
import { InviteUserDialog } from '../components/InviteUserDialog';

const Home: React.FC = () => {
  const { isAuthenticated, login, currentUser } = useAuth();
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
  const [showDefaultCalendarDialog, setShowDefaultCalendarDialog] = useState(false);
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false);

  const {
    getUserCalendars,
    createCalendar,
    getPublicCalendars,
    createEvent,
    createDefaultCalendar,
    getCalendarEvents,
    inviteUser,
  } = useCalendar();

  const userId = "dummy-user-id";
  const { data: userCalendars, isSuccess: isCalendarsLoaded } = getUserCalendars();
  const { data: publicCalendars } = getPublicCalendars();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && isCalendarsLoaded && userCalendars?.length === 0) {
      setShowDefaultCalendarDialog(true);
    }
  }, [isAuthenticated, isCalendarsLoaded, userCalendars]);

  const handleCreateCalendar = async (data: Partial<Calendar>) => {
    try {
      await createCalendar.mutateAsync(data);
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

  const { data: selectedCalendarEvents } = getCalendarEvents(selectedCalendar || '');

  const handleCreateCalendarClick = () => {
    if (!isAuthenticated) {
      setError("カレンダーを作成するにはログインが必要です");
      return;
    }
    setIsCreateCalendarOpen(true);
  };

  const handleCreateEventClick = () => {
    if (!isAuthenticated) {
      setError("イベントを作成するにはログインが必要です");
      return;
    }
    setIsCreateEventOpen(true);
  };

  const handleCreateDefaultCalendar = async (name: string) => {
    try {
      await createDefaultCalendar.mutateAsync(name);
      setShowDefaultCalendarDialog(false);
    } catch (error) {
      setError('デフォルトカレンダーの作成に失敗しました');
    }
  };

  const hasEditPermission = (calendarId: string) => {
    const calendar = userCalendars?.find(cal => cal.calendarId === calendarId);
    if (!calendar || !currentUser) return false;
    
    if (calendar.ownerUserId === currentUser.userId) return true;
    
    const userAccess = calendar.users.find(user => user.userId === currentUser.userId);
    return userAccess?.accessLevel === 'EDITOR';
  };

  const hasInvitePermission = (calendarId: string) => {
    const calendar = userCalendars?.find(cal => cal.calendarId === calendarId);
    if (!calendar || !currentUser) return false;
    return calendar.ownerUserId === currentUser.userId;
  };

  const handleInviteUser = async (userId: string, accessLevel: string) => {
    if (!selectedCalendar) return;
    
    try {
      await inviteUser.mutateAsync({
        calendarId: selectedCalendar,
        userId,
        accessLevel,
      });
    } catch (error) {
      setError('ユーザーの招待に失敗しました');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <Button variant="contained" onClick={handleCreateCalendarClick}>
            カレンダーを作成
          </Button>
          {selectedCalendar && hasEditPermission(selectedCalendar) && (
            <Button variant="contained" onClick={handleCreateEventClick}>
              イベントを作成
            </Button>
          )}
          {selectedCalendar && hasInvitePermission(selectedCalendar) && (
            <Button
              variant="contained"
              onClick={() => setIsInviteUserOpen(true)}
            >
              ユーザーを招待
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={() => navigate("/public-calendars")}
          >
            公開カレンダー一覧へ
          </Button>
          {!isAuthenticated && (
            <GoogleLoginButton
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={login}
            >
              Googleでログイン
            </GoogleLoginButton>
          )}
        </Box>

        {isAuthenticated ? (
          <CalendarSelector
            calendars={userCalendars || []}
            selectedCalendarId={selectedCalendar}
            onCalendarChange={handleCalendarChange}
          />
        ) : (
          <Box sx={{ mb: 2 }}>
            {publicCalendars?.length
              ? "公開カレンダー一覧"
              : "公開カレンダーはありません"}
          </Box>
        )}

        {selectedCalendarData && (
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale="ja"
            events={selectedCalendarEvents?.map((event: Event) => ({
              title: event.title,
              start: event.startTime,
              end: event.endTime,
              allDay: event.allDay,
            })) || []}
          />
        )}

        {isAuthenticated && !selectedCalendar && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="textSecondary">
              カレンダーを選択してください
            </Typography>
          </Box>
        )}

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
              slotProps={{ inputLabel: { shrink: true } }}
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
              slotProps={{
                inputLabel: { shrink: true },
                input: { type: "datetime-local" },
              }}
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

        <DefaultCalendarDialog
          open={showDefaultCalendarDialog}
          onSubmit={handleCreateDefaultCalendar}
        />

        <InviteUserDialog
          open={isInviteUserOpen}
          onClose={() => setIsInviteUserOpen(false)}
          onSubmit={handleInviteUser}
        />

        <ErrorSnackbar
          open={!!error}
          message={error || ""}
          onClose={() => setError(null)}
        />
      </Box>
    </Container>
  );
};

const GoogleLoginButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#757575",
  border: "1px solid #ddd",
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
}));

export default Home;
