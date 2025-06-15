import React, { useEffect, useState } from "react";


export const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setFetchError("No se encontró token en sessionStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setFetchError(`Error en la petición: ${response.status} ${response.statusText}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUserData(data);
        setFormData({
          nombre: data.nombre || "",
          apellidos: data.apellidos || "",
          direccion_envio: data.direccion_envio || "",
          dni: data.dni || "",
          telefono: data.telefono || "",
        });
        setLoading(false);
      } catch (error) {
        setFetchError(`Error en la conexión: ${error.message}`);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Error al actualizar: " + (error.msg || "desconocido"));
        return;
      }

      const updated = await response.json();
      setUserData((prev) => ({ ...prev, ...formData }));
      setIsEditing(false);
      setUpdateSuccess("Datos actualizados correctamente.");
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (error) {
      alert("Error en la conexión: " + error.message);
    }
  };

  if (loading)
    return (
      <div style={styles.loading}>
        Cargando perfil...
      </div>
    );

  if (fetchError)
    return (
      <div style={styles.error}>
        {fetchError}
      </div>
    );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Perfil de usuario</h2>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Datos personales</h3>
          <ProfileRow label="Usuario" value={userData.usuario} />
          {isEditing ? (
            <>
              <EditableRow name="nombre" value={formData.nombre} onChange={handleInputChange} />
              <EditableRow name="apellidos" value={formData.apellidos} onChange={handleInputChange} />
            </>
          ) : (
            <>
              <ProfileRow label="Nombre" value={userData.nombre} />
              <ProfileRow label="Apellidos" value={userData.apellidos} />
            </>
          )}
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Dirección y contacto</h3>
          {isEditing ? (
            <>
              <EditableRow name="direccion_envio" value={formData.direccion_envio} onChange={handleInputChange} />
              <EditableRow name="dni" value={formData.dni} onChange={handleInputChange} />
              <EditableRow name="telefono" value={formData.telefono} onChange={handleInputChange} />
            </>
          ) : (
            <>
              <ProfileRow label="Dirección de envío" value={userData.direccion_envio} />
              <ProfileRow label="DNI" value={userData.dni} />
              <ProfileRow label="Teléfono" value={userData.telefono} />
            </>
          )}
          <ProfileRow label="Email" value={userData.email} />
        </section>

        {updateSuccess && (
          <div style={{ color: "lightgreen", textAlign: "center", marginBottom: 10 }}>
            {updateSuccess}
          </div>
        )}

        <div style={styles.buttonsContainer}>
          {isEditing ? (
            <>
              <button style={styles.button} onClick={handleSaveChanges}>
                Guardar cambios
              </button>
              <button
                style={styles.button}
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    nombre: userData.nombre || "",
                    apellidos: userData.apellidos || "",
                    direccion_envio: userData.direccion_envio || "",
                    dni: userData.dni || "",
                    telefono: userData.telefono || "",
                  });
                }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button style={styles.button} onClick={() => setIsEditing(true)}>
                Editar perfil
              </button>
              <button style={styles.button} onClick={() => alert("Cambiar contraseña pulsado")}>
                Cambiar contraseña
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div style={styles.row}>
    <span style={{ fontWeight: "600" }}>{label}:</span>
    <span>{value}</span>
  </div>
);

const EditableRow = ({ name, value, onChange }) => (
  <div style={styles.row}>
    <span style={{ fontWeight: "600", marginRight: 10 }}>{name[0].toUpperCase() + name.slice(1)}:</span>
    <input
      name={name}
      value={value}
      onChange={onChange}
      style={{
        flex: 1,
        padding: "6px 10px",
        border: "1px solid rgba(59,255,231,0.6)",
        borderRadius: "6px",
        backgroundColor: "#0a1320",
        color: "rgb(59,255,231)",
        fontSize: "1rem",
      }}
    />
  </div>
);

const styles = {
  page: {
    backgroundColor: "white",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "rgb(10,19,31)",
    border: "1px solid rgb(59,255,231)",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "700px",
    width: "100%",
    color: "rgb(59,255,231)",
    boxShadow: "0 0 15px rgba(59,255,231,0.3)",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2rem",
  },
  section: {
    marginBottom: "30px",
  },
  sectionTitle: {
    borderBottom: "1px solid rgb(59,255,231)",
    paddingBottom: "6px",
    marginBottom: "20px",
    fontSize: "1.3rem",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid rgba(59,255,231,0.3)",
    fontSize: "1.1rem",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  },
  button: {
    backgroundColor: "rgb(59,255,231)",
    color: "rgb(10,19,31)",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  loading: {
    backgroundColor: "white",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgb(59,255,231)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "1.2rem",
  },
  error: {
    backgroundColor: "white",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "red",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "1.2rem",
    padding: 20,
    textAlign: "center",
  },
};
