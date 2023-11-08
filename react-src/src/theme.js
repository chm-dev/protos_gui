import {red, green} from '@mui/material/colors';
import {createTheme} from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode      : 'dark',
    primary   : {
      main: '#ffffff'
    },
    secondary : {
      main: '#000000'
    },
    background: {
      default: '#000000',
      paper  : '#000000'
    },
    error     : {
      main: red.A400
    },
    success   : {
      main: '#00cc00'
    }
  }
});

const lightTheme = createTheme({
  palette: {
    mode      : 'light',
    primary   : {
      main: '#000000'
    },
    secondary : {
      main: '#000099'
    },
    background: {
      default: '#ffffff',
      paper  : '#f1f1f1'
    },
    error     : {
      main: red.A400
    }
  }
});

export {
  theme,
  lightTheme
};
