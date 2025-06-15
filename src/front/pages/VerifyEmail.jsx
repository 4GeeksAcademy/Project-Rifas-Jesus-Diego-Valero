import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const token = searchParams.get("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL
		if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/verify-email?token=${token}`);
        if (!res.ok) throw new Error("Token inválido o expirado");
        const data = await res.json();
        console.log(data.message);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    if (token) verify();
    else setStatus("error");
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <h1 style={{ color: "rgb(59,255,231)", marginBottom: "20px" }}>
              ⏳ Verificando tu email...
            </h1>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
              Estamos comprobando la validez del enlace. Por favor, espera un momento.
            </p>
          </>
        );
      case "success":
        return (
          <>
            <h1 style={{ color: "rgb(59,255,231)", marginBottom: "20px" }}>
              ✅ ¡Email verificado con éxito!
            </h1>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
              Gracias por confirmar tu dirección de correo. Ya puedes acceder a todos los servicios de <strong>4Boleeks</strong>.
            </p>
          </>
        );
      case "error":
      default:
        return (
          <>
            <h1 style={{ color: "rgb(255,99,99)", marginBottom: "20px" }}>
              ❌ Error al verificar tu email
            </h1>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
              El enlace de verificación no es válido o ha expirado. Por favor, solicita uno nuevo desde tu cuenta.
            </p>
          </>
        );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgb(10,19,31)",
          color: "white",
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 0 15px rgba(0,0,0,0.2)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          textAlign: "center",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};
