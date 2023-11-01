import React, { Component } from 'react';
import EvResults from './EvResults';
import cfg from '../config';


import axios from 'axios';
//import csvtojson from 'csvtojson';
//import { events, os } from '@neutralinojs/lib';

class EvQuery extends Component {

  constructor(props) {
    super(props);
    this.searchInputRef = React.createRef();
    this.childInputRef = React.createRef();
    this.state = {
      fileList: [],
      active: 0

    }
  }

  searchTerm = ''
  timeoutId = null;

  onFocus() {

    this.setState({ active: 1 })
  }

  onBlur() {

    this.setState({ active: 0 })
  }

  onKeyDown(ev) {
    if (ev.code === 'ArrowDown' || ev.code === 'Enter') {

      console.log(this.childInputRef);
      this.childInputRef.current.focus();

    }
  }

  onValueChange(ev) {

    console.log('onchange');
    this.searchTerm = ev.target.value;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.searchTerm.trim().length > 2) {
      this.timeoutId = setTimeout(async (that) => {
        console.log('search triggered');
        axios.get(`http://localhost:5225/?search=${this.searchTerm}&count=30&path_column=1&date_created_column=1&j=1&date_modified_column=1&sort=size&ascending=0&diacritics=1&size_column=1&attributes_column=1`)
          .then(res => { console.log(res); this.setState({ fileList: res.data.results }); });

        /*                 let getFileList = await os.spawnProcess(`C:/dev/neutralino/protos_gui/helpers/es.exe ${this.searchTerm} ext:exe;lnk;ico -csv -da -n 20 -sort-date-accessed-descending -size -attrib -name -path-column`);
                
                        let payload = '';
                
                        const eventHandler = async (evt) => {
                          if (getFileList.id === evt.detail.id) {
                            console.log(evt.detail.action);
                            switch (evt.detail.action) {
                              case 'stdOut':
                
                                payload += evt.detail.data ? evt.detail.data : ''
                                //    console.log(`C:/dev/neutralino/protos_gui/helpers/iconextractor/IconExtractor/bin/x64/Release/net6.0/IconExtractor.exe "{Context: '${i}', Path: '${fileList[i].path.replaceAll('\\', '/')}/${fileList[i].name}'}"`);        
                                break;
                              case 'stdErr':
                                console.error(evt.detail.data);
                                break;
                              case 'exit':
                 
                                if (!payload || payload.trim().length === 0) break;
                
                                const newFileList = await csvtojson().fromString(payload.replaceAll('\\', '/'))
                                newFileList.name = newFileList.Name;
                                newFileList.path = newFileList.Path;
                                console.log(newFileList);
                                this.setState({ fileList: newFileList });
                                events.off('spawnedProcess', eventHandler);
                                this.forceUpdate();
                
                                console.log("state update, event watcher dsiabled");
                                break;
                
                            }
                          }
                        }
                
                        events.on('spawnedProcess', eventHandler);
                
                  */
      }, 250, this)
    } else {
      this.setState({ fileList: [] })
    }



  }

  componentDidMount() {
    this.searchInputRef.current.focus();
  }
  render() {
    return (
      <div>
        <input className="main-input" type="text" ref={this.searchInputRef} disabled={this.state.mode}
          onChange={ev => this.onValueChange(ev)} onKeyDown={ev => this.onKeyDown(ev)} onFocus={ev => this.onFocus(ev)} onBlur={ev => this.onBlur(ev)} />
        <EvResults fileList={this.state.fileList} searchInputRef={this.searchInputRef} childInputRef={this.childInputRef} />
      </div>
    );
  }
}


export default EvQuery;


