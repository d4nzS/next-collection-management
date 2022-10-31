import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <CircularProgress/>
    </Box>
  );
};

export default LoadingSpinner;