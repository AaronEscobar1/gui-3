import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Notifier from './components/Notifier';
import Camera from './components/Camera'

class App extends Component {

  constructor(){
    super();
    this.state = {
      offline: false
    }
  }

  componentDidMount() {
    window.addEventListener('online', () => {
      this.setState({ offline: false });
    })
    window.addEventListener('offline', () => {
      this.setState({ offline: true });
    })
  }

  componentDidUpdate() {
    let offlineStatus = !navigator.onLine;
    if (this.state.offline !== offlineStatus) {
      this.setState({ offline: offlineStatus})
    }
  }

  render(){
    return (
      <div className="App">
        <Notifier 
          offline={this.state.offline}
        />
        <Camera offline={this.state.offline} />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}


export default App;
