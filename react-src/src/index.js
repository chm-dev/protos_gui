import React from 'react';
import ReactDOM from 'react-dom/client';

import EvQuery from './components/EvQuery';
import { init } from '@neutralinojs/lib';
import './App.css';

import {
  FluentProvider,
  webDarkTheme,
  useThemeClassName
} from '@fluentui/react-components';

//https://github.com/microsoft/fluentui/issues/23626#issuecomment-1162255474 🤦‍♂️🤦‍♂️🤦‍♂️
function ApplyToBody() {
  const classes = useThemeClassName();

  React.useEffect(() => {
    const classList = classes.split(' ');
    document.body.classList.add(...classList);

    return () => document.body.classList.remove(...classList);
  }, [classes]);

  return null;
}

class Main extends React.Component {
  render() {
    return <EvQuery initialQuery="" />;
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FluentProvider theme={webDarkTheme}>
    <ApplyToBody />
    <Main />
  </FluentProvider>
);
init();
