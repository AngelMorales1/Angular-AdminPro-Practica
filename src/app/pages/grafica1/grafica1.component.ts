import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public Labels : Label[] = ['Ventas por descarga', 'Ventas fisicas', 'Ventas por mail'];
  public  Data : MultiDataSet = [
    [300, 500, 10]
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
