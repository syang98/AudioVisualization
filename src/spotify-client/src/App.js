import React, { Component } from 'react';
import Login from './components/Login'
import MusicInfo from './components/MusicInfo'
import Cookies from '../node_modules/js-cookie'

export default class App extends Component {
    constructor() {
        super();
        this.state = {
          access_token: Cookies.get('access_token'), 
          refresh_token: Cookies.get('refresh_token')
        }
    }

    display() {
        if (!this.state.access_token) {
            return <Login/>
        } else {
            return <MusicInfo/>
        }
    }
    
    render() {
        return (
            this.display()
        )
    }
}