import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
  fab: {
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
    position: 'fixed'
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});


function FloatingActionButton(props) {
  const {classes} = props;
  return (
    <Fab color="secondary" aria-label="Add" className={classes.fab} onClick={props.callback}>
      {props.icon}
    </Fab>
  );
}

FloatingActionButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FloatingActionButton);
