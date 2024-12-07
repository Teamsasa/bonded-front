import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import { Calendar, User } from "../types";

interface CalendarFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Calendar>) => void;
  initialData?: Partial<Calendar>;
  users?: User[];
}

export const CalendarForm: React.FC<CalendarFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  users = [],
}) => {
  const [formData, setFormData] = useState<Partial<Calendar>>(
    initialData || {
      name: "",
      isPublic: false,
      users: [],
    },
  );

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "カレンダーを編集" : "カレンダーを作成"}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="カレンダー名"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          sx={{ mt: 2 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={formData.isPublic}
              onChange={(e) =>
                setFormData({ ...formData, isPublic: e.target.checked })
              }
            />
          }
          label="公開カレンダー"
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? "更新" : "作成"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
