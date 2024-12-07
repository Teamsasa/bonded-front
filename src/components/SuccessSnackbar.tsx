import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SuccessSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({
  open,
  message,
  onClose,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}; 