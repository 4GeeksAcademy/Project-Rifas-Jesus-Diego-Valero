import "../index.css";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"
import React from 'react';

const CardHome = ({ premio, fecha, url }) => {

    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const handleClick = () => {
        if (store.isLogged) {
            navigate("/Register");
        } else {
            navigate("/Login");
        }
    };

    return (
        <div
            className="card-home"
            style={{
                backgroundColor: "#0A131F",
                border: "4px solid #000000", // borde negro más grueso
                borderRadius: "20px",
                overflow: "hidden",
                width: "100%",
                maxWidth: "320px",
                marginBottom: "30px",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.7)", // sombra más fuerte desde el inicio
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
                cursor: "pointer",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.06)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.9)"; // sombra aún más intensa
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.7)";
            }}
        >
            <div style={{ width: "100%", height: "180px", overflow: "hidden" }}>
                <img
                    src={url}
                    alt="Sorteo"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                />
            </div>

            <div style={{ padding: "20px", color: "#FFFFFF" }}>
                <h5 style={{ color: "#3BFFE7", fontWeight: "bold", marginBottom: "15px" }}>
                    ¡Participa y gana!
                </h5>
                <p style={{ margin: 0 }}>
                    <strong>Premio:</strong> {premio}
                </p>
                <p style={{ margin: "5px 0 15px 0" }}>
                    <strong>Fecha:</strong> {fecha}
                </p>
                <button
                    onClick={handleClick}
                    style={{
                        backgroundColor: "#3BFFE7",
                        color: "#000000",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        width: "100%",
                        transition: "background 0.3s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2fd8c3"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3BFFE7"}
                >
                    Comprar
                </button>
            </div>
        </div>
    );
};

export default CardHome;
