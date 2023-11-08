import React, { Component } from 'react';
import { Button, ButtonGroup, Stack } from '@mui/material';
import './FilterControl.css';
class FilterControl extends Component {
  state = {
    currentFilter: this.props.currentFilter
  };

  stateStyle = function(i) {
    return this.state.currentFilter === i
      ? {
          bgcolor: 'success.main',
          color: 'secondary.main'
        }
      : {};
  };

  buttonOnClick = function(i) {
    this.setState({ currentFilter: i });
  };

  async UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ currentFilter: nextProps.currentFilter });
  }

  render() {
    return (
      <ButtonGroup
        size="small"
        aria-label="small button group"
        variant="text"
        className="filterControlGroup">
        <Button sx={this.stateStyle(1)} onClick={evt => this.buttonOnClick(1)}>
          1: .*
        </Button>
        <Button sx={this.stateStyle(2)} onClick={evt => this.buttonOnClick(2)}>
          2: .exe
        </Button>
        <Button sx={this.stateStyle(3)} onClick={evt => this.buttonOnClick(3)}>
          3: dir
        </Button>
      </ButtonGroup>
    );
  }
}

export default FilterControl;
