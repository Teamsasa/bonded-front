import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';

interface DefaultCalendarDialogProps {
  open: boolean;
  onSubmit: (userName: string) => void;
}

export const DefaultCalendarDialog: React.FC<DefaultCalendarDialogProps> = ({
  open,
  onSubmit,
}) => {
  const [userName, setUserName] = useState('');

  const handleSubmit = () => {
    if (userName.trim()) {
      onSubmit(userName);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>ようこそ！</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          デフォルトカレンダーを作成するために、あなたのお名前を教えてください。
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="お名前"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained">
          作成
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 