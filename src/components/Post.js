import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


class Post extends React.Component {
  useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

  constructor(props) {
    super(props);
    this.classes = this.useStyles();
  }

  render() {
    return (
      <Card className={this.classes.root} variant="outlined">
        <CardContent>
          <Typography className={this.classes.title} color="textSecondary" gutterBottom>
            {this.props.data.title}
          </Typography>
          <Typography className={this.classes.pos} color="textSecondary">
            {this.props.data.username}
          </Typography>
          <Typography variant="body2" component="p">
            {this.props.data.content}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default Post;
