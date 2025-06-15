import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import CardHome from "../components/CardHome.jsx";

// 🔁 BannerCarousel se define FUERA del componente Home
function BannerCarousel() {
	const banners = [
		{
			id: 1,
			title: "Sorteos destacados",
			description: "Jamón 5Jotas, Nintendo Switch y un Crucero de ensueño. ¡Participa ya!",
			background:
				"https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=1350&q=80",
		},
		{
			id: 2,
			title: "Futuras rifas",
			description:
				"Prepárate para rifas increíbles: Viaje a París, Consola PS5 y una TV 4K Smart. ¡No te las pierdas!",
			background:
				"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80",
		},
		{
			id: 3,
			title: "Juego responsable",
			description:
				"Recuerda siempre jugar con responsabilidad. ¡Disfruta y apuesta con cabeza!",
			background:
				"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80",
		},
	];

	const [current, setCurrent] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % banners.length);
		}, 8000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div style={{ width: "100vw", height: "300px", overflow: "hidden", position: "relative" }}>
			{banners.map((banner, index) => (
				<div
					key={banner.id}
					style={{
						position: "absolute",
						top: 0,
						left: `${(index - current) * 100}%`,
						width: "100%",
						height: "100%",
						backgroundImage: `url(${banner.background})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						transition: "left 0.5s ease-in-out",
						color: "white",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
						padding: "0 2rem",
						boxSizing: "border-box",
					}}
				>
					<h2 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{banner.title}</h2>
					<p style={{ fontSize: "1.2rem", maxWidth: "600px", textAlign: "center" }}>
						{banner.description}
					</p>
				</div>
			))}
		</div>
	);
}

// 🏠 Componente principal Home
export const Home = () => {
	const { store, dispatch } = useGlobalReducer();
	const [rifas, setRifas] = useState([]);

	useEffect(() => {
		getRifas();
	}, []);

	async function getRifas() {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/rifas/`
			);
			if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
			const data = await response.json();
			setRifas(data);
		} catch (error) {
			console.error("Error al obtener las rifas:", error);
		}
	}

	return (
		<>
			<BannerCarousel />
			<div className="container" style={{ maxWidth: "1000px" }}>
				<h1 className="mt-3">Rifas</h1>
				<p className="mt-3 mb-3"><strong>Prueba suerte con nuestras <span style={{color:'RGB(59,255,231)' }}>rifas</span></strong></p>
				<div className="d-flex flex-wrap justify-content-center gap-4 mt-3">
					{rifas.map((rifa) => (
						<div key={rifa.id} style={{ flex: "0 0 auto", width: "300px" }}>
							<CardHome
								premio={rifa.premio_rifa}
								fecha={rifa.fecha_de_sorteo}
								url={rifa.url_premio}
								dispatch={dispatch}
							/>
						</div>
					))}
				</div>
			</div>
		</>
	);
};