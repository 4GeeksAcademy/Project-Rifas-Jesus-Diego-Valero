"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from jwt import ExpiredSignatureError, InvalidTokenError
from sqlalchemy import null, select
from api.models import db, Usuario, Vendedor, Rifas
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import traceback
import bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, decode_token
from flask_mail import Message
from api.extensions import mail
import os
from datetime import timedelta
from api.emails import send_email_verification, send_email_password_recovery,send_email_random_password, generar_clave


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


# Endpoint de Vendedor -Solo hacemos POST inicialmente
@api.route('/vendedor', methods=['POST'])
def add_vendedor():
    try:
        request_request_body = request.get_json(silent=True)
        # Validacion de request
        if request_request_body is None:
            return {"message": "Request request_body is empty"}, 400
        if "nombre" not in request_request_body or "email" not in request_request_body or "direccion" not in request_request_body or "telefono" not in request_request_body or "persona_contacto" not in request_request_body:
            return {"message": "Wrong request request_body"}, 400
        # Validación de la existencia de Vendedor
        vendedor = db.session.execute(select(Vendedor).where(
            Vendedor.nombre == request_request_body["nombre"])).scalar_one_or_none()
        if vendedor is not None:
            return {"message": "El vendedor ya existe"}, 400

        # Agregamos el vendedor a la tabla
        new_vendedor = Vendedor(nombre=request_request_body["nombre"], direccion=request_request_body["direccion"],
                                telefono=request_request_body["telefono"], email=request_request_body["email"], persona_contacto=request_request_body["persona_contacto"])
        db.session.add(new_vendedor)
        db.session.commit()
        return {"message": f"Vendedor añadido a la tabla de vendedores"}, 200

    except Exception as e:
        print("Error:", e)
        return {"message": f"Error: No se puede añadir vendedor a la tabla de vendedores. Fallo interno"}, 500


# Endpoint de Rifa - NECESITAMOS POST para CREAR, GET para LIST, PUT para actualizar (TBC, el sorteo probablemente lo hagamos desde el back
@api.route('/rifa', methods=['POST'])
def add_rifa():
    try:
        request_request_body = request.get_json(silent=True)
        # Validacion de request
        if request_request_body is None:
            return {"message": "Request request_body is empty"}, 400
        if "vendedor_id" not in request_request_body or "nombre_rifa" not in request_request_body or "fecha_de_sorteo" not in request_request_body or "hora_de_sorteo" not in request_request_body or "precio_boleto" not in request_request_body or "premio_rifa" not in request_request_body or "url_premio" not in request_request_body or "numero_max_boletos" not in request_request_body or "status_sorteo" not in request_request_body or "boleto_ganador" not in request_request_body:
            return {"message": "Wrong request request_body"}, 400
        # Validación de la existencia de Rifa
        rifa = db.session.execute(select(Rifas).where(
            Rifas.nombre_rifa == request_request_body["nombre_rifa"])).scalar_one_or_none()
        if rifa is not None:
            return {"message": "El vendedor ya existe"}, 400

        # Agregamos la rifa a la tabla
        new_rifa = Rifas(nombre_rifa=request_request_body["nombre_rifa"], vendedor_id=request_request_body["vendedor_id"], fecha_de_sorteo=request_request_body["fecha_de_sorteo"], hora_de_sorteo=request_request_body["hora_de_sorteo"], precio_boleto=request_request_body["precio_boleto"],
                         premio_rifa=request_request_body["premio_rifa"], url_premio=request_request_body["url_premio"], numero_max_boletos=request_request_body["numero_max_boletos"], status_sorteo=request_request_body["status_sorteo"], boleto_ganador=request_request_body["boleto_ganador"])
        db.session.add(new_rifa)
        db.session.commit()
        return {"message": f"Rifa añadida a la tabla de rifas"}, 200
    except Exception as e:
        print("Error:", e)
        return {"message": f"Error: No se puede añadir rifa a la tabla de rifas. Fallo interno"}, 500


@api.route('/rifas', methods=['GET'])
def get_rifas():
    try:
        all_rifas = db.session.execute(select(Rifas)).scalars().all()
        # Validacion
        if all_rifas == None:
            return {"message": "No se encuentran rifas"}, 404
        # Respuesta
        all_rifas = list(map(lambda x: x.serialize(), all_rifas))
        return jsonify(all_rifas), 200

    except Exception as e:
        print("Error:", e)
        return {"message": f"Error: No se pueden leer rifas. Fallo interno"}, 500

# Endpoint de Usuario


@api.route('/registro', methods=['POST'])
def add_usuario():
    try:
        request_body = request.get_json(silent=True)
        print(request_body)
        # Validación del request_body
        if request_body is None:
            return {"message": "El request_body está vacio"}, 400
        if "email" not in request_body or "usuario" not in request_body or "contraseña" not in request_body or "direccion_envio" not in request_body or "dni" not in request_body or "telefono" not in request_body or "nombre" not in request_body or "apellidos" not in request_body:
            return {"message": "Request body erroneo"}, 400
        # Validación de que el email o usuario no esté ya registrado
        user_email = db.session.execute(select(Usuario).where(
            Usuario.email == request_body["email"])).scalar_one_or_none()
        user_usuario = db.session.execute(select(Usuario).where(
            Usuario.usuario == request_body["usuario"])).scalar_one_or_none()
        if user_email != None or user_usuario != None:
            return {"message": "El usuario ya existe"}, 400

        # Password management
        # converting password to array of bytes
        bytes = request_body["contraseña"].encode('utf-8')
        # generating the salt
        salt = bcrypt.gensalt()
        # Hashing the password
        hash = bcrypt.hashpw(bytes, salt)
        print(hash)
        # Agregamos user: PENDING: generación de STRIPE ID
        new_user = Usuario(usuario=request_body["usuario"], email=request_body["email"], contraseña=hash.decode('utf-8'), nombre=request_body["nombre"], apellidos=request_body["apellidos"], direccion_envio=request_body["direccion_envio"], dni=request_body["dni"], telefono=request_body["telefono"], stripe_customer_id="0", status=True)
        db.session.add(new_user)
        db.session.commit()

        #Creación de token para registro de email
        expires = timedelta(hours=1)
        email_token = create_access_token(identity=new_user.email, expires_delta=expires)
        print(email_token)

        # Envio de correo para confirmación de email (PENDIENTE REVISAR SI VERIFICAMOS EMAIL)
        # send_email_verification(sender_email = 'info4boleeks@gmail.com', recipient_email = new_user.email, token = email_token)
        return {"message": "User created successfully, pending email confirmation"}, 200
    except Exception as e:
        print("Error :", e)
        traceback.print_exc()
        return {"message": "No se pudo añadir usuario"}, 404

# Email confirmation
@api.route('/verify-email', methods=['GET'])
def verify_email():
    token = request.args.get('token')

    if not token:
        return jsonify({"error": "Token no proporcionado"}), 400

    try:
        # Decodifica el token y verifica firma y expiración
        decoded = decode_token(token)
        email = decoded["sub"]  # identity se guarda en 'sub'

        # Comprobar que el email está en la base de datos y actualización de usuario
        user = db.session.execute(select(Usuario).where(Usuario.email == email)).scalar_one_or_none()
        if user != None:
            user = db.session.get(Usuario, email)
            user.status = True
            db.session.commit()
            

        # Aquí podrías verificar si el usuario existe y marcarlo como verificado
        return jsonify({"message": f"Token válido. Email: {email}"}), 200

    except ExpiredSignatureError:
        return jsonify({"error": "El token ha expirado"}), 401

    except InvalidTokenError:
        return jsonify({"error": "Token inválido"}), 401




# PUT de usuario
@api.route('/user/<int:usuario_id>', methods = ['PUT'])
@jwt_required()
def update_user_by_id(usuario_id):
    try:
        current_id = get_jwt_identity()
        request_body= request.get_json(silent = True)
        print(request_body)
        user = db.session.execute(select(Usuario).where(Usuario.id == current_id)).scalar_one_or_none()
        # Validación de people_id
        if user == None:
            return {"message" : f" El usuario ID {usuario_id} no pudo ser encontrado. "}, 404  
        # Validación del body
        if "email" not in request_body or "usuario" not in request_body or "direccion_envio" not in request_body or "dni" not in request_body or "telefono" not in request_body or "nombre" not in request_body or "apellidos" not in request_body:
            return {"message" : f"Wrong request"}, 400 
        # Update de la tabla
        updated_user = db.session.get(Usuario, usuario_id)
        updated_user.usuario = request_body["usuario"] 
        updated_user.nombre = request_body["nombre"]
        updated_user.apellidos = request_body["apellidos"]
        updated_user.direccion_envio = request_body["direccion_envio"]
        updated_user.dni = request_body["dni"]
        updated_user.telefono = request_body["telefono"]
        #update de contraseña
        # bytes = request_body["contraseña"].encode('utf-8')
        # salt = bcrypt.gensalt()
        # hash = bcrypt.hashpw(bytes, salt)
        # updated_user.contraseña = hash.decode('utf-8')
        db.session.commit()

        # Retornamos el usuario actualizado
        user = db.session.execute(select(Usuario).where(Usuario.id == usuario_id)).scalar_one_or_none()
        return user.serialize(),200

    except Exception as e:
        print("Error:", e)
        return {"message": "Error actualizando usuario"}, 500

# PUT de contraseña
@api.route('/new-password', methods = ['PUT'])
@jwt_required()
def update_password_by_id():
    try:
        current_id = get_jwt_identity()
        request_body= request.get_json(silent = True)
        user = db.session.execute(select(Usuario).where(Usuario.id == current_id)).scalar_one_or_none()
        # Validación de people_id
        if user == None:
            return {"message" : f" El usuario ID {current_id} no pudo ser encontrado. "}, 404  
        # Validación del body
        if "contraseña" not in request_body:
            return {"message" : f"Petición erronea"}, 400 
        # update de contraseña
        updated_user = db.session.get(Usuario, current_id)
        
        bytes = request_body["contraseña"].encode('utf-8')
        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(bytes, salt)
        updated_user.contraseña = hash.decode('utf-8')
        db.session.commit()

        # Retornamos el usuario actualizado
        user = db.session.execute(select(Usuario).where(Usuario.id == current_id)).scalar_one_or_none()
        return {"message": "contraseña actualizada"},200

    except Exception as e:
        print("Error:", e)
        return {"message": "Error actualizando usuario"}, 500

# Login Endpoint
@api.route("/login", methods=['POST'])
def login():
    try:
        email = request.json.get("email", None)
        usuario = request.json.get("usuario", None)
        password = request.json.get("contraseña", None)

        # Comprobamos que el usuario exista
        user_mail = db.session.execute(select(Usuario).where(
            Usuario.email == email)).scalar_one_or_none()
        user_usuario = db.session.execute(select(Usuario).where(
            Usuario.usuario == usuario)).scalar_one_or_none()

        if user_mail == None and user_usuario == None:
            return {"message": "User cannot be found"}, 401
        else:
            if user_mail != None:
                user = user_mail
            else:
                user = user_usuario
        if user.status == False:
            return {"message": "Cuenta inactiva. Verifique mail para activarla"}, 401
        # Chequeo de contraseña
        # encoding user password
        userBytes = password.encode('utf-8')
        user_pass = user.contraseña.encode('utf-8')
        # checking password
        result = bcrypt.checkpw(userBytes, user_pass)
        if (result):
            access_token = create_access_token(identity=str(user.id))
            return jsonify({"token": access_token, "user_id": user.id})
        else:
            return {"message": "Usuario, Email o contraseña erroneos"}, 400
    except:
        return {"message":"No se puede completar la operacion"}, 404
    

# GET de usuario 
@api.route("/user/", methods=["GET"])
@jwt_required()
def get_user_by_id():
    try:
        # Accede a la identidad del usuario actual con get_jwt_identity
        current_id = get_jwt_identity()
        user = db.session.execute(select(Usuario).where(Usuario.id == current_id)).scalar_one_or_none()
        # Validacion de user
        if (user != None):
            return user.serialize(), 200
        else:
            return {"message":"No access to secret message"}, 404
    
    except Exception as e:
        print("Error:", e)
        return {"message":"No se puede obtener el usuario"}, 500

# POST de recuperar contraseña
@api.route ('/reset-password', methods = ['POST'])
def reset_password():
    try:
        email = request.json.get("email", None)
        user = db.session.execute(select(Usuario).where(Usuario.email == email)).scalar_one_or_none()
        # validacion de mail 
        if user == None:
            return {"message": "User cannot be found"}, 401
        expire_password = timedelta(hours=1)
        print(user.serialize())
        password_token = create_access_token(identity=str(user.id), expires_delta=expire_password)
        print(password_token)
        send_email_password_recovery(sender_email = 'info4boleeks@gmail.com', recipient_email = user.email, token = password_token)
        return {"message":"Email enviado para resetear contraseña"}, 200

    except Exception as e:
        print("Error:", e)
        return {"message":"No se puede enviar mail para resetear password"}, 500

# POST de generar contraseña random
@api.route ('/generate-password', methods = ['POST'])
def generate_new_password():
    try:
        email = request.json.get("email", None)
        user = db.session.execute(select(Usuario).where(Usuario.email == email)).scalar_one_or_none()
        # validacion de mail 
        if user == None:
            return {"message": "User cannot be found"}, 401
        # Envio de email con password random
        new_password = generar_clave(10)
        print("El nuevo password es: " + new_password)
        send_email_random_password(sender_email = 'info4boleeks@gmail.com', recipient_email = user.email, password = new_password)

        # actualización de database
        updated_user = db.session.get(Usuario, user.id)
        bytes = new_password.encode('utf-8')
        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(bytes, salt)
        updated_user.contraseña = hash.decode('utf-8')
        db.session.commit()

        return {"message":"Email enviado para resetear contraseña"}, 200

    except Exception as e:
        print("Error:", e)
        return {"message":"No se puede enviar mail para resetear password"}, 500
    

    

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_request_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_request_body), 200
