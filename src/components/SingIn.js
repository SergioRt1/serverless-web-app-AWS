import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import user from "../static/user.png";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Redirect} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import CircularProgress from "@material-ui/core/CircularProgress";
import UserPool from "../AWS/CognitoConfig";
import {CognitoUserAttribute} from "amazon-cognito-identity-js";
import Utils from '../utils/congito'

class SingIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      doRedirect: false,
      errorMessage: "",
      loading: false
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.confirmPassword === this.state.password) {
      this.createUser();
    } else {
      this.setState({errorMessage: "The password and the confirmation do not make match"});
    }
  }

  createUser = () => {

    const attrEmail = new CognitoUserAttribute({
      Name: 'email',
      Value: this.state.email
    });
    UserPool.signUp(Utils.toUsername(this.state.email), this.state.password, [attrEmail], null, (err, data) => {
      if (err) {
        console.error(err);
        this.setState({errorMessage: err.message, loading: false});
      } else {
        console.log(data);
        this.setState({email: "", password: "", confirmPassword: "", doRedirect: true, loading: false});
      }
    });
  }

  clear = () => {
    this.setState({
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      loading: false
    })
  };

  render() {
    return (
      <React.Fragment>
        <CssBaseline/>
        <Paper elevation={5} className="paper">
          <Typography variant="h4">Sing in</Typography>
          <img src={user} alt="user" className="img"/>
          <Typography color="error" gutterBottom>{this.state.errorMessage}</Typography>
          <form className="form" onSubmit={this.handleSubmit}>
            <TextField required label="Email" fullWidth value={this.state.email}
                       onChange={event => this.setState({email: event.target.value})}/>
            <TextField required label="Password" type="password" fullWidth value={this.state.password}
                       onChange={event => this.setState({password: event.target.value})}/>
            <TextField required label="Confirm password" type="password" fullWidth value={this.state.confirmPassword}
                       onChange={event => this.setState({confirmPassword: event.target.value})}/>
            <br/><br/>
            <Button type="submit" color="primary" variant="contained" fullWidth disabled={this.state.loading}>
              Create account
            </Button>
            <br/><br/>
            <Button type="button" onClick={this.clear} color="primary" variant="contained" fullWidth
                    disabled={this.state.loading}>
              Clear
            </Button>
            {this.state.doRedirect && <Redirect to={"/"}/>}
          </form>
          {this.state.loading && <CircularProgress style={{marginTop: "4%"}}/>}
        </Paper>
      </React.Fragment>
    );
  }
}

export default SingIn;
