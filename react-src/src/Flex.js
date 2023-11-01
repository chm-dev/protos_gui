import React from 'react';
import ReactDOM from 'react-dom/client';

import {Layout, Model} from 'flexlayout-react';
import 'flexlayout-react/style/dark.css';  

var json = {
  global: {tabEnableClose:false},
  borders:[
      {
        "type": "border",
        "location":"bottom",
        "size": 100,
        "children": [
            {
            "type": "tab",
            "name": "four",
            "component": "text"
            }
          ]
      },
      {
        "type": "border",
        "location":"left",
        "size": 100,
        "children": []
       }
  ],
  layout: {
      "type": "row",
      "weight": 100,
      "children": [
          {
              "type": "tabset",
              "weight": 50,
              "selected": 0,
              "children": [
                  {
                      "type": "tab",
                      "name": "One",
                      "component": "text"
                  }
              ]
          },
          {
              "type": "tabset",
              "weight": 50,
              "selected": 0,
              "children": [
                  {
                      "type": "tab",
                      "name": "Two",
                      "component": "text"
                  },
                  {
                      "type": "tab",
                      "name": "Three",
                      "component": "text"
                  }
              ]
          }
      ]
  }
};

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {model: Model.fromJson(json)};
  }

  factory(node) {
      var component = node.getComponent();
      if (component === "text") {
          return (<div className="panel">Panel {node.getName()}</div>);
      }
  }

  render() {
      return (
          <Layout
              model={this.state.model}
              factory={this.factory.bind(this)}/>
      );
  }
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Main/>);
