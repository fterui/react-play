import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';

const LoginButton = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(json => setUser(json));
  }, []);

  const [google, setGoogle] = useState();
  useEffect(() => {
    const src = "https://accounts.google.com/gsi/client";
    if (document.querySelector(`script[src="${src}"]`)) {
      // no need to load the script again
      if (window.google) {
        setGoogle(window.google);
      }
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.async = true;
    script.onload = () => setGoogle(window.google);
    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    if (!google) {
      // not yet loaded
      return;
    }
    google.accounts.id.initialize({
      client_id: "53370007102-gasokudqj0tb0s3kup5l7ak0uroehrl8.apps.googleusercontent.com",
      login_uri: `${window.location.protocol}//${window.location.host}/auth/login`,
      ux_mode: "redirect"
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      {theme: "outline", size:"large"}
    );
  }, [google]);
  return <>
    <div id="buttonDiv" hidden={!user || !!user?.name}/>
    {user?.name && <><div>Hello {user.name}!</div><button onClick={() => window.location.href="/auth/logout"}>Log out</button></>}
  </>
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LoginButton/>
        <img src={logo} className="App-logo" alt="logo" />
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
