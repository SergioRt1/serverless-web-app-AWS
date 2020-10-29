import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import FloatingActionButton from "./FloatingActionButton";
import Modal from "@material-ui/core/Modal";
import NewPost from "./NewPost";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import CircularProgress from "@material-ui/core/CircularProgress";
import Post from "./Post";
import Dynamo from '../AWS/DynamoConfig'

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModalNew: false,
      posts: [],
      loading: false,
    }
    this.postsDB = new Dynamo('SociallyPosts', this.consumePosts);
    this.usersDB = new Dynamo('SociallyUsers', this.consumeUsers())
  }

  consumePosts = (err, result) => {
    console.log("Posts", err, result);
  }
  consumeUsers = (err, result) => {
    console.log("users", err, result);
  }

  componentDidMount() {
    this.setState({loading: true})
    this.postsDB.getInitialRecords((err, result) => {
      let state = {};
      if (err) {
        console.error(err);
      } else {
        state = {posts: result.Items};
      }
      this.setState({loading: false, ...state})
      this.postsDB.subscribe();
    })

  }

  handleModalNewOpen = () => {
    this.setState({openModalNew: true});
  };

  handleModalNewClose = () => {
    this.setState({openModalNew: false});
  };

  logout = (e) => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    this.props.reloadPage()
  }

  addPost = (newPost) => {
    this.postsDB.recordItem(newPost).then(()=>{
      console.log("Item saved ok!!")
    }).catch((err) => {
      console.log("Error saving item :( ", err)
    });
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
        <div className="right">
          <Button variant="contained" color="secondary"> Logout</Button>
        </div>
        {this.state.loading ?
          <CircularProgress size={100} style={{position: "relative", left: "50%", right: "50%"}}/>
          :
          <>
            {this.state.posts.map((post, id) => {
              return (<Post data={post} key={id}/>);
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
