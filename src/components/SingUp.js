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
import {CognitoUser, CognitoUserAttribute} from "amazon-cognito-identity-js";
import CognitoUtils from '../utils/Congito'

class SingUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      doRedirect: false,
      errorMessage: "",
      code: "",
      loading: false,
      verify: false,
    };
  }

  handleCreate = (e) => {
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
    UserPool.signUp(CognitoUtils.toUsername(this.state.email), this.state.password, [attrEmail], null, (err, data) => {
      if (err) {
        console.error(err);
        this.setState({errorMessage: err.message, loading: false});
      } else {
        console.log(data);
        this.setState({email: "", password: "", confirmPassword: "", doRedirect: true, loading: false});
      }
    });
  }

  handleVerify = (e) => {
    e.preventDefault();
    CognitoUtils.getUser(this.state.email).confirmRegistration(this.state.code, true, (err, result) => {
      if (err) {
        console.error(err);
        this.setState({errorMessage: err.message, loading: false});
      } else {
        this.setState({loading: false, doRedirect: true})
      }
    })
    if (this.state.confirmPassword === this.state.password) {
      this.createUser();
    } else {
      this.setState({errorMessage: "The password and the confirmation do not make match"});
    }
  }

  clear = () => {
    this.setState({
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      code: "",
      loading: false,
      verify: false,
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
          {this.state.verify ?
            <form className="form" onSubmit={this.handleVerify}>
              <TextField required label="Email" fullWidth value={this.state.email}
                         onChange={event => this.setState({email: event.target.value})}/>
              <TextField required label="Code" fullWidth value={this.state.code}
                         onChange={event => this.setState({code: event.target.value})}/>
              <br/><br/>
              <Button type="submit" color="primary" variant="contained" fullWidth disabled={this.state.loading}>
                Verify
              </Button>
              <br/><br/>
              <Button type="button" onClick={this.clear} color="primary" variant="contained" fullWidth
                      disabled={this.state.loading}>
                Clear
              </Button>

            </form> :
            <form className="form" onSubmit={this.handleCreate}>
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
            </form>
          }
          {this.state.doRedirect && <Redirect to={"/"}/>}
          {this.state.loading && <CircularProgress style={{marginTop: "4%"}}/>}
        </Paper>
      </React.Fragment>
    );
  }
}

export default SingUp;
