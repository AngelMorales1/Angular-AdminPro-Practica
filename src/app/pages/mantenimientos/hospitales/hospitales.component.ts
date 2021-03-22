import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit {

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService : BusquedasService
    ) { }

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = []
  public cargando: boolean = true;
  public imgSubs: Subscription
  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img=>{this.cargarHospitales()})
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
        .subscribe( hospitales =>{
          this.cargando = false;
          this.hospitales = hospitales;
          this.hospitalesTemp = hospitales
        })
  }

  guardarCambios(hospital: Hospital){
    this.hospitalService.actualizarHospital(hospital._id,hospital.nombre).subscribe(resp=>{
      Swal.fire('Actualizado',hospital.nombre,'success')
    })
  }

  borrarHospital(hospital:Hospital){
    this.hospitalService.deleteHospital(hospital._id).subscribe(resp=>{
      Swal.fire('Hospital',hospital.nombre,'success')
    })
  }

  async abrirSweetAlert(){
    const {value= ''} = await Swal.fire<string>({
      title:'Crear hospital',
      text:'Ingrese el nombre del hospital',
      input: 'text',
      showCancelButton: true,
      inputPlaceholder: 'Nombre del hospital'
    })
    if (value.trim().length >0) {
      this.hospitalService.crearHospital(value).subscribe((resp:any)=>{
        this.hospitales.push(resp.hospital)
      })
    }
  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales',hospital._id, hospital.img)
  }

  buscar(termino: string){
    if (termino === '') {
      return this.hospitales = this.hospitalesTemp
    }
    console.log(termino)
    this.busquedaService.buscar('hospitales', termino)
        .subscribe(resp=>{
          this.hospitales = resp
        })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.imgSubs.unsubscribe()
    
  }

}
