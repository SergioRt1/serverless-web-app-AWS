import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import {Link} from "react-router-dom";
import brain from '../static/icon.png';
import CircularProgress from "@material-ui/core/CircularProgress";
import UserPool from "../AWS/CognitoConfig";
import './../styles/Login.css';
import Utils from '../utils/congito'
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {email: "", password: "", errorMessage: "", loading: false};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({loading: true});
    const user = new CognitoUser({
      Username: Utils.toUsername(this.state.email),
      Pool: UserPool
    })
    const auth = new AuthenticationDetails({
      Username: this.state.email,
      Password: this.state.password,
    })
    user.authenticateUser(auth, {
      onSuccess: data => {
        localStorage.setItem('isLoggedIn', "true");
        localStorage.setItem('username', this.state.email);
        this.props.reloadPage();
      },
      onFailure: err => {
        this.setState({email: "", password: "", errorMessage: err.message, loading: false});
        console.error("onFailure:", err);
      },
      newPasswordRequired: data => {
        console.log("newPasswordRequired:", data);
      }
    })
  }

  render() {
    return (
      <React.Fragment>

        <CssBaseline/>
        <main className="layout">
          <Paper elevation={5} className="paper">
            <Typography variant="h4">
              Socially
            </Typography>
            <img src={brain} alt="logo" className="img"/>
            <Typography color="error" gutterBottom>{this.state.errorMessage}</Typography>
            <form className="form" onSubmit={this.handleSubmit}>
              <TextField required label="Email" fullWidth
                         onChange={event => this.setState({email: event.target.value})}/>
              <TextField required label="Password" type="password" fullWidth
                         onChange={event => this.setState({password: event.target.value})}/>
              <br/><br/>
              <Button type="submit" color="primary" variant="contained" fullWidth disabled={this.state.loading}>
                Login
              </Button>
            </form>
            <br/>
            <Link to={"/sing-in"}>Create account</Link>
            {this.state.loading && <CircularProgress style={{marginTop: "4%"}}/>}
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

export default Login;
