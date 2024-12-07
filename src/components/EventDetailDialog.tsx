import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Event } from "../types";

interface EventDetailDialogProps {
  open: boolean;
  onClose: () => void;
  event: Event | null;
}

export const EventDetailDialog: React.FC<EventDetailDialogProps> = ({
  open,
  onClose,
  event,
}) => {
  if (!event) return null;

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            日時
          </Typography>
          <Typography>
            {formatDateTime(event.startTime)} ～ {formatDateTime(event.endTime)}
          </Typography>
        </Box>
        {event.description && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              説明
            </Typography>
            <Typography style={{ whiteSpace: "pre-wrap" }}>
              {event.description}
            </Typography>
          </Box>
        )}
        {event.location && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              場所
            </Typography>
            <Typography>{event.location}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};
