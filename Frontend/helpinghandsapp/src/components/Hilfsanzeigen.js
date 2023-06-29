import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";
import logo from "./static/HelpingHandsWhite.png";
import Modal from "react-modal";

const CloseButton = ({ onClick }) => (
    <button
        style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "bold",
            color: "red",
        }}
        onClick={onClick}
    >
        &times;
    </button>
);

const Hilfsanzeigen = () => {
    const [helps, setHelps] = useState([]);
    const [nutzername, setNutzername] = useState([]);
    const [titel, setTitel] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [selectedStandort, setSelectedStandort] = useState("");
    const [selectedKategorie, setSelectedKategorie] = useState("");
    const [noResults, setNoResults] = useState(false); // Zustand für die Anzeige der Nachricht

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3000/hilfsanzeige")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setHelps(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setNutzername(storedUsername);
        }
    }, [setNutzername]);

    const handleHelps = async (currentTitle, ersteller, standort) => {
        const response = await fetch("http://localhost:3000/angebot", {
            method: "POST",
            body: JSON.stringify({
                titel: currentTitle,
                nutzername: nutzername,
                ersteller: ersteller,
                standort: standort,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })//.then((res) => console.log(res));
    };

    const deleteHelps = async (id) => {
        await fetch(`http://localhost:3000/hilfsanzeige/${id}`, { method: "DELETE" });
    };

    const handleHelprequest = (titel, ersteller, standort, id) => {
        setTitel(titel);
        const matchingBenutzer = helps.find(
            (help) => help.nutzername === nutzername && help.titel === titel
        );
        if (matchingBenutzer) {
            setShowPopup(true);
        } else {
            setShowPopup(false);
            handleHelps(titel, ersteller, standort);
            deleteHelps(id);
            navigate("/angebotene-hilfe");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        setNoResults(
            helps.length === 0 ||
            (selectedStandort && !helps.some((help) => help.standort === selectedStandort)) ||
            (selectedKategorie &&
                !helps.some((help) => help.kategorie === selectedKategorie))
        );
    }, [helps, selectedStandort, selectedKategorie]);

    return (
        <div className="hilfsanzeigen-page">
            <Navigation />
            <div className="logo-container">
                <div className="logo-picture">
                    <img className="logo" src={logo} alt="Helping Hands Logo" />
                </div>
                <p className="logo-description">Biete Hilfe in deiner Stadt</p>
            </div>
            <div className="search-container" onSubmit={handleSearch}>
                <form className="d-flex search" role="search">
                    <input
                        type="search"
                        className="form-control rounded"
                        placeholder="Standort"
                        aria-label="Suche"
                        aria-describedby="search-addon"
                        value={selectedStandort}
                        onChange={(e) => setSelectedStandort(e.target.value)}
                    />
                </form>
            </div>
            <div className="category-container">
                <select
                    className="form-select"
                    aria-label="Default select example"
                    value={selectedKategorie}
                    onChange={(e) => setSelectedKategorie(e.target.value)}
                >
                    <option value="">Alle Kategorien</option>
                    <option value="Garten">Garten</option>
                    <option value="Betreuung">Betreuung</option>
                    <option value="Tierpflege">Tierpflege</option>
                    <option value="Technik">Technik</option>
                    <option value="Handwerk">Handwerk</option>
                    <option value="Nachhilfe">Nachhilfe</option>
                    <option value="Transport">Transport</option>
                    <option value="Sonstiges">Sonstiges</option>
                </select>
            </div>
            <ol className="hilfsanzeigen">
                {noResults ? ( // Überprüfung, ob keine Ergebnisse gefunden wurden
                    <div className="no-hilfsanzeigen">
                        <p>Keine Hilfsanzeigen gefunden.</p>
                    </div>
                ) : (
                    helps &&
                    helps.map((help, index) => {
                        if (
                            (help.standort === selectedStandort || !selectedStandort) &&
                            (help.kategorie === selectedKategorie ||
                                !selectedKategorie ||
                                selectedKategorie === "Alle Kategorien")
                        ) {
                            return (
                                <div className="hilfen" key={index}>
                                    <div className="card">
                                        <li className="list-entry" data-id={help._id}>
                                            <div className="stadt titel">
                                                {help.standort}: {help.titel}
                                            </div>
                                            <div className="beschreibung">{help.beschreibung}</div>
                                            <ul>
                                                <div>
                                                    <li>
                                                        <div className="standort">Standort:</div>
                                                        <div className="place">{help.standort}</div>
                                                    </li>
                                                    <li>
                                                        <div className="zeitpunkt">Zeitpunkt:</div>
                                                        {help.zeitraum}
                                                    </li>
                                                    <li>
                                                        <div className="kategorie">Kategorie:</div>
                                                        <div className="category">{help.kategorie} </div>
                                                    </li>
                                                </div>
                                                <div className="actions">
                                                    <div
                                                        className="action edit"
                                                        onClick={() =>
                                                            handleHelprequest(
                                                                help.titel,
                                                                help.nutzername,
                                                                help.standort,
                                                                help._id
                                                            )
                                                        }
                                                    >
                                                        <button
                                                            className="anfrage"
                                                            onClick={() =>
                                                                handleHelprequest(help.titel, help.nutzername, help.standort, help._id)
                                                            }
                                                        >
                                                            ✉️
                                                            <br />
                                                            Ich kann helfen
                                                        </button>
                                                    </div>
                                                </div>
                                            </ul>
                                        </li>
                                    </div>
                                </div>
                            );
                        } else {
                            return null; // Kein else-Block notwendig, um die Nachricht nur einmal anzuzeigen
                        }
                    })
                )}
            </ol>
            {showPopup && (
                <Modal
                    isOpen={true}
                    onRequestClose={() => setShowPopup(false)}
                    shouldCloseOnOverlayClick={false}
                    style={{
                        content: {
                            width: "300px",
                            height: "400px",
                            margin: "auto",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "red",
                            border: "2px solid red",
                        },
                        overlay: {
                            background: "rgba(0, 0, 0, 0.5)",
                        },
                    }}
                >
                    <CloseButton onClick={() => setShowPopup(false)} />
                    <h2>Diese Hilfsanzeige wurde von dir selbst erstellt.</h2>
                </Modal>
            )}
        </div>
    );
};

export default Hilfsanzeigen;
