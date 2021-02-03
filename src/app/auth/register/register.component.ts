import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 
  private formSubmitted : boolean = false

  public registerForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    terminos: [ false, Validators.required]
  },{
    validators: this.passwordsIguales('password','password2')
  })

  constructor( private fb: FormBuilder,
               private usuarioService : UsuarioService,
               private router: Router
    ) { }

  ngOnInit(): void {
  }

  crearUsuario(){
    this.formSubmitted = true
    
    if (this.registerForm.valid) {
      this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(resp=>{
        this.router.navigateByUrl('/')
      },(err)=>{
        Swal.fire('Error', err.error.msg,'error')
      })
    }else{
      console.log(2)
    }
  }

  campoNoValido(campo: string): boolean {

    if (this.registerForm.get(campo).invalid && this.formSubmitted ) {
      return true
    }else{
      return false
    }
  }

  contrasenasNoValidas(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if (pass1 === pass2) {
      return false;
    }else{
      return true
    }
  }

  passwordsIguales(password: string, password2: string){
    return ( formGroup: FormGroup )=>{
      const pass1 = formGroup.get(password)
      const pass2 = formGroup.get(password2)

      if (pass1.value === pass2.value) {
        pass2.setErrors(null)
      }else{
        pass2.setErrors({noEsIgual:true})
      }

    }
  }

  terminosValido(){
    return !this.registerForm.get('terminos').value && this.formSubmitted
  }


}
