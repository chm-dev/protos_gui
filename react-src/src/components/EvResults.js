import React, {Component} from 'react';
import {events, os} from '@neutralinojs/lib';
import cfg from '../config';
class EvResults extends Component {
  fileListRef = React.createRef();

  state       = {
    fileList: [],
    active  : 0
  };

  listClass   = '';

  onKeyDown(ev) {
    if (ev.code === 'Escape' || ev.code === 'Tab') {
      ev.preventDefault();
      this.setState({active: 0});
      this.listClass = '';
      this
        .props
        .searchInputRef
        .current
        .focus();
    }
  }

  onFocus(ev) {
    this.listClass = 'active';
    this.setState({active: 1});
  }

  onBlur(ev) {
    this.listClass = '';
    this.setState({active: 0});
  }

  selectFilesNeedingIcons(fileList) {
    let jsonArgument = '[';
    //filter files needing system icons
    let j = 0;
    for (let i in fileList) {
      if (fileList[i].name.match(/\.(exe|ico|lnk)$/gi) != null) {
        jsonArgument += j === 0
          ? ''
          : ',';
        jsonArgument += `{Context: '${i}', Path: '${fileList[i]
          .path
          .replaceAll('\\', '/')
          .replaceAll('[', '\\[')
          .replaceAll(']', '\\]')}/${fileList[i]
          .name}'}`;
        j++;
      }
    }
    jsonArgument += ']';
    return j > 0
      ? jsonArgument
      : false;
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.fileList !== this.props.fileList) {
      const fileList = [...nextProps.fileList];

      const jsonArgument = this.selectFilesNeedingIcons(fileList);

      if (jsonArgument) {
        let payload = '';
        let getIconProc = await os.spawnProcess(`${cfg.iconExtractorPath} "${jsonArgument}"`);

        events.on('spawnedProcess', evt => {
          if (getIconProc.id === evt.detail.id) {
            switch (evt.detail.action) {
              case 'stdOut':
                debugger;
                payload += evt.detail.data;
                break;
              case 'stdErr':
                break;
              case 'exit':
                if (payload.trim().length === 0) 
                  break;
                payload = payload.match(/\[[^\]]+\][\r\n]*$/g)[0];
                const payloads = JSON.parse(payload);
                payloads.forEach(payloadObj => {
                  if (fileList[payloadObj.Context]) 
                    fileList[payloadObj.Context].icon = payloadObj.Base64ImageData;
                  }
                );
                this.setState({fileList: fileList});
                break;
              default:
                break;
            }
          }
        });
      }
    }
    this.setState({
      fileList: [...nextProps.fileList],
      mode    : nextProps.mode
    });
  }

  render() {
    return (
      <ul
        ref={this.props.childInputRef}
        onBlur={ev => this.onBlur(ev)}
        onFocus={ev => this.onFocus(ev)}
        onKeyDown={ev => this.onKeyDown(ev)}
        className={this.listClass}
        tabIndex='0'>
        {
          this
            .state
            .fileList
            .map(fileItem => {
              const icon = fileItem.icon
                ? <img alt='' src={`data:image/jpeg;base64,${fileItem.icon}`}/>
                : '';
              return (
                <li key={fileItem.path + fileItem.name}>
                  [{fileItem.size}] {icon}
                  {fileItem.name}
                </li>
              );
            })
        }
      </ul>
    );
  }
}

export default EvResults;
