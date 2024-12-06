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
import { Calendar } from "../types";

const PublicCalendars: React.FC = () => {
  const { getPublicCalendars } = useCalendar();
  const { data: publicCalendars } = getPublicCalendars();
  const [error, setError] = useState<string | null>(null);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          公開カレンダー一覧
        </Typography>
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
                    onClick={() => {
                      /* フォロー機能の実装 */
                    }}
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
      </Box>
    </Container>
  );
};

export default PublicCalendars;