import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from '@fullcalendar/multimonth';
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
  Card,
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
import { DefaultCalendarDialog } from "../components/DefaultCalendarDialog";
import { InviteUserDialog } from "../components/InviteUserDialog";
import { SuccessSnackbar } from "../components/SuccessSnackbar";
import { EventDetailDialog } from "../components/EventDetailDialog";

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
  const [showDefaultCalendarDialog, setShowDefaultCalendarDialog] =
    useState(false);
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const {
    getUserCalendars,
    createCalendar,
    getPublicCalendars,
    createEvent,
    createDefaultCalendar,
    getCalendarEvents,
    inviteUser,
    unfollowCalendar,
    editEvent,
    deleteEvent,
  } = useCalendar();

  const userId = "dummy-user-id";
  const { data: userCalendars, isSuccess: isCalendarsLoaded } =
    getUserCalendars();
  const { data: publicCalendars } = getPublicCalendars();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && isCalendarsLoaded) {
      if (userCalendars?.length === 0) {
        setShowDefaultCalendarDialog(true);
      } else if (!selectedCalendar && userCalendars?.length > 0) {
        setSelectedCalendar(userCalendars[0].calendarId);
      }
    }
  }, [isAuthenticated, isCalendarsLoaded, userCalendars, selectedCalendar]);

  const handleCreateCalendar = async (data: Partial<Calendar>) => {
    try {
      await createCalendar.mutateAsync(data);
      setSuccessMessage("カレンダーを作成しました");
    } catch (error) {
      setError("カレンダーの作成に失敗しました");
    }
  };

  const handleCreateEvent = async () => {
    if (!selectedCalendar) return;

    try {
      await createEvent.mutateAsync({
        calendarId: selectedCalendar,
        data: {
          ...newEvent,
          allDay: false,
        },
      });
      setSuccessMessage("イベントを作成しました");
      setIsCreateEventOpen(false);
      setNewEvent({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
      });
    } catch (error) {
      setError("イベントの作成に失敗しました");
    }
  };

  const handleCalendarChange = (calendarId: string) => {
    setSelectedCalendar(calendarId);
  };

  const selectedCalendarData = userCalendars?.find(
    (calendar) => calendar.calendarId === selectedCalendar,
  );

  const { data: selectedCalendarEvents } = getCalendarEvents(
    selectedCalendar || "",
  );

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
      setSuccessMessage("デフォルトカレンダーを作成しました");
      setShowDefaultCalendarDialog(false);
    } catch (error) {
      setError("デフォルトカレンダーの作成に失敗しました");
    }
  };

  const hasEditPermission = (calendarId: string) => {
    const calendar = userCalendars?.find(
      (cal) => cal.calendarId === calendarId,
    );
    if (!calendar || !currentUser) return false;

    if (calendar.ownerUserId === currentUser.userId) return true;

    const userAccess = calendar.users.find(
      (user) => user.userId === currentUser.userId,
    );
    return userAccess?.accessLevel === "EDITOR" || userAccess?.accessLevel === "OWNER";
  };

  const hasInvitePermission = (calendarId: string) => {
    const calendar = userCalendars?.find(
      (cal) => cal.calendarId === calendarId,
    );
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
      setSuccessMessage("ユーザーを招待しました");
    } catch (error) {
      setError("ユーザーの招待に失敗しました");
    }
  };

  const fetchAllEvents = async () => {
    if (!userCalendars) return;
    
    try {
      const eventsPromises = userCalendars.map(calendar => 
        getCalendarEvents(calendar.calendarId).data || []
      );
      
      const allEventsArrays = await Promise.all(eventsPromises);
      const combinedEvents = allEventsArrays
        .flat()
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      
      setAllEvents(combinedEvents);
    } catch (error) {
      setError("イベントの取得に失敗しました");
    }
  };

  useEffect(() => {
    if (showAllEvents) {
      fetchAllEvents();
    }
  }, [showAllEvents, userCalendars]);

  const handleEditEvent = async (event: Event) => {
    if (!selectedCalendarData) return;
    
    setEditingEvent({
      ...event,
      calendarId: selectedCalendarData.calendarId
    });
    setIsEditEventOpen(true);
    setSelectedEvent(null);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent || !editingEvent.calendarId) return;
    
    try {
      await editEvent.mutateAsync({
        calendarId: editingEvent.calendarId,
        data: editingEvent,
      });
      setSuccessMessage("イベントを更新しました");
      setIsEditEventOpen(false);
      setEditingEvent(null);
    } catch (error) {
      setError("イベントの更新に失敗しました");
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    try {
      await deleteEvent.mutateAsync({
        calendarId: event.calendarId,
        eventId: event.eventId,
      });
      setSuccessMessage("イベントを削除しました");
      setSelectedEvent(null);
    } catch (error) {
      setError("イベントの削除に失敗しました");
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
          <Button
            variant="outlined"
            onClick={() => setShowAllEvents(!showAllEvents)}
          >
            {showAllEvents ? "カレンダー表示" :"全イベント表示"}
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
            currentUserId={currentUser?.userId || ''}
            onUnfollow={async (calendarId) => {
              try {
                await unfollowCalendar.mutateAsync(calendarId);
                setSuccessMessage("カレンダーのフォローを解除しました");
              } catch (error) {
                setError("フォロー解除に失敗しました");
              }
            }}
          />
        ) : (
          <Box sx={{ mb: 2 }}>
            {publicCalendars?.length
              ? "公開カレンダー一覧"
              : "公開カレンダーはありません"}
          </Box>
        )}

        {showAllEvents ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 2}}>全カレンダーのイベント</Typography>
            {allEvents.map(event => (
              <Card key={event.eventId} sx={{ mb: 1, p: 2 }}>
                <Typography variant="subtitle1">{event.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(event.startTime).toLocaleString()}
                </Typography>
              </Card>
            ))}
          </Box>
        ) : (
          selectedCalendarData && (
            <FullCalendar
              plugins={[dayGridPlugin, multiMonthPlugin]}
              initialView="dayGridMonth"
              locale="ja"
              events={
                selectedCalendarEvents?.map((event: Event) => ({
                  id: event.eventId,
                  title: event.title,
                  start: new Date(event.startTime).toISOString(),
                  end: new Date(event.endTime).toISOString(),
                  allDay: event.allDay,
                  backgroundColor: "#3788d8",
                  borderColor: "#2c6cb2",
                  textColor: "#ffffff",
                  extendedProps: {
                    ...event,
                  },
                })) || []
              }
              eventClick={(info) => {
                setSelectedEvent(info.event.extendedProps as Event);
              }}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "multiMonthYear,dayGridMonth",
              }}
              height="auto"
              views={{
                multiMonthYear: {
                  duration: { years: 1 },
                  buttonText: '年',
                  titleFormat: { year: 'numeric' }
                },
                dayGridMonth: {
                  buttonText: '月',
                  titleFormat: { year: 'numeric' }
                }
              }}
            />
          )
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
              multiline
              rows={3}
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
              label="終了時間"
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
            <Button
              onClick={handleCreateEvent}
              variant="contained"
              disabled={
                !newEvent.title || !newEvent.startTime || !newEvent.endTime
              }
            >
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

        <SuccessSnackbar
          open={!!successMessage}
          message={successMessage || ""}
          onClose={() => setSuccessMessage(null)}
        />

        <ErrorSnackbar
          open={!!error}
          message={error || ""}
          onClose={() => setError(null)}
        />

        <EventDetailDialog
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
          hasEditPermission={selectedEvent && selectedCalendarData ? hasEditPermission(selectedCalendarData.calendarId) : false}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />

        <Dialog
          open={isEditEventOpen}
          onClose={() => setIsEditEventOpen(false)}
        >
          <DialogTitle>イベントを編集</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="タイトル"
              value={editingEvent?.title || ""}
              onChange={(e) =>
                setEditingEvent(prev => prev ? { ...prev, title: e.target.value } : null)
              }
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="説明"
              multiline
              rows={3}
              value={editingEvent?.description || ""}
              onChange={(e) =>
                setEditingEvent(prev => prev ? { ...prev, description: e.target.value } : null)
              }
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="開始時間"
              value={editingEvent?.startTime || ""}
              onChange={(e) =>
                setEditingEvent(prev => prev ? { ...prev, startTime: e.target.value } : null)
              }
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="終了時間"
              value={editingEvent?.endTime || ""}
              onChange={(e) =>
                setEditingEvent(prev => prev ? { ...prev, endTime: e.target.value } : null)
              }
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="場所"
              value={editingEvent?.location || ""}
              onChange={(e) =>
                setEditingEvent(prev => prev ? { ...prev, location: e.target.value } : null)
              }
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditEventOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={handleUpdateEvent}
              variant="contained"
              disabled={!editingEvent?.title || !editingEvent?.startTime || !editingEvent?.endTime}
            >
              更新
            </Button>
          </DialogActions>
        </Dialog>
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
