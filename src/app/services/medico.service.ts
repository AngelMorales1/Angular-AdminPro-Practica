import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';


const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient ) { }

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

  cargarMedicos(){
    const url = `${baseUrl}/medicos`;
    return this.http.get(url, this.headers)
                .pipe(
                  map( (resp:{ ok:boolean, medicos:Medico[] })=> resp.medicos ) 
                )
                
  } 

  getMedicoById(id:string){
    const url = `${baseUrl}/medicos/${id}`;
    return this.http.get(url, this.headers)
                .pipe(
                  map( (resp:{ ok:boolean, medico:Medico })=> resp.medico ) 
                )
                
  } 

  crearMedico(medico:{nombre: string , hospital:string}){
    const url = `${baseUrl}/medicos`;
    return this.http.post(url,medico, this.headers)            
  } 

  actualizarMedico(medico: Medico){
    const url = `${baseUrl}/medicos/${medico._id}`;
    return this.http.put(url,medico,this.headers);
  }

  deleteMedico(_id : string){
    const url = `${baseUrl}/medicos/${_id}`;
    return this.http.delete(url, this.headers)            
  } 

}
