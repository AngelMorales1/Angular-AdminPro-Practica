import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { tap,map, catchError } from 'rxjs/operators';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

declare const gapi:any

const baseUrl = environment.baseUrl


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any ;
  public usuario: Usuario

  constructor(private http: HttpClient,
              private router: Router,) { 
      this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string{
    return this.usuario.uid || '';
  }

  get headers(){
    return {
      headers:{
        'x-token':this.token
      }
    }
  }
  
  validarToken(): Observable<boolean>{
    return this.http.get(`${ baseUrl }/login/renew`,{
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp:any)=>{
        const { email, google, nombre,role,img='',_id } = resp.usuarioLogeado;

        this.usuario = new Usuario(nombre,email,'',img, google, role,_id);

        localStorage.setItem('token',resp.token);
        return true;
      }),
      catchError(error=> of(false))
    )

  }

  crearUsuario( formData: RegisterForm ){
    return this.http.post(`${baseUrl}/usuarios`,formData)
                .pipe(
                  tap((resp:any)=>{
                    localStorage.setItem('token',resp.token)
                  })
                  )
  }

  actualizarPerfil( data:{email: string, nombre: string, role: string } ){

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${baseUrl}/usuarios/${this.uid}`,data,this.headers)
  }


  login( formData: LoginForm ){
    return this.http.post(`${baseUrl}/login`,formData)
               .pipe(
                tap((resp:any)=>{
                  localStorage.setItem('token',resp.token)
                })

               )
  }

  googleInit(){
    return new Promise( resolve =>{
      gapi.load('auth2', ()=>{
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '321613928029-e6ufuipulu1kj3qovngo93hekim5m6jt.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });
        resolve();
      });
    })
    
  }

  loginGoogle( token ){
    return this.http.post(`${baseUrl}/login/google`,{token})
               .pipe(
                tap((resp:any)=>{
                  localStorage.setItem('token',resp.token)
                })
               )
  }
  
  logout(){
    this.auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    localStorage.removeItem('token');
  }

  cargarUsuarios(desde : number = 0){
    const url = `${baseUrl}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuarios>(url, this.headers)
                .pipe(
                  map(resp=>{
                    const usuarios = resp.usuarios.map(
                      user => new Usuario(user.nombre, user.email,'',user.img,user.google,user.role,user._id)
                    )
                    return {total: resp.total,
                            usuarios
                    }
                  })
                )
  }

  eliminarUsuario(usuario : Usuario){

    const url = `${baseUrl}/usuarios/${usuario.uid}`
    return this.http.delete(url, this.headers)
  }

  guardarUsuario( usuario:Usuario ){
    return this.http.put(`${baseUrl}/usuarios/${usuario.uid}`,usuario,this.headers)
  }

}
