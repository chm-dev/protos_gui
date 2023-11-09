import React, { Component } from 'react';
import { events, os } from '@neutralinojs/lib';
import {
  List,
  Box,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton
} from '@mui/material';
import cfg from '../config';
import searchProvicer from './EvQuery/searchProvider';
import EvResultItem from './EvQuery/EvResultItem';

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
          this.state.activeItem + 1 > this.state.fileList.length
            ? 1
            : this.state.activeItem + 1
      });
    } else if (ev.code === 'ArrowUp') {
      ev.preventDefault();
      this.setState({
        activeItem:
          this.state.activeItem - 1 < 1
            ? this.state.fileList.length
            : this.state.activeItem - 1
      });
    } else if (ev.code === 'Home') {
      ev.preventDefault();
      this.setState({
        activeItem: 1
      });
    } else if (ev.code === 'End') {
      ev.preventDefault();
      this.setState({
        activeItem: this.state.fileList.length
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
    if (nextProps.fileList === this.props.fileList) return;
    const fileList = [...nextProps.fileList];
    this.setState({ activeItem: 1 }); // we will get new list - old activeItem needs to be br
    const jsonArgument = this.selectFilesNeedingIcons(fileList);
    if (jsonArgument) {
      let payload = '';
      let getIconProc = await os.spawnProcess(
        `${cfg.iconExtractorPath} "${jsonArgument}"`
      );
      const eventHandler = async evt => {
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
              events.off('spawnedProcess', eventHandler);
              break;
            default:
              break;
          }
        }
      };
      events.on('spawnedProcess', eventHandler);
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
        ref={this.props.childInputRef}
        onBlur={ev => this.onBlur(ev)}
        onFocus={ev => this.onFocus(ev)}
        onKeyDown={ev => this.onKeyDown(ev)}
        //className={this.listClass}
        sx={{ outline: 'none' }}
        tabIndex="0">
        {this.state.fileList.map((fileItem, i) => {
          return (
            <EvResultItem
              active={i === this.state.activeItem - 1 && this.state.active}
              ind={i}
              fileItem={fileItem}
              key={i}
            />
          );
        })}
      </List>
    );
  }
}
export default EvResults;
