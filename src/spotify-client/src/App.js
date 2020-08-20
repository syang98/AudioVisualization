import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './App.css';

class App extends Component{
  constructor() {
    super();
    this.state = {
      access_token: Cookies.get('access_token'), 
      refresh_token: Cookies.get('refresh_token')
    }
  }



  
  render() { return (
      <div className="App">
        <a href='http://localhost:8888/login'>
          <button>Login to Spotify</button>
        </a> 
        <h1>
          Refresh Token: {this.state.refresh_token}
        </h1>
      </div>
    );
  }
}

export default App;
