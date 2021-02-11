import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { timeStamp } from 'console';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
declare const gapi: any

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public usuario: Usuario
  public auth2: any

  constructor(private usuarioService: UsuarioService,
              private router : Router,
              private ngZone : NgZone
    ) {
      this.googleInit()
      this.usuario = usuarioService.usuario
  }

  googleInit(){
    gapi.load('auth2', ()=>{
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '321613928029-e6ufuipulu1kj3qovngo93hekim5m6jt.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
    
    });
  }

  logout(){
    this.usuarioService.logout()
    this.auth2.signOut().then(() =>{
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login')

      })
    });
    
  }
}
