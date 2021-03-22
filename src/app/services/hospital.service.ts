import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers:{
        'x-token':this.token
      }
    }
  }

  cargarHospitales(desde : number = 0){
    const url = `${baseUrl}/hospitales`;
    return this.http.get(url, this.headers)
                .pipe(
                  map( (resp:{ ok:boolean, hospitales:Hospital[] })=> resp.hospitales ) 
                )
                
  } 

  crearHospital(nombre : string){
    const url = `${baseUrl}/hospitales`;
    return this.http.post(url,{nombre}, this.headers)            
  } 

  actualizarHospital(_id: string, nombre: string){
    const url = `${baseUrl}/hospitales/${_id}`;
    return this.http.put(url,{nombre},this.headers);
  }

  deleteHospital(_id : string){
    const url = `${baseUrl}/hospitales/${_id}`;
    return this.http.delete(url, this.headers)            
  } 
}
