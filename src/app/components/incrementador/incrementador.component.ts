import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styleUrls: ['./incrementador.component.css']
})
export class IncrementadorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input('valor') progreso : number = 50
  @Output() valorNuevo: EventEmitter<number> = new EventEmitter();

  @Input() btnClass : string = 'btn btn-danger';

  cambiarValor(valor: number){
    if (this.progreso >= 100 && valor>=0 ) {
      this.valorNuevo.emit(100)
      return this.progreso = 100
    }

    if (this.progreso <= 0 && valor<=0 ) {
      this.valorNuevo.emit(0)
      return this.progreso = 0
    }
    
    this.valorNuevo.emit(this.progreso + valor )
    return this.progreso = this.progreso + valor 

  }

  onChange(nuevoValor : number){
    if (nuevoValor >=100) {
      this.progreso = 100;
    } else if( nuevoValor <= 0) {
      this.progreso = 0;
    }else{
      this.progreso = nuevoValor
    }
    this.valorNuevo.emit(this.progreso)
  }

}
