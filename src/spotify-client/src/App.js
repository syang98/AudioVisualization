import React, { Component } from 'react';
import './App.css';

class App extends Component{
  constructor() {
    super();
    this.refresh_token = "Not logged in"
  }

  async componentDidMount() {
    
  }

  
  render() { return (
      <div className="App">
        <a href='http://localhost:8888/login'>
          <button>Login to Spotify</button>
        </a> 
        <h1>
          Refresh Token: {this.refresh}
        </h1>
      </div>
    );
  }
}

export default App;
