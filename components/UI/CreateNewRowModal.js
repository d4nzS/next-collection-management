import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField
} from '@mui/material';
import CreatableSelect from 'react-select/creatable';

const CreateNewRowModal = ({ mode, fields, onClose, onSubmit }) => {
  const [values, setValues] = useState(fields.reduce((fieldsObj, field) => {
    fieldsObj[field.name] = field.type === 'tags' ? [] : '';

    return fieldsObj;
  }, {}));

  const changeHandler = event => {
    setValues(prevValues => ({
      ...prevValues,
      [event.target.name]: event.target.files?.[0] || event.target.value,
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

      case 'radio':
        return (
          <FormControl key={field.name} variant="standard">
            <FormLabel id={field.name}>{field.label}</FormLabel>
            <RadioGroup
              name={field.name}
              value={values[field.name]}
              onChange={changeHandler}
              required={field.required}
            >
              <FormControlLabel value="Yes" control={<Radio/>} label="Yes"/>
              <FormControlLabel value="No" control={<Radio/>} label="No"/>
            </RadioGroup>
          </FormControl>
        );

      case 'tags':
        return <CreatableSelect
          key={field.name}
          isClearable
          isMulti
          options={[{
            value: field.name,
            label: field.name
          }]}
          onChange={newValue => setValues(prevValues => ({
            ...prevValues,
            [field.name]: newValue.map(val => val.value.trim())
          }))}
          placeholder={field.label}
        />

      default:
        const valueProp = {
          ...(field.type !== 'file' && { value: values[field.name] })
        };

        return <TextField
          key={field.name}
          variant="standard"
          name={field.name}
          label={field.label}
          type={field.type}
          onChange={changeHandler}
          required={field.required}
          multiline={field.type === 'textarea'}
          {...valueProp}
        />;
    }
  });

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle textAlign="center">Create {mode}</DialogTitle>
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
          >Create {mode}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateNewRowModal;