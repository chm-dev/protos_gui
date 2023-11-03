import React from 'react';
import ReactDOM from 'react-dom';

import EvQuery from './components/EvQuery';
import { init } from '@neutralinojs/lib';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
//import './App.css';
import { lightTheme, theme } from './theme';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

class Main extends React.Component {
  render() {
    return <EvQuery initialQuery="" />;
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline enableColorScheme />
    <Main />
  </ThemeProvider>
);
init();
