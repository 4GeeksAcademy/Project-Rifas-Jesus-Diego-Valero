import { Link } from "react-router-dom";

export const Footer = () => {
	const footerStyle = {
		backgroundColor: 'rgb(10, 19, 31)',
		color: '#e0e0e0',       
		paddingTop: '3rem',
		paddingBottom: '1rem',
		marginTop: 'auto',
	};

	const titleStyle = {
		color: '#f5a623',     
		textTransform: 'uppercase',
		fontWeight: '700',
		marginBottom: '1rem',
	};

	const linkStyle = {
		color: '#e0e0e0',
		textDecoration: 'none',
	};

	const titleStyle4Boleeks = {
		color: 'rgb(59, 255, 231)', 
		textTransform: 'uppercase',
		fontWeight: '700',
		marginBottom: '1rem',
	};

	const titleStyleCyan = {
		color: 'rgb(59, 255, 231)',
		textTransform: 'uppercase',
		fontWeight: '700',
		marginBottom: '1rem',
	};

	return (
		<footer style={footerStyle}>
			<div className="container text-md-left">
				<div className="row text-md-left">

					<div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
						<h5 style={titleStyle4Boleeks}>4Boleeks</h5>
						<p>
							Participa en nuestras rifas 100% legales y seguras. ¡Tu suerte puede cambiar hoy!
						</p>
					</div>

					<div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
						<h5 style={titleStyleCyan}>Enlaces</h5>
						<p><Link to="/" style={linkStyle}>Inicio</Link></p>
						<p><a href="#" style={linkStyle}>Sorteos activos</a></p>
						<p><a href="#" style={linkStyle}>Cómo funciona</a></p>
						<p><a href="#" style={linkStyle}>FAQs</a></p>
					</div>

					<div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
						<h5 style={titleStyleCyan}>Contacto</h5>
						<p><i className="fas fa-home me-2"></i> Madrid, España</p>
						<p><i className="fas fa-envelope me-2"></i> Info4Boleeks@gmail.com</p>
						<p><i className="fas fa-phone me-2"></i> +123 456 789</p>
					</div>

					<div className="col-md-3 col-lg-4 col-xl-3 mx-auto mt-3">
						<h5 style={titleStyleCyan}>Síguenos</h5>
						<a href="#" style={linkStyle} className="me-3"><i className="fab fa-facebook fa-lg"></i></a>
						<a href="#" style={linkStyle} className="me-3"><i className="fab fa-instagram fa-lg"></i></a>
						<a href="#" style={linkStyle} className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
						<a href="#" style={linkStyle}><i className="fab fa-tiktok fa-lg"></i></a>
					</div>
				</div>

				<hr style={{ borderColor: '#444', marginBottom: '1rem' }} />

				<div className="row align-items-center">
					<div className="col-md-7 col-lg-8">
						<p>© 2025 Todos los derechos reservados | <strong>4Boleeks</strong></p>
					</div>
					<div className="col-md-5 col-lg-4">
						<p className="text-end">
							Legal | Términos y condiciones
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};
