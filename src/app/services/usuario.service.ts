import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from 'src/environments/environment';
import { tap,map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { promise } from 'protractor';

declare const gapi:any

const baseUrl = environment.baseUrl


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any ;

  constructor(private http: HttpClient,
              private router: Router,) { 
      this.googleInit();
  }

  validarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ baseUrl }/login/renew`,{
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp:any)=>{
        localStorage.setItem('token',resp.token);
      }),
      map(resp => true),
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

}
