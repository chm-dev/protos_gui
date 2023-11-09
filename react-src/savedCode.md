# Ev Query es.exe approach

```js
let getFileList = await os.spawnProcess(
  `C:/dev/neutralino/protos_gui/helpers/es.exe ${this.searchTerm} ext:exe;lnk;ico -csv -da -n 20 -sort-date-accessed-descending -size -attrib -name -path-column`
);

let payload = "";

const eventHandler = async evt => {
  if (getFileList.id === evt.detail.id) {
    switch (evt.detail.action) {
      case "stdOut":
        payload += evt.detail.data ? evt.detail.data : "";
        //    }/${fileList[i].name}'}"`);
        break;
      case "stdErr":
        console.error(evt.detail.data);
        break;
      case "exit":
        if (!payload || payload.trim().length === 0) break;

        const newFileList = await csvtojson().fromString(
          payload.replaceAll("\\", "/")
        );
        newFileList.name = newFileList.Name;
        newFileList.path = newFileList.Path;

        this.setState({ fileList: newFileList });
        events.off("spawnedProcess", eventHandler);
        this.forceUpdate();

        break;
    }
  }
};

events.on("spawnedProcess", eventHandler);
```

```jsx
import React, { Component } from "react";
import { events, os } from "@neutralinojs/lib";

import {
  List,
  Box,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import cfg from "../../config";

import "../EvResults.css";

class EvResultItem extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state.fileItem = this.state.fileItem;
    this.state.i = this.props.ind;
    console.log("STATE:" + this.state);
  }

  icon = this.state.fileItem.icon ? (
    <img alt="" src={`data:image/jpeg;base64,${this.state.fileItem.icon}`} />
  ) : (
    <span />
  );

  render() {
    console.log("STATE:" + this.state);
    return (
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>{this.icon}</ListItemAvatar>

        <ListItemText
          primary={this.state.fileItem.name}
          secondary={this.state.fileItem.path}
        ></ListItemText>
      </ListItem>
    );
  }
}

export default EvResultItem;
```
