import React from 'react';
import {AxiosInstance} from "../AxiosInstance";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class NewPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {name: "", post: ""};
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      "title": this.state.title,
      "post": this.state.post,
      "owner": localStorage.getItem('username')
    };
    const newPost = await AxiosInstance.getInstance().post("/models", data);
    this.props.callback(newPost);
    this.setState({post: "", title: "", email: "", status: "", dueDate: new Date()});
  }

  render() {
    return (
      <Paper className="paper">
        <Typography variant="h5">New Post</Typography>
        <br/>
        <form className="form" onSubmit={this.handleSubmit}>
          <TextField required label="Title" fullWidth
                     value={this.state.title}
                     onChange={event => this.setState({title: event.target.value})}/>
          <TextField required label="Post" fullWidth
                     value={this.state.post}
                     onChange={event => this.setState({post: event.target.value})}/>
          <br/><br/>
          <Button type="submit" color="primary" variant="contained" fullWidth>
            Post!
          </Button>
        </form>
      </Paper>
    );
  }
}

export default NewPost;
