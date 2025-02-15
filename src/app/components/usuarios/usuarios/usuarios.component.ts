import { Component, computed, inject, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthApiBetaService } from '../../../services/auth/auth-api-beta.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { UsuarioApiService } from '../../../services/usuarios/usuario-api.service';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink, SweetAlert2Module],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent{
  constructor(){}

  private authService = inject(AuthApiBetaService);
  public session = toSignal(this.authService.session$, {initialValue: null});
  private usuariosService = inject(UsuarioApiService);
  //private router = inject(Router);
  alert = viewChild.required(SwalComponent);


  protected usuariosResource = rxResource({
    loader: () => this.usuariosService.getUsuarios()
  });

  protected usuarios = computed(() => this.usuariosResource.value() ?? []);

  deleteUser(id : string): void {
    this.alert().fire().then((result) => {
      if(result.isConfirmed){
        this.usuariosService.eliminarUsuario(id).subscribe({
          next: () => {
            this.usuariosResource.reload();
            Swal.fire('Operacion exitosa!', 'Usuario eliminado correctamente', 'success')
          },
          error: (err) => {
            console.error('Error eliminando usuario', err);
            Swal.fire('Operacion fallida!', 'Ha ocurrido un error al eliminar el usuario', 'error');
          }
        });
      }
    });

  }


}
