import { Component, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UsuarioApiService } from '../../../services/usuarios/usuario-api.service';
import { IUsuario } from '../../../types';
import { AuthApiBetaService } from '../../../services/auth/auth-api-beta.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-usuario',
  imports: [ReactiveFormsModule, SweetAlert2Module],
  templateUrl: './create-usuario.component.html',
  styleUrl: './create-usuario.component.scss'
})
export class CreateUsuarioComponent {

  constructor(){}

  private authService = inject(AuthApiBetaService);
  public session = toSignal(this.authService.session$, {initialValue: null})
  private usuariosService = inject(UsuarioApiService);
  private router = inject(Router);
  alert = viewChild.required(SwalComponent);

  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    // centro_id : new FormControl(0,[Validators.required])
  })

  modelToData(): IUsuario{
    return{
      nombre: this.form.controls.nombre.value ?? '',
      apellidos: this.form.controls.apellidos.value ?? '',
      email: this.form.controls.email.value ?? '',
      password: this.form.controls.password.value ?? '',
      centro_id : this.session()?.centro_id ?? 1
    }
  }

  onSubmit() {
    console.log(this.modelToData())
    this.usuariosService.crearUsuario(this.modelToData()).subscribe({
      next: (u)=>{
        console.log(u);
        this.form.reset();
        this.alert().title = "Usuario creado correctamente";
        this.alert().text = '';
        this.alert().icon = "success";
        this.alert().fire();
        this.router.navigate(['/usuarios'])
      },
      error: ()=>{
        console.log('error');
        this.alert().title = "Ha ocurrido un error";
        this.alert().text = "No se ha podido crear el Usuario.";
        this.alert().icon = "error";
        this.alert().fire();
      }
    })
  }
}
