import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { delay } from 'rxjs/operators';

import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[]=[];
  public usuariosTemp: Usuario[]=[];
  public desde: number = 0;
  public cargando : boolean = true;
  public imgSubs: Subscription

  constructor( private usuarioService : UsuarioService,
               private busquedaService: BusquedasService,
               private modalImagenService: ModalImagenService
    ) { }
  
  

  ngOnInit(): void {
    this.cargarUsuarios();
    
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(1000)
    )
    .subscribe(img=>{this.cargarUsuarios()})
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
        .subscribe(({ total, usuarios }) =>{
          this.totalUsuarios = total;
          this.usuarios = usuarios
          this.usuariosTemp = usuarios
          this.cargando = false;
        })
  }

  cambiarPagina(valor: number){
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    }else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor; 
    }
    this.cargarUsuarios();
  }

  buscar(termino: string){
    if (termino === '') {
      return this.usuarios = this.usuariosTemp
    }

    this.busquedaService.buscar('usuarios', termino)
        .subscribe(resp=>{
          this.usuarios = resp
        })
  }

  eliminarUsuario( usuario: Usuario ){
    console.log(this.usuarioService.usuario)
    console.log(usuario)
    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error','No puede borrar el usuario loggeado','error')
    }

    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borralo!'
    }).then((result) => {
      if (result.value) {

        this.usuarioService.eliminarUsuario(usuario)
            .subscribe(resp=>{
              this.cargarUsuarios();
              Swal.fire('Usuario Borrado',
               `${usuario.nombre} fue borrado correctamente`
              )
            })
      }
    })
  }

  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario)
        .subscribe(resp=>{

        })
  }

  abrirModal(usuario: Usuario){
    
    this.modalImagenService.abrirModal('usuarios',usuario.uid, usuario.img)
  }

  ngOnDestroy(): void {
   this.imgSubs.unsubscribe(); 
  }
}
