import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';
import jwtDecode from "jwt-decode";

const LoginButton = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "53370007102-gasokudqj0tb0s3kup5l7ak0uroehrl8.apps.googleusercontent.com",
      callback: (res) => setUser(jwtDecode(res.credential))
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      {theme: "outline", size:"large"}
    )
  }, []);
  return <>
    <div id="buttonDiv" hidden={!!user.name}/>
    {user.name && <><div>Hello {user.name}!</div><button onClick={() => setUser({})}>Log out</button></>}
  </>
}


function App() {
  const [text, setText] = useState("");
  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(json => setText(json.text));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <LoginButton/>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {text}
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
