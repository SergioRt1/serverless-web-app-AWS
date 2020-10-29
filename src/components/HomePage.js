import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import FloatingActionButton from "./FloatingActionButton";
import Modal from "@material-ui/core/Modal";
import NewPost from "./NewPost";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import CircularProgress from "@material-ui/core/CircularProgress";
import PostComp from "./PostComp";
import {DataStore} from "@aws-amplify/datastore";
import {Post} from "../models";
import UserPool from "../AWS/CognitoConfig";
import {Typography} from "@material-ui/core";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModalNew: false,
      posts: [],
      loading: false,
      currentUser: props.userCount,
    }
  }

  componentDidMount() {
    this.setState({loading: true})

    DataStore.query(Post).then((posts) => {
      console.log("Posts retrieved successfully!", JSON.stringify(posts, null, 2));
      this.setState({loading: false, posts})
    }).catch((err) => {
      console.log("Error retrieving posts", err);
      this.setState({loading: false})
    });

    DataStore.observe(Post).subscribe(msg => {
      if(msg.opType === "Create") {
        this.addPost(msg.element)
      }
    });
  }

  handleModalNewOpen = () => {
    this.setState({openModalNew: true});
  };

  handleModalNewClose = () => {
    this.setState({openModalNew: false});
  };

  logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    UserPool.getCurrentUser().signOut();
    this.props.reloadPage();
    this.props.logout();
  }

  addPost = (newPost) => {
    this.setState((state) => {
      return {posts: [...state.posts, newPost]};
    })
  }

  listenNewPosts = () => {

  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline/>
        <Typography variant={"h6"}> {"Online: " + this.state.currentUser} </Typography>
        <div className="right">
          <Button variant="contained" color="secondary" onClick={this.logout}> Logout</Button>
        </div>
        {this.state.loading ?
          <CircularProgress size={100} style={{position: "relative", left: "50%", right: "50%"}}/>
          :
          <>
            {this.state.posts.map((post, id) => {
              return (<PostComp data={post} key={id}/>);
            })}
          </>
        }
        <div className="right">
          <FloatingActionButton icon={<AddIcon/>} callback={this.handleModalNewOpen}/>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.openModalNew}
            onClose={this.handleModalNewClose}
          >
            <NewPost callback={this.addPost} close={this.handleModalNewClose}/>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
