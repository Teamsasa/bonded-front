import React, { useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { useCalendar } from "../hooks/useCalendar";
import { ErrorSnackbar } from "../components/ErrorSnackbar";
import { SuccessSnackbar } from "../components/SuccessSnackbar";
import { Calendar } from "../types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CalendarSelector } from "../components/CalendarSelector";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const PublicCalendars: React.FC = () => {
  const {
    getPublicCalendars,
    followCalendar,
    getCalendarEvents,
    unfollowCalendar,
  } = useCalendar();
  const { data: publicCalendars } = getPublicCalendars();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);

  const handleFollowCalendar = async (calendarId: string) => {
    if (!isAuthenticated) {
      setError("フォローするにはログインが必要です");
      return;
    }
    try {
      await followCalendar.mutateAsync(calendarId);
      setSuccessMessage("カレンダーをフォローしました");
    } catch (error) {
      setError("カレンダーのフォローに失敗しました");
    }
  };

  const filteredCalendars = publicCalendars
    ? publicCalendars.filter((calendar) => {
        const name = calendar.name?.toLowerCase() || "";
        const ownerName = calendar.ownerName?.toLowerCase() || "";
        return (
          name.includes(searchQuery.toLowerCase()) ||
          ownerName.includes(searchQuery.toLowerCase())
        );
      })
    : [];

  const { data: selectedCalendarEvents } = getCalendarEvents(
    selectedCalendar || "",
  );

  const selectedCalendarData = publicCalendars?.find(
    (calendar) => calendar.calendarId === selectedCalendar,
  );

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toISOString();
    } catch {
      return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4">公開カレンダー一覧</Typography>
          <Button variant="outlined" onClick={() => navigate("/")}>
            マイカレンダーへ戻る
          </Button>
        </Box>
        <TextField
          fullWidth
          label="カレンダーを検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
        />

        {selectedCalendar ? (
          <>
            <Button
              variant="outlined"
              onClick={() => setSelectedCalendar(null)}
              sx={{ mb: 2 }}
            >
              一覧に戻る
            </Button>
            <CalendarSelector
              calendars={publicCalendars || []}
              selectedCalendarId={selectedCalendar}
              onCalendarChange={setSelectedCalendar}
              currentUserId={currentUser?.userId || ""}
              onUnfollow={async (calendarId) => {
                try {
                  await unfollowCalendar.mutateAsync(calendarId);
                  setSuccessMessage("カレンダーのフォローを解除しました");
                } catch (error) {
                  setError("フォロー解除に失敗しました");
                }
              }}
              onFollow={handleFollowCalendar}
              isPublicView={true}
            />
            {selectedCalendarData && (
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale="ja"
                events={
                  selectedCalendarEvents
                    ?.map((event) => {
                      const startDate = formatDate(event.startTime);
                      const endDate = formatDate(event.endTime);

                      if (!startDate || !endDate) return null;

                      return {
                        id: event.eventId,
                        title: event.title,
                        start: startDate,
                        end: endDate,
                        allDay: event.allDay,
                        backgroundColor: "#3788d8",
                        borderColor: "#2c6cb2",
                        textColor: "#ffffff",
                      };
                    })
                    .filter(
                      (event): event is NonNullable<typeof event> =>
                        event !== null,
                    ) || []
                }
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth",
                }}
                height="auto"
              />
            )}
          </>
        ) : (
          <Grid container spacing={3}>
            {filteredCalendars?.map((calendar: Calendar) => (
              <Grid item xs={12} sm={6} md={4} key={calendar.calendarId}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{calendar.name}</Typography>
                    <Typography color="textSecondary">
                      作成者: {calendar.ownerName}
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedCalendar(calendar.calendarId)}
                      >
                        表示
                      </Button>
                      {isAuthenticated && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleFollowCalendar(calendar.calendarId)
                          }
                        >
                          フォロー
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <ErrorSnackbar
          open={!!error}
          message={error || ""}
          onClose={() => setError(null)}
        />
        <SuccessSnackbar
          open={!!successMessage}
          message={successMessage || ""}
          onClose={() => setSuccessMessage(null)}
        />
      </Box>
    </Container>
  );
};

export default PublicCalendars;
