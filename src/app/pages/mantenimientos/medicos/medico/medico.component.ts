import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  public medicoSeleccionado: Medico
  public medicoForm: FormGroup;
  public hospitales: Hospital[]
  public hospitalSeleccionado: Hospital;

  constructor(private fb : FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.medicoForm = this.fb.group({
      nombre: ['Hernando', Validators.required],
      hospital: ['', Validators.required]
    })

    this.cargarHospitales()

    this.medicoForm.get('hospital').valueChanges.subscribe(hospital=>{
      this.hospitalSeleccionado = this.hospitales.find(h=> h._id === hospital)
    })
    this.obtenerMedico()
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales().subscribe( (hospitales:Hospital[])=>{
      this.hospitales = hospitales
    })
  }

  guardarMedico(){
    const { nombre} = this.medicoForm.value
    if (this.medicoSeleccionado) {
      // Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data).subscribe(resp=>{
        Swal.fire('Creado',`${nombre} Actualizado Correctamente`,'success')
      })
    } else {
      // Crear
      this.medicoService.crearMedico(this.medicoForm.value)
      .subscribe( (resp:any) =>{
        Swal.fire('Creado',`${nombre} Creado correctamente`,'success')
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
      })
    }
    
  }

  obtenerMedico(){
    this.activatedRoute.params.subscribe(resp=>{
      if (resp.id == 'nuevo') {
        return;
      }
      this.medicoService.getMedicoById(resp.id)
      .pipe(
        delay(100)
      )
      .subscribe(medico=>{
        if (!medico) {
          this.router.navigateByUrl(`/dashboard/medicos`)
        }
        const{nombre,hospital:{_id}} = medico
        this.medicoSeleccionado= medico
        this.medicoForm.setValue({nombre, hospital: _id})
      })
    })
    
  }

}
