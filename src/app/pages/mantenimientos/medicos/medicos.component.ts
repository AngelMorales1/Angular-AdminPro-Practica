import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { Medico } from 'src/app/models/medico.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit {

  constructor(private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedaService : BusquedasService    ) { }

  public cargando: boolean= true
  public medicos: Medico[] = []
  private imgSubs : Subscription
  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img=>{this.cargarMedicos()})
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos',medico._id, medico.img)
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(medicos=>{
        this.cargando= false;
        this.medicos= medicos
        console.log(medicos)
      })
  }

  buscar(termino: string){
    if (termino === '') {
      return this.medicos = this.medicos
    }
    console.log(termino)
    this.busquedaService.buscar('medicos', termino)
        .subscribe(resp=>{
          this.medicos = resp
        })
  }

  borrarMedico(medico:Medico){
    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borralo!'
    }).then((result) => {
      if (result.value) {

        this.medicoService.deleteMedico(medico._id)
            .subscribe(resp=>{
              this.cargarMedicos();
              Swal.fire('Usuario Borrado',
               `${medico.nombre} fue borrado correctamente`
              )
            })
      }
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.imgSubs.unsubscribe()
  }

}
