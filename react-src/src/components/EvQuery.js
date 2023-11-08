import React, { Component } from 'react';

import { Container, TextField, InputAdornment, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { deepOrange } from '@mui/material/colors';
import axios from 'axios';
import Hotkeys from 'react-hot-keys';

import EvResults from './EvResults';
import FilterControl from './EvQuery/FilterControl';
import cfg from '../config';
//import csvtojson from 'csvtojson'; import { events, os } from '@neutralinojs/lib';

class EvQuery extends Component {
  constructor(props) {
    super(props);
    this.searchInputRef = React.createRef();
    this.childInputRef = React.createRef();
    this.state = {
      fileList: [],
      active: 0,
      currentFilter: 1
    };
  }

  evParams =
    'count=10&path_column=1&date_created_column=1&j=1&date_modified_column=1&sort=date_modified&ascending=0&diacritics=1&size_column=1&attributes_column=1&r=1';
  searchTerm = '';
  timeoutId = null;

  getSearchTerm() {
    let searchTerm = this.searchInputRef.current.value;
    if (this.state.currentFilter === 2) searchTerm += '.*.exe$';
    return searchTerm;
  }

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
  queryEv() {
    console.log(this.searchTerm);

    axios
      .get(
        `${cfg.evEndpoint}?search=${this.getSearchTerm(this.state.currentFilter)}&${
          this.evParams
        }`
      )
      .then(res => {
        this.setState({ fileList: res.data.results });
      });
  }
  onValueChange(ev) {
    this.searchTerm = this.getSearchTerm(this);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.searchTerm.trim().length > 2) {
      this.timeoutId = setTimeout(
        () => {
          this.queryEv();
        },
        250,
        this
      );
    } else {
      this.setState({ fileList: [] });
    }
  }

  onComponentKeyDown(ev) {
    if (
      ev.key &&
      typeof Number(ev.key) === 'number' &&
      [1, 2, 3].some(el => el === Number(ev.key)) &&
      ev.ctrlKey
    ) {
      ev.preventDefault();

      this.setState({ currentFilter: Number(ev.key) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentFilter === this.state.currentFilter) return false;
    this.queryEv();
  }

  render() {
    return (
      <Container onKeyDown={ev => this.onComponentKeyDown(ev)}>
        <FilterControl currentFilter={this.state.currentFilter} />
        <TextField
          autoFocus
          hiddenLabel
          size="small"
          margin="dense"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: deepOrange[500] }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip variant="Outlined" label={this.state.currentFilter} />
                <Chip variant="Outlined" label={this.state.currentFilter} />
              </InputAdornment>
            )
          }}
          inputRef={this.searchInputRef}
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
      </Container>
    );
  }
}

export default EvQuery;
