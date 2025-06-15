import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        usuario: "",
        nombre: "",
        apellidos: "",
        direccion_envio: "",
        dni: "",
        telefono: "",
        email: "",
        contraseña: "",
        confirmar_contraseña: "",
    });

    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.contraseña !== formData.confirmar_contraseña) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario: formData.usuario,
                    nombre: formData.nombre,
                    apellidos: formData.apellidos,
                    direccion_envio: formData.direccion_envio,
                    dni: formData.dni,
                    telefono: formData.telefono,
                    email: formData.email,
                    contraseña: formData.contraseña,
                }),
            });

            if (response.ok) {
                setShowModal(true);
                // No hacemos navegación automática ni cierre automático del modal
            } else {
                const data = await response.json();
                setError(data.msg || "Error al registrarse.");
            }
        } catch (err) {
            console.error("Error en el registro:", err);
            setError("Hubo un error al conectar con el servidor.");
        }
    };

    return (
        <div style={{
            backgroundColor: "white",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 20px"
        }}>
            <form onSubmit={handleSubmit} style={{
                backgroundColor: "rgb(10,19,31)",
                border: "1px solid rgb(59,255,231)",
                padding: "40px",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "700px",
                boxShadow: "0 0 15px rgba(59,255,231,0.3)",
                color: "rgb(59,255,231)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
                <h2 style={{
                    fontSize: "2rem",
                    marginBottom: "30px",
                    textAlign: "center"
                }}>Registro</h2>

                {/* Sección: Datos personales */}
                <h3 style={{
                    fontSize: "1.2rem",
                    marginBottom: "15px",
                    borderBottom: "1px solid rgb(59,255,231)",
                    paddingBottom: "5px"
                }}>Datos personales</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    {renderInput("usuario", "Usuario", "text", formData, handleChange)}
                    {renderInput("nombre", "Nombre", "text", formData, handleChange)}
                    {renderInput("apellidos", "Apellidos", "text", formData, handleChange)}
                </div>

                {/* Sección: Dirección y contacto */}
                <h3 style={{
                    fontSize: "1.2rem",
                    margin: "30px 0 15px",
                    borderBottom: "1px solid rgb(59,255,231)",
                    paddingBottom: "5px"
                }}>Dirección y contacto</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    {renderInput("direccion_envio", "Dirección de envío", "text", formData, handleChange)}
                    {renderInput("dni", "DNI", "text", formData, handleChange)}
                    {renderInput("telefono", "Teléfono", "tel", formData, handleChange)}
                    {renderInput("email", "Email", "email", formData, handleChange)}
                </div>

                {/* Sección: Credenciales */}
                <h3 style={{
                    fontSize: "1.2rem",
                    margin: "30px 0 15px",
                    borderBottom: "1px solid rgb(59,255,231)",
                    paddingBottom: "5px"
                }}>Credenciales de acceso</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    {renderInput("contraseña", "Contraseña", "password", formData, handleChange)}
                    {renderInput("confirmar_contraseña", "Confirmar contraseña", "password", formData, handleChange)}
                </div>

                {/* Error */}
                {error && <div style={{
                    color: "red",
                    marginTop: "20px",
                    textAlign: "center",
                    fontWeight: "bold"
                }}>{error}</div>}

                {/* Botón */}
                <button type="submit" style={{
                    width: "100%",
                    backgroundColor: "rgb(59,255,231)",
                    color: "rgb(10,19,31)",
                    border: "none",
                    padding: "12px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    marginTop: "30px",
                    cursor: "pointer"
                }}>
                    Registrarse
                </button>

                {/* Link */}
                <p style={{ marginTop: "20px", textAlign: "center", fontSize: "0.9rem" }}>
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" style={{
                        color: "rgb(59,255,231)",
                        fontWeight: "bold",
                        textDecoration: "underline"
                    }}>
                        Inicia sesión
                    </Link>
                </p>
            </form>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "rgb(10,19,31)",
                        color: "rgb(59,255,231)",
                        border: "2px solid rgb(59,255,231)",
                        borderRadius: "12px",
                        padding: "30px 40px",
                        textAlign: "center",
                        boxShadow: "0 0 20px rgba(59,255,231,0.4)",
                        transform: "scale(1)",
                        transition: "transform 0.4s ease",
                        animation: "fadeIn 0.5s ease-out"
                    }}>
                        <h2 style={{ marginBottom: "10px" }}>🎉 Usuario creado correctamente</h2>
                        <p style={{ marginBottom: "20px" }}>Dirígete a <strong>Acceder</strong> para iniciar sesión.</p>
                        <button
                            onClick={() => {
                                setShowModal(false);
                                navigate("/login");
                            }}
                            style={{
                                backgroundColor: "rgb(59,255,231)",
                                color: "rgb(10,19,31)",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "6px",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            Ir a Acceder
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Render de campos de entrada
const renderInput = (name, label, type, formData, handleChange) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor={name} style={{ marginBottom: "6px", fontWeight: "600" }}>{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            required
            value={formData[name]}
            onChange={handleChange}
            placeholder={label}
            style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid rgb(59,255,231)",
                backgroundColor: "rgb(10,19,31)",
                color: "white",
                fontSize: "1rem",
                outlineColor: "rgb(59,255,231)"
            }}
        />
    </div>
);
