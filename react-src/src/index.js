import React from 'react';
import ReactDOM from 'react-dom/client';
import EvQuery from './components/EvQuery';
import { init } from '@neutralinojs/lib';
import { os } from '@neutralinojs/lib';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, theme } from './theme';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  state = { home: '' };

  componentDidMount() {
    os.getEnv('HOMEDRIVE').then(homedrive =>
      os
        .getEnv('HOMEPATH')
        .then(homepath => this.setState({ home: homedrive + homepath }))
    );
  }
  render() {
    return <EvQuery initialQuery="" home={this.state.home} />;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline enableColorScheme />
    <Main />
  </ThemeProvider>
);
init(); //neutralinojs
