import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';

const CreateNewRowModal = ({ isOpen, fields, onClose, onSubmit }) => {
  const [values, setValues] = useState({});

  const submitHandler = event => {
    event.preventDefault();

    onSubmit(values);
    onClose();
  };

  const inputFields = fields.map(field => {
    switch (field.type) {
      case 'select':
        return (
          <FormControl key={field.name} variant="standard">
            <InputLabel id={field.name}>{field.label}</InputLabel>
            <Select
              id={field.name}
              name={field.name}
              label={field.label}
              onChange={e => setValues({ ...values, [e.target.name]: e.target.value })}
              required={field.required}
            >
              {field.options.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      // case 'tags':
      //   return (
      //   );
      default:
        return (
          <TextField
            key={field.name}
            variant="standard"
            label={field.label}
            name={field.name}
            onChange={e => setValues({ ...values, [e.target.name]: e.target.value.trim() })}
            required={field.required}
            multiline={field.type === 'textarea'}
          />
        );
    }
  });

  return (
    <Dialog open={isOpen}>
      <DialogTitle textAlign="center">Create Collection</DialogTitle>
      <Box
        component="form"
        onSubmit={submitHandler}
      >
        <DialogContent>
          <Stack
            sx={{
              mt: 1,
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {inputFields}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button type="button" onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
          >Create Collection</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateNewRowModal;