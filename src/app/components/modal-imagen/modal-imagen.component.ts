import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit {

  public imagenSubida: File
  public imgTemp: any

  constructor( public modalImagenService: ModalImagenService,
                private fileUploadService: FileUploadService
    ) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imgTemp = null
    this.modalImagenService.cerrarModal()
  }

  cambiarImagen(file: File){
    this.imagenSubida = file

    if (!file) { return this.imgTemp = null }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = ()=>{
      this.imgTemp = reader.result
    }

  }

  subirImagen(){
    const tipo = this.modalImagenService.tipo
    const id = this.modalImagenService.id

    this.fileUploadService.actualizarFoto( this.imagenSubida,tipo,id )
    .then(img=>{
      this.modalImagenService.nuevaImagen.emit(img)
      Swal.fire('Guardado','Cambios fueron guardados','success')
      this.cerrarModal();
    }).catch(err=>{
      Swal.fire('Error',err.error.msg,'error')

    })
  }

}
