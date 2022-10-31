import { createContext, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

export const ColorModeContext = createContext({
  toggleColorMode: () => {
  }
});

const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('theme') || 'light');

  const theme = createTheme({
    palette: {
      mode
    }
  });

  const colorMode = {
    toggleColorMode: () => {
      setMode(prevMode => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';

        localStorage.setItem('theme', newMode);

        return newMode;
      });
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ColorModeProvider;