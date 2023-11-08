import React, { Component } from 'react';
import { events, os } from '@neutralinojs/lib';

import { List, ListItem, ListItemText, ListItemAvatar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import cfg from '../config';

import './EvResults.css';

class EvResults extends Component {
  constructor() {
    super();
    this.state = {
      fileList: [],
      active: 0,
      activeItem: 0
    };
  }
  fileListRef = React.createRef();

  listClass = '';

  getSelectedItem() {
    const ts = this.state;
    return ts.active ? this.props.fileList[ts.activeItem] : false;
  }
  onKeyDown(ev) {
    if (ev.code === 'Escape' || ev.code === 'Tab' || ev.code === 'Backspace') {
      ev.preventDefault();
      this.setState({ active: 0 });
      this.listClass = '';
      this.props.searchInputRef.current.focus();
    } else if (ev.code === 'ArrowDown') {
      ev.preventDefault();
      this.setState({
        activeItem:
          this.state.activeItem + 2 > this.state.fileList.length
            ? 0
            : this.state.activeItem + 1
      });
    } else if (ev.code === 'ArrowUp') {
      ev.preventDefault();
      this.setState({
        activeItem:
          this.state.activeItem - 1 < 0
            ? this.state.fileList.length - 1
            : this.state.activeItem - 1
      });
    } else if (ev.code === 'Space') {
      alert(JSON.stringify(this.getSelectedItem()));
    }
  }

  onFocus(ev) {
    this.listClass = 'active';
    this.setState({ active: 1 });
  }

  onBlur(ev) {
    this.listClass = '';
    this.setState({ active: 0 });
  }

  selectFilesNeedingIcons(fileList) {
    let jsonArgument = '[';
    //filter files needing system icons
    let j = 0;
    for (let i in fileList) {
      if (fileList[i].name.match(/\.*$/gi) != null) {
        //(exe|ico|lnk)
        jsonArgument += j === 0 ? '' : ',';
        jsonArgument += `{Context: '${i}', Path: '${fileList[i].path
          .replaceAll('\\', '/')
          .replaceAll('[', '\\[')
          .replaceAll(']', '\\]')}/${fileList[i].name}'}`;
        j++;
      }
    }
    jsonArgument += ']';
    return j > 0 ? jsonArgument : false;
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.fileList !== this.props.fileList) {
      const fileList = [...nextProps.fileList];
      this.setState({ activeItem: 0 }); // we will get new list - old activeItem needs to be br
      const jsonArgument = this.selectFilesNeedingIcons(fileList);

      if (jsonArgument) {
        let payload = '';
        let getIconProc = await os.spawnProcess(
          `${cfg.iconExtractorPath} "${jsonArgument}"`
        );

        events.on('spawnedProcess', evt => {
          if (getIconProc.id === evt.detail.id) {
            switch (evt.detail.action) {
              case 'stdOut':
                payload += evt.detail.data;
                break;
              case 'stdErr':
                break;
              case 'exit':
                if (payload.trim().length === 0) break;
                payload = payload.match(/\[[^\]]+\][\r\n]*$/g)[0];
                const payloads = JSON.parse(payload);
                payloads.forEach(payloadObj => {
                  if (fileList[payloadObj.Context])
                    fileList[payloadObj.Context].icon = payloadObj.Base64ImageData;
                });
                this.setState({ fileList: fileList });
                break;
              default:
                break;
            }
          }
        });
      }
    }
    this.setState({
      fileList: [...nextProps.fileList]
    });
  }

  render() {
    return (
      /*  */
      <List
        dense={true}
        sx={{}}
        ref={this.props.childInputRef}
        onBlur={ev => this.onBlur(ev)}
        onFocus={ev => this.onFocus(ev)}
        onKeyDown={ev => this.onKeyDown(ev)}
        className={this.listClass}
        tabIndex="0">
        {this.state.fileList.map((fileItem, i) => {
          const icon = fileItem.icon ? (
            <img alt="" src={`data:image/jpeg;base64,${fileItem.icon}`} />
          ) : (
            <span />
          );
          return (
            <ListItem
              className={
                this.state.active && i === this.state.activeItem ? 'activeItem' : ''
              }
              key={fileItem.path + fileItem.name}
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }>
              <ListItemAvatar>{icon}</ListItemAvatar>
              <ListItemText primary={fileItem.name} secondary={fileItem.path} />
            </ListItem>
          );
        })}
      </List>
    );
  }
  /* 
  render() {
    return ( 
      <ul
        ref={this.props.childInputRef}
        onBlur={ev => this.onBlur(ev)}
        onFocus={ev => this.onFocus(ev)}
        onKeyDown={ev => this.onKeyDown(ev)}
        className={this.listClass}
        tabIndex="0">
        {this.state.fileList.map(fileItem => {
          const icon = fileItem.icon ? (
            <img alt="" src={`data:image/jpeg;base64,${fileItem.icon}`} />
          ) : (
            ''
          );
          return (
            <li key={fileItem.path + fileItem.name}>
              [{fileItem.size}] {icon}
              {fileItem.name}
            </li>
          );
        })}
      </ul>
    );
  }
  */
}

export default EvResults;
