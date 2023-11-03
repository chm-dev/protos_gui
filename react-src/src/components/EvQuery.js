import React, { Component } from 'react';
import EvResults from './EvResults';
import cfg from '../config';

import { Input } from '@fluentui/react-components';

import axios from 'axios';
//import csvtojson from 'csvtojson'; import { events, os } from '@neutralinojs/lib';

class EvQuery extends Component {
  constructor(props) {
    super(props);
    this.searchInputRef = React.createRef();
    this.childInputRef = React.createRef();
    this.state = {
      fileList: [],
      active: 0
    };
  }

  evParams =
    'count=10&path_column=1&date_created_column=1&j=1&date_modified_column=1&sort=size&ascending=0&diacritics=1&size_column=1&attributes_column=1';
  searchTerm = '';
  timeoutId = null;

  onFocus() {
    this.setState({ active: 1 });
  }

  onBlur() {
    this.setState({ active: 0 });
  }

  onKeyDown(ev) {
    if ((ev.code === 'ArrowDown' || ev.code === 'Enter') && this.state.fileList.length) {
      this.childInputRef.current.focus();
    }
  }

  onValueChange(ev) {
    this.searchTerm = ev.target.value;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.searchTerm.trim().length > 2) {
      this.timeoutId = setTimeout(
        async that => {
          axios
            .get(`${cfg.evEndpoint}?search=${this.searchTerm}&${this.evParams}`)
            .then(res => {
              this.setState({ fileList: res.data.results });
            });

          /* let getFileList = await os.spawnProcess(`C:/dev/neutralino/protos_gui/helpers/es.exe ${this.searchTerm} ext:exe;lnk;ico -csv -da -n 20 -sort-date-accessed-descending -size -attrib -name -path-column`);

                        let payload = '';

                        const eventHandler = async (evt) => {
                          if (getFileList.id === evt.detail.id) {

                            switch (evt.detail.action) {
                              case 'stdOut':

                                payload += evt.detail.data ? evt.detail.data : ''
                                //    }/${fileList[i].name}'}"`);
                                break;
                              case 'stdErr':
                                console.error(evt.detail.data);
                                break;
                              case 'exit':

                                if (!payload || payload.trim().length === 0) break;

                                const newFileList = await csvtojson().fromString(payload.replaceAll('\\', '/'))
                                newFileList.name = newFileList.Name;
                                newFileList.path = newFileList.Path;

                                this.setState({ fileList: newFileList });
                                events.off('spawnedProcess', eventHandler);
                                this.forceUpdate();


                                break;

                            }
                          }
                        }

                        events.on('spawnedProcess', eventHandler);

                  */
        },
        250,
        this
      );
    } else {
      this.setState({ fileList: [] });
    }
  }

  componentDidMount() {
    this.searchInputRef.current.focus();
  }
  render() {
    return (
      <div>
        <Input
          id="test1"
          {...this.props}
          ref={this.searchInputRef}
          disabled={this.state.mode}
          onChange={ev => this.onValueChange(ev)}
          onKeyDown={ev => this.onKeyDown(ev)}
          onFocus={ev => this.onFocus(ev)}
          onBlur={ev => this.onBlur(ev)}
        />
        <input
          className="main-input"
          ref={this.searchInputRef}
          disabled={this.state.mode}
          onChange={ev => this.onValueChange(ev)}
          onKeyDown={ev => this.onKeyDown(ev)}
          onFocus={ev => this.onFocus(ev)}
          onBlur={ev => this.onBlur(ev)}
        />
        <EvResults
          fileList={this.state.fileList}
          searchInputRef={this.searchInputRef}
          childInputRef={this.childInputRef}
        />
      </div>
    );
  }
}

export default EvQuery;
