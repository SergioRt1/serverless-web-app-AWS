import React from 'react';
import './App.css';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import Login from "./components/Login";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import SingUp from "./components/SingUp";
import HomePage from "./components/HomePage";

const theme = createMuiTheme({
  palette: {
    common: {black: "#000", white: "#fff"},
    background: {
      paper: "rgb(234,208,141)",
      default: "#fae5c0"
    },
    primary: {
      light: "rgb(132,85,67)",
      main: "rgb(186,72,10)",
      dark: "rgb(198,57,44)",
      contrastText: "#fff"
    },
    secondary: {
      light: "#f75d42",
      main: "#ff8400",
      dark: "#d22203",
      contrastText: "#fff"
    }
  }
});


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: localStorage.getItem('isLoggedIn')
    };
    this.reloadPage = this.reloadPage.bind(this);
  }

  reloadPage = () => {
    this.setState({isLoggedIn: localStorage.getItem('isLoggedIn')})
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        {this.state.isLoggedIn === 'true' ?
          <BrowserRouter>
            <Switch>
              <Route exact path="/" render={() => <HomePage reloadPage={this.reloadPage}/>}/>
            </Switch>
          </BrowserRouter>
          : <BrowserRouter>
            <Switch>
              <Route exact path="/" render={() => <Login reloadPage={this.reloadPage}/>}/>
              <Route exact path="/sing-in" render={() => <SingUp/>}/>
            </Switch>
          </BrowserRouter>
        }
      </MuiThemeProvider>
    );
  }
}

export default App;
