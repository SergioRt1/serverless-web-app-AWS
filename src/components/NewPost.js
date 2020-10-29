import React from 'react';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Post} from "../models";
import AppSyncAPI from "../AppSyncAPI";

class NewPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {name: "", content: ""};
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit = async (e) => {
    e.preventDefault();

    const post = new Post({
      "title": this.state.title,
      "content": this.state.content,
      "owner": localStorage.getItem('username')
    });

    try {
      const newPost = await AppSyncAPI.createPost(post);
      console.log("Post saved successfully!");
      this.props.callback(newPost);
    } catch (error) {
      console.log("Error saving post", error);
    }
    this.setState({content: "", title: ""});
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
          <TextField required label="Content" fullWidth
                     value={this.state.content}
                     onChange={event => this.setState({content: event.target.value})}/>
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
