import React, { useEffect, useState} from 'react'
import Navigation from "./Navigation";
import logo from "./static/HelpingHands.png";

const AngeboteneHilfe = () => {

    const [nutzername, setNutzername] = useState([]);
    const [angebote, setAngebote] = useState([]);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setNutzername(storedUsername);
        }
    }, [setNutzername]);

    useEffect(() => {
        fetch('http://localhost:3000/angebot')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setAngebote(data);

            }).catch((err) => {
            console.log(err.message);
        });
    }, []);

    return (
            <div>
                <Navigation />
                <div className="logo-container">
                    <div className="logo-picture">
                        <img className="logo" src={logo}/>
                    </div>
                    <p className="logo-description">
                        Überblick über deine angebotene Hilfe
                    </p>
                </div>
                <ol className="hilfsanzeigen">
                    {
                        angebote && angebote.map ((angebot, index)=> {
                            if (angebot.nutzername === nutzername) {
                                return (
                                    <div className="hilfen">
                                        <div className="card">
                                            <li className="list-entry" data-id="$ID$">
                                                <div className="stadt titel">
                                                    {angebot.titel}
                                                </div>
                                            </li>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </ol>
            </div>
    )
}

export default AngeboteneHilfe;