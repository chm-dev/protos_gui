import React, { Component } from 'react';
import { events, os } from '@neutralinojs/lib';

class EvResults extends Component {

  fileListRef = React.createRef();

  state = {
    fileList: [],
    active: 0
  }

  listClass = '';


  onKeyDown(ev) {
    console.log(ev);
    if (ev.code === "Escape" || ev.code === "Tab") {
      ev.preventDefault();
      this.setState({ active: 0 });
      this.listClass = '';
      this.props.searchInputRef.current.focus();
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



  async UNSAFE_componentWillReceiveProps(nextProps) {

    if (nextProps.fileList !== this.props.fileList) {
      const fileList = [...nextProps.fileList];
      //console.log(this);
      //const fileList = this.fileList;

      let jsonArgument = '[';
      let j = 0;
      for (let i in fileList) {

        if (fileList[i].name.match(/\.(exe|ico|lnk)$/gi) != null) {
          jsonArgument += j === 0 ? '' : ','
          jsonArgument += `{Context: '${i}', Path: '${fileList[i].path.replaceAll('\\', '/').replaceAll('[', '\\[').replaceAll(']', '\\]')}/${fileList[i].name}'}`
          j++;
        }
      }
      jsonArgument += ']';
      console.log(jsonArgument);

      if (j > 0) {
        let payload = '';
        let getIconProc = await os.spawnProcess(`C:/dev/neutralino/protos_gui/helpers/iconextractor/IconExtractor/bin/x64/Release/net6.0/IconExtractor.exe "${jsonArgument}"`);


        events.on('spawnedProcess', (evt) => {

          if (getIconProc.id === evt.detail.id) {

            switch (evt.detail.action) {
              case 'stdOut':

                payload += evt.detail.data
                //    console.log(`C:/dev/neutralino/protos_gui/helpers/iconextractor/IconExtractor/bin/x64/Release/net6.0/IconExtractor.exe "{Context: '${i}', Path: '${fileList[i].path.replaceAll('\\', '/')}/${fileList[i].name}'}"`);        
                break;
              case 'stdErr':
                //   console.error(evt.detail.data); 
                break;
              case 'exit':
                //       console.log(payload);
                if (payload.trim().length === 0) break;
                payload = payload.match(/\[[^\]]+\][\r\n]*$/g)[0]

                const payloads = JSON.parse(payload)

                //console.log(payloads);
                payloads.forEach(payloadObj => { if (fileList[payloadObj.Context]) fileList[payloadObj.Context].icon = payloadObj.Base64ImageData; })
                console.log(fileList);
                this.setState({ fileList: fileList })

                break;
              default:
                break;

            }
          }
        });
      }

    }



    this.setState({ fileList: [...nextProps.fileList], mode: nextProps.mode })
  }


  render() {


    return <ul ref={this.props.childInputRef} onBlur={ev => this.onBlur(ev)} onFocus={ev => this.onFocus(ev)} onKeyDown={ev => this.onKeyDown(ev)} className={this.listClass} tabIndex="0">
      {this.state.fileList.map((fileItem) => {
        const icon = fileItem.icon ? <img alt="" src={`data:image/jpeg;base64,${fileItem.icon}`} /> : '';
        return <li key={fileItem.path + fileItem.name}>
          [{fileItem.size}] {icon} {fileItem.name}
        </li>
      })
      }
    </ul>



  }
}


export default EvResults; 