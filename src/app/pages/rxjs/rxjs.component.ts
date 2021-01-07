import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html'
})
export class RxjsComponent implements OnInit {

  constructor() {

    const obs$ = new Observable( observer =>{

      setInterval( ()=>{
        console.log('tick');
      },1000 );
    })

    obs$.subscribe();

   }

  ngOnInit(): void {
  }

}
