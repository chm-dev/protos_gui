import React from 'react';
import ReactDOM from 'react-dom';

import EvQuery from './components/EvQuery';
import {init} from '@neutralinojs/lib';

import './App.css';

class Main extends React.Component {
 
  
    render() {
        return (
            <EvQuery initialQuery="" />
        );
    }
  }
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Main/>);
  init();