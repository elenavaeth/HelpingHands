import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';

const Konto = () => {
    const [benutzer, setBenutzer] = useState([]);
    const [nutzername, setNutzername] = useState([]);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setNutzername(storedUsername);
        }
    }, [setNutzername]);

    useEffect(() => {
        fetch('http://localhost:3000/benutzer')
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
        <div>
            <Navigation />
            {benutzer &&
                benutzer.map((benutzer, index) => {
                    if (benutzer.nutzername === nutzername) {
                        return (
                            <div className="container" key={index}>
                                <div className="header">
                                    <h1>Mein Konto</h1>
                                </div>
                                <div className="box-container">
                                    <div className="box Vorname">
                                        <strong>Vorname:</strong> {benutzer.vorname}
                                    </div>
                                    <div className="box Nachname">
                                        <strong>Nachname:</strong> {benutzer.nachname}
                                    </div>
                                </div>
                                <div className="box-container">
                                    <div className="box Straße">
                                        <strong>Straße:</strong> {benutzer.straße}
                                    </div>
                                    <div className="box Hausnummer">
                                        <strong>Hausnummer:</strong> {benutzer.hausnummer}
                                    </div>
                                </div>
                                <div className="box-container">
                                    <div className="box Postleitzahl">
                                        <strong>Postleitzahl:</strong> {benutzer.postleitzahl}
                                    </div>
                                    <div className="box Stadt">
                                        <strong>Stadt:</strong> {benutzer.stadt}
                                    </div>
                                </div>
                                <div className="box Email">
                                    <strong>Email:</strong> {benutzer.email}
                                </div>
                                <div className="box Telefon">
                                    <strong>Telefon:</strong> {benutzer.telefon}
                                </div>
                                <div className="box Nutzername">
                                    <strong>Nutzername:</strong> {benutzer.nutzername}
                                </div>
                            </div>
                        );
                    }
                })}
        </div>
    );
};

export default Konto;
