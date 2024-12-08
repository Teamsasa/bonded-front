import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface InviteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: string, accessLevel: string) => void;
}

export const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [userId, setUserId] = useState("");
  const [accessLevel, setAccessLevel] = useState("VIEWER");

  const handleSubmit = () => {
    if (userId.trim()) {
      onSubmit(userId, accessLevel);
      setUserId("");
      setAccessLevel("VIEWER");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>ユーザーを招待</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="ユーザーID"
          fullWidth
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth>
          <InputLabel>アクセス権限</InputLabel>
          <Select
            value={accessLevel}
            label="アクセス権限"
            onChange={(e) => setAccessLevel(e.target.value)}
          >
            <MenuItem value="VIEWER">閲覧者</MenuItem>
            <MenuItem value="EDITOR">編集者</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleSubmit} variant="contained">
          招待
        </Button>
      </DialogActions>
    </Dialog>
  );
};
