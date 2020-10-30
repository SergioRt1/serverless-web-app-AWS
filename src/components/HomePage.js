import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import FloatingActionButton from "./FloatingActionButton";
import Modal from "@material-ui/core/Modal";
import NewPost from "./NewPost";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import CircularProgress from "@material-ui/core/CircularProgress";
import PostComp from "./PostComp";
import UserPool from "../AWS/CognitoConfig";
import {Typography} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModalNew: false,
      loading: false,
    }
  }

  componentDidMount() {
    this.setState({loading: true})
    this.props.loadData();
    this.setState({loading: false})
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

  render() {
    return (
      <React.Fragment>
        <CssBaseline/>
        <Typography
          variant={"h6"}> {"Online: " + this.props.userCount } </Typography>
        <div className="right">
          <Button variant="contained" color="secondary" onClick={this.logout}> Logout</Button>
        </div>
        {this.state.loading ?
          <CircularProgress size={100} style={{position: "relative", left: "50%", right: "50%"}}/>
          :
          <>
            {this.props.posts.map((post, id) => {
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
            <DialogContent>
              <NewPost close={this.handleModalNewClose}/>
            </DialogContent>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
