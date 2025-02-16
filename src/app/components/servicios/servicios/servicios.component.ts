import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { ServicioApiService } from '../../../services/servicios/servicio-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { IServicio, IServicioBeta } from '../../../types';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-servicios',
  imports: [SweetAlert2Module, FormsModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss'
})
export class ServiciosComponent {
  constructor() { }

  private serviciosService = inject(ServicioApiService);
  alert = viewChild.required(SwalComponent);
  nuevoServicio = signal('');

  private serviciosResource = rxResource({
    loader: () => this.serviciosService.getServicios()
  })

  protected servicios = computed(() => this.serviciosResource.value() ?? []);

  agregarServicio() {
    if (!this.nuevoServicio().trim()) return;

    this.serviciosService.crearServicio({ nombre: this.nuevoServicio() } as IServicioBeta)
      .subscribe({
        next: () => {
          this.serviciosResource.reload();
          this.nuevoServicio.set('');
          Swal.fire('Operacion exitosa!', 'Servicio creado correctamente', 'success');
        },
        error: (err) => {
          Swal.fire('Error', err.error.message || 'Error al crear servicio', 'error');
        }
      });
  }

  actualizarServicio(servicio: IServicioBeta) {
    this.serviciosService.actualizarServicio(servicio.id, servicio)
      .subscribe({
        next: () => {
          Swal.fire('Operacion exitosa!', 'Servicio actualizado correctamente', 'success');
        },
        error: (err) => {
          Swal.fire('Error', err.error.message || 'Error al actualizar el servicio', 'error');
        }
      });
  }

  eliminarServicio(id: string) {
    this.alert().fire().then((result) => {
      if (result.isConfirmed) {
        this.serviciosService.eliminarServicio(id).subscribe({
          next: () => {
            this.serviciosResource.reload();
            Swal.fire('Operacion exitosa!', 'Servicio eliminado correctamente', 'success');
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'Error al eliminar el servicio', 'error');
          }
        });
      }
    })
  }

}
