import React, { Component } from 'react';
import '../EvResults.css';
import {
  Badge,
  Box,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import { amber } from '@mui/material/colors';

import '../EvResults.css';

class EvResultItem extends Component {
  constructor(props) {
    super(props);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ nextProps });
    this.render();
  }

  render() {
    const icon = this.props.fileItem.icon ? (
      <img alt="" src={`data:image/jpeg;base64,${this.props.fileItem.icon}`} />
    ) : this.props.fileItem.attributes === 'D' ? (
      <FolderTwoToneIcon sx={{ color: amber[500], width: '36px', height: '36px' }} />
    ) : (
      <Box sx={{ width: '32px', height: '32px' }} />
    );
    return (
      <ListItem
        className={this.props.active ? 'activeItem' : ''}
        secondaryAction={
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        }>
        <Badge
          sx={{ color: '#ffffff' }}
          color="secondary"
          badgeContent={Number(this.props.fileItem.run_count)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}>
          <ListItemAvatar>{icon}</ListItemAvatar>
        </Badge>
        <ListItemText
          primary={this.props.fileItem.name}
          secondary={this.props.fileItem.path}></ListItemText>
      </ListItem>
    );
  }
}

export default EvResultItem;
