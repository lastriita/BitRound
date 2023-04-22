import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Consolas, "Courier New", monospace',
    //fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: '#120a8f', // Marine blue color
    },
  },
});

export default theme;