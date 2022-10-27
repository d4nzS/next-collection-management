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
import CreatableSelect from 'react-select/creatable';

const CreateNewRowModal = ({ isOpen, fields, onClose, onSubmit }) => {
  const [values, setValues] = useState(fields.reduce((fieldsObj, field) => {
    fieldsObj[field.name] = field.type === 'tags'
      ? []
      : '';

    return fieldsObj;
  }, {}));

  console.log(values);

  const changeHandler = event => {
    setValues(prevValues => ({
      ...prevValues,
      [event.target.name]: event.target.value
    }));
  };

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
              value={values[field.name]}
              onChange={changeHandler}
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

      case 'tags':
        return <CreatableSelect
          key={field.name}
          isClearable
          isMulti
          onChange={newValue => setValues(prevValues => ({
            ...prevValues,
            [field.name]: newValue.map(val => val.value.trim())
          }))}
          placeholder={field.label}
        />

      default:
        return <TextField
          key={field.name}
          variant="standard"
          name={field.name}
          label={field.label}
          value={values[field.name]}
          onChange={changeHandler}
          required={field.required}
          multiline={field.type === 'textarea'}
        />;
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