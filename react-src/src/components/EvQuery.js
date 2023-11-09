import React, { Component } from 'react';

import { Container, TextField, InputAdornment, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { deepOrange } from '@mui/material/colors';
import axios from 'axios';

import EvResults from './EvResults';
import FilterControl from './EvQuery/FilterControl';
import doQuery from './EvQuery/searchProvider';
import cfg from '../config';

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

  activeProvider = 'Everything';
  searchTerm = '';
  timeoutId = null;

  getSearchTerm() {
    let searchTerm = this.searchInputRef.current.value;
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
  async queryEv() {
    const result = await doQuery(
      this.activeProvider,
      this.searchTerm,
      this.state.currentFilter
    );

    this.setState({ fileList: result });
    this.forceUpdate();
  }

  onValueChange(ev) {
    this.searchTerm = this.getSearchTerm();

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.searchTerm.trim().length > 2) {
      this.timeoutId = setTimeout(
        () => {
          this.queryEv(this.activeProvider, this.searchTerm);
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
    if (this.searchTerm.length > 2) this.queryEv();
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
