import React, { Component } from 'react';
import './App.css';

class Subject extends Component {
  render() {
    return (
      <head>
        <h1>WEB</h1>
        world wide web!
      </head>

    );
  }
}

function App() {
  return (
    <div className="App">
      <Subject></Subject>
      <header className="App-header">
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

export default App;
