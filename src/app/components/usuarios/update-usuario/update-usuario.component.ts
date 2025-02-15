import { Component, inject, OnInit, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AuthApiBetaService } from '../../../services/auth/auth-api-beta.service';
import { UsuarioApiService } from '../../../services/usuarios/usuario-api.service';
import { IUsuario } from '../../../types';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-usuario',
  imports: [ReactiveFormsModule, SweetAlert2Module],
  templateUrl: './update-usuario.component.html',
  styleUrl: './update-usuario.component.scss'
})
export class UpdateUsuarioComponent implements OnInit {

  constructor(private route: ActivatedRoute,) { }

  private authService = inject(AuthApiBetaService);
  public session = toSignal(this.authService.session$, { initialValue: null })
  private usuariosService = inject(UsuarioApiService);
  //private router = inject(Router);
  alert = viewChild.required(SwalComponent);

  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
    centro_id : new FormControl('')
  })

  usuarioId: string | null = null;
  usuarioActual : IUsuario | null = null;

  ngOnInit(): void {
    //ME TRAIGO EL ID DESDE LA RUTA
    this.usuarioId = this.route.snapshot.paramMap.get('id');

    if (this.usuarioId) {
      //CARGO LOS DATOS DEL USUARIO MEDIANTE getUsuario(usuarioId)
      this.usuariosService.getUsuario(this.usuarioId).subscribe({
        next: (usuario) => {
          // console.log('Usuario cargado:', usuario);
          this.usuarioActual = usuario;
          this.form.patchValue({
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            email: usuario.email,
            //ASIGNO EL id_centro QUE YA TENIA EL USER (SOLO MODIFICABLE EN BACKEND)
            centro_id: usuario.centro_id.toString(),
          });
        },
        error: (err) => console.error('Error al cargar usuario', err)
      });
    }
  }

  modelToData(): IUsuario {
    const usuarioActualizado: IUsuario = {
      nombre: this.form.controls.nombre.value ?? '',
      apellidos: this.form.controls.apellidos.value ?? '',
      email: this.form.controls.email.value ?? '',
      centro_id: this.usuarioActual?.centro_id ?? 1
    };

    //AGREGAR PASSWORD SOLO SI HAY UN VALOR NUEVO (IDEM BACKEND)
    const nuevaPassword = this.form.controls.password.value;
    if (nuevaPassword) {
      usuarioActualizado.password = nuevaPassword;
    }

    return usuarioActualizado;
  }

  onSubmit(): void {
    if (this.form.valid && this.usuarioId) {
      const usuarioActualizado = this.modelToData();
      //console.log('Datos enviados:', usuarioActualizado);
      this.usuariosService.actualizarUsuario(this.usuarioId, usuarioActualizado).subscribe({
        next: () => {
          Swal.fire('Operacion exitosa!', 'Usuario actualizado correctamente', 'success');
        },
        error: (err) => {
          console.error('Error al actualizar usuario', err);
          Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
        }
      });
    }
  }

}
