import React, { useState, useContext, useEffect } from "react";
import logo from "./static/HelpingHands.png";
import { useNavigate, NavLink } from "react-router-dom";
import UsernameContext from "./UsernameContext";
import Modal from 'react-modal';


export const Login = ({ setUsername }) => {
    const navigate = useNavigate();
    const [nutzername, setNutzername] = useState("");
    const [passwort, setPasswort] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [benutzer, setBenutzer] = useState([]);

    const handleLogin = (e) => {
      e.preventDefault();
      setUsername(nutzername);
      const matchingBenutzer = benutzer.find(
        (benutzer) =>
          benutzer.nutzername === nutzername && benutzer.passwort === passwort
      );
      if (matchingBenutzer) {
        setShowPopup(false);
        navigate("/hilfsanzeigen");
      } else {
        setShowPopup(true);
      }
    };
  
    useEffect(() => {
      fetch("http://localhost:3000/benutzer")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setBenutzer(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, []);
  
    return (
      <div className="login-page">
        <div className="logo-picture">
          <img className="logo" src={logo} alt="Logo" />
        </div>
        <p className="logo-description">
          <h2>Anmelden</h2>
        </p>
  
        <form className="login-form">
          <label htmlFor="nutzername">Nutzername</label>
          <input
            value={nutzername}
            onChange={(e) => setNutzername(e.target.value)}
            type="text"
            placeholder="Benutzername"
            id="nutzername"
            name="nutzername"
          />
          <label htmlFor="passwort">Passwort</label>
          <input
            value={passwort}
            onChange={(e) => setPasswort(e.target.value)}
            type="password"
            placeholder="Passwort"
            id="passwort"
            name="passwort"
          />
  
          <button onClick={handleLogin}>
            Anmelden
          </button>
        </form>
        {showPopup && (
          <Modal
            isOpen={true}
            onRequestClose={() => setShowPopup(false)}
            style={{
              content: {
                width: "300px",
                height: "200px",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              },
            }}
          >
            <h2>Benutzername oder Passwort ist inkorrekt</h2>
          </Modal>
        )}
        <button className="link-btn">
          <NavLink to="/Registrierung">
            Noch kein Konto?
            <br></br>Jetzt registrieren
          </NavLink>
        </button>
      </div>
    );
  };

export default Login;