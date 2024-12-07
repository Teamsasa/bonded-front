import React, { useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { useCalendar } from "../hooks/useCalendar";
import { ErrorSnackbar } from "../components/ErrorSnackbar";
import { SuccessSnackbar } from "../components/SuccessSnackbar";
import { Calendar } from "../types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicCalendars: React.FC = () => {
  const { getPublicCalendars, followCalendar } = useCalendar();
  const { data: publicCalendars } = getPublicCalendars();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
        <Grid container spacing={3}>
          {publicCalendars?.map((calendar: Calendar) => (
            <Grid item xs={12} sm={6} md={4} key={calendar.calendarId}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{calendar.name}</Typography>
                  <Typography color="textSecondary">
                    作成者: {calendar.ownerUserId}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => handleFollowCalendar(calendar.calendarId)}
                  >
                    フォローする
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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
