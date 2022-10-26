import { useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import useInput from '../../hooks/use-input';

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const AuthForm = ({ isLoginMode, onAuth }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput
  } = useInput(value => EMAIL_REGEXP.test(value));

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput
  } = useInput(value => !!value);

  const formIsValid = enteredEmailIsValid && enteredPasswordIsValid;

  const submitHandler = async event => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    if (!formIsValid) {
      return;
    }

    try {
      await onAuth({
        email: enteredEmail,
        password: enteredPassword
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      resetEmailInput();
      resetPasswordInput();
    }
  };

  const emailErrorMessage = emailInputHasError && `Enter the ${enteredEmail.trim() && 'valid'} email!`;
  const passwordErrorMessage = passwordInputHasError && 'Enter the password';

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          {isLoginMode ? 'Sign in' : 'Sign up'}
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={submitHandler}
        >
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            error={emailInputHasError}
            helperText={emailErrorMessage}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            error={passwordInputHasError}
            helperText={passwordErrorMessage}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            {isLoading
              ? <CircularProgress/>
              : <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!formIsValid}
              >{isLoginMode ? 'Sign in' : 'Sign up'}</Button>}
          </Box>
          <Typography
            variant="body2"
            component="span"
            sx={{ textDecoration: 'underline' }}
          >
            <Link href={isLoginMode ? 'signup' : 'login'}>
              {isLoginMode
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthForm;