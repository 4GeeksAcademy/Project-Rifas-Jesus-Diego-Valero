import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export const Login = () => {
    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState("");
    const [userOrEmail, setUserOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Para restablecer contraseña:
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState(null);
    const [resetSuccess, setResetSuccess] = useState(null);

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        setShowPopup(true);
        setResetError(null);
        setResetSuccess(null);
        setEmail("");
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setEmail("");
        setResetError(null);
        setResetSuccess(null);
    };

    const handleResetPassword = async () => {
        setResetError(null);
        setResetSuccess(null);

        if (!email) {
            setResetError("Por favor, introduce un correo válido.");
            return;
        }

        setResetLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setResetError(data.message || "Error al enviar el correo de restablecimiento");
            } else {
                setResetSuccess(`Se ha enviado un correo a: ${email}. Revisa tu bandeja de entrada.`);
                setEmail("");
            }
        } catch (err) {
            setResetError("Error en la petición. Intenta más tarde.");
            console.error(err);
        } finally {
            setResetLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setUserData(null);
        setLoading(true);

        try {
            const body = {
                usuario: userOrEmail,
                email: userOrEmail,
                contraseña: password,
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Error en login");
                setLoading(false);
                return;
            }

            sessionStorage.setItem("token", data.token);

            const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            });

            const user = await userResponse.json();

            if (!userResponse.ok) {
                setError(user.message || "Error al obtener datos del usuario");
                setLoading(false);
                return;
            }

            setUserData(user);
            setError(null);

            // Redirigir a la página de perfil tras login exitoso
            navigate('/mi-perfil');
        } catch (err) {
            setError("Error en la petición");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                padding: "20px",
            }}
        >
            <form
                style={{
                    backgroundColor: "rgb(10,19,31)",
                    border: "1px solid rgb(59,255,231)",
                    borderRadius: "10px",
                    padding: "20px 40px",
                    maxWidth: "400px",
                    width: "100%",
                    boxShadow: "0 0 10px rgba(59,255,231,0.4)",
                    color: "rgb(59,255,231)",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
                onSubmit={handleLogin}
            >
                <h2
                    style={{
                        marginBottom: "25px",
                        textAlign: "center",
                        color: "rgb(59,255,231)",
                    }}
                >
                    Iniciar sesión
                </h2>

                <label htmlFor="user" style={{ display: "block", marginBottom: "8px" }}>
                    Usuario / Email
                </label>
                <input
                    id="user"
                    name="user"
                    type="text"
                    required
                    placeholder="Introduce tu usuario o email"
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "20px",
                        borderRadius: "5px",
                        border: "1px solid rgb(59,255,231)",
                        backgroundColor: "rgb(10,19,31)",
                        color: "rgb(59,255,231)",
                        fontSize: "1rem",
                    }}
                    value={userOrEmail}
                    onChange={(e) => setUserOrEmail(e.target.value)}
                />

                <label htmlFor="password" style={{ display: "block", marginBottom: "8px" }}>
                    Contraseña
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Introduce tu contraseña"
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "20px",
                        borderRadius: "5px",
                        border: "1px solid rgb(59,255,231)",
                        backgroundColor: "rgb(10,19,31)",
                        color: "rgb(59,255,231)",
                        fontSize: "1rem",
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: loading ? "gray" : "rgb(59,255,231)",
                        border: "none",
                        borderRadius: "5px",
                        color: "black",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = "rgb(20,210,190)";
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = "rgb(59,255,231)";
                    }}
                >
                    {loading ? "Accediendo..." : "Acceder"}
                </button>

                {error && (
                    <p
                        style={{
                            marginTop: "15px",
                            color: "red",
                            fontWeight: "700",
                            textAlign: "center",
                        }}
                    >
                        {error}
                    </p>
                )}

                {userData && (
                    <div
                        style={{
                            marginTop: "20px",
                            backgroundColor: "rgba(59,255,231,0.1)",
                            padding: "15px",
                            borderRadius: "8px",
                            color: "rgb(59,255,231)",
                            fontSize: "0.9rem",
                            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        }}
                    >
                        <h3>Datos del usuario:</h3>
                        <pre
                            style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                            }}
                        >
                            {JSON.stringify(userData, null, 2)}
                        </pre>
                    </div>
                )}

                <div
                    style={{
                        marginTop: "20px",
                        fontSize: "0.9rem",
                        textAlign: "center",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <p style={{ margin: 0 }}>
                        ¿Has olvidado tu contraseña?{" "}
                        <Link
                            to="/recuperar-password"
                            onClick={handleForgotPasswordClick}
                            style={{
                                color: "rgb(59,255,231)",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            Haz click aquí!
                        </Link>
                    </p>

                    <p style={{ margin: 0 }}>
                        ¿No estás registrado?{" "}
                        <Link
                            to="/register"
                            style={{
                                color: "rgb(59,255,231)",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            Haz click aquí!
                        </Link>
                    </p>
                </div>
            </form>

            {showPopup && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "rgb(10,19,31)",
                            border: "1px solid rgb(59,255,231)",
                            borderRadius: "10px",
                            padding: "30px",
                            maxWidth: "350px",
                            width: "90%",
                            textAlign: "center",
                            boxShadow: "0 0 15px rgba(59,255,231,0.6)",
                            color: "rgb(59,255,231)",
                            position: "relative",
                            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        }}
                    >
                        <h3 style={{ marginBottom: "20px", color: "rgb(59,255,231)" }}>
                            Restablecer Contraseña
                        </h3>
                        <p
                            style={{ fontSize: "1rem", lineHeight: "1.5", marginBottom: "15px" }}
                        >
                            Confirma tu correo electrónico para poder restablecer tu contraseña. Te
                            enviaremos un mensaje a este correo.
                        </p>

                        <input
                            type="email"
                            placeholder="Tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "5px",
                                border: "1px solid rgb(59,255,231)",
                                backgroundColor: "rgb(10,19,31)",
                                color: "rgb(59,255,231)",
                                fontSize: "1rem",
                            }}
                        />

                        {resetError && (
                            <p style={{ color: "red", marginBottom: "10px", fontWeight: "700" }}>
                                {resetError}
                            </p>
                        )}

                        {resetSuccess && (
                            <p style={{ color: "limegreen", marginBottom: "10px", fontWeight: "700" }}>
                                {resetSuccess}
                            </p>
                        )}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                            }}
                        >
                            <button
                                onClick={handleResetPassword}
                                disabled={resetLoading}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: resetLoading ? "gray" : "rgb(59,255,231)",
                                    border: "none",
                                    borderRadius: "5px",
                                    color: "black",
                                    fontWeight: "700",
                                    fontSize: "1rem",
                                    cursor: resetLoading ? "not-allowed" : "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (!resetLoading) e.currentTarget.style.backgroundColor = "rgb(20,210,190)";
                                }}
                                onMouseLeave={(e) => {
                                    if (!resetLoading) e.currentTarget.style.backgroundColor = "rgb(59,255,231)";
                                }}
                            >
                                {resetLoading ? "Enviando..." : "Enviar"}
                            </button>
                            <button
                                onClick={handleClosePopup}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "transparent",
                                    border: "1px solid rgb(59,255,231)",
                                    borderRadius: "5px",
                                    color: "rgb(59,255,231)",
                                    fontWeight: "700",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = "rgba(59,255,231,0.3)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = "transparent")
                                }
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
