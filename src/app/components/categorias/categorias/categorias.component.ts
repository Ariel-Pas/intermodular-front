import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CategoriasApiService } from '../../../services/categorias/categorias-api.service';
import { ServicioApiService } from '../../../services/servicios/servicio-api.service';
import Swal from 'sweetalert2';
import { rxResource } from '@angular/core/rxjs-interop';
import { ICategoriaBeta } from '../../../types';

@Component({
  selector: 'app-categorias',
  imports: [FormsModule, SweetAlert2Module],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {
  private categoriasService = inject(CategoriasApiService);
  private serviciosService = inject(ServicioApiService);
  alert = viewChild.required(SwalComponent);

  nuevaCategoria = signal<{
    nombre: string;
    serviciosSeleccionados: Set<string>;
  }>({
    nombre: '',
    serviciosSeleccionados: new Set()
  });

  protected categoriasResource = rxResource({
    loader: () => this.categoriasService.getCategoriasBeta()
  })

  protected categorias = computed(() => this.categoriasResource.value() ?? []);

  protected serviciosResource = rxResource({
    loader: () => this.serviciosService.getServicios()
  })

  protected servicios = computed(() => this.serviciosResource.value() ?? []);

  //MANEJO DE CHECKBOXES
  toggleServicio(id: string) {
    this.nuevaCategoria.update(current => {
      const nuevosServicios = new Set(current.serviciosSeleccionados);
      nuevosServicios.has(id) ? nuevosServicios.delete(id) : nuevosServicios.add(id);

      return {
        ...current,
        serviciosSeleccionados: nuevosServicios
      };
    });
  }

  //CREAR CATEGORIA
  crearCategoria() {
    const newCategoria: ICategoriaBeta = {
      nombre: this.nuevaCategoria().nombre,
      servicios: Array.from(this.nuevaCategoria().serviciosSeleccionados)
        .map(id => ({
          id,
          nombre: this.servicios().find(s => s.id === id)?.nombre || '',
          categorias: []
        }))
    };

    this.categoriasService.crearCategoria(newCategoria).subscribe({
      next: () => {
        this.categoriasResource.reload();
        this.nuevaCategoria.set({
          nombre: '', serviciosSeleccionados: new Set()
        });
        Swal.fire('Operacion exitosa!', 'Categoria creada exitosamente', 'success');
      },
      error: (err) => {
        Swal.fire('Error', err.error.message, 'error');
      }
    })
  }

  // ACTUALIZAR CATEGORIA
  actualizarCategoria(categoria: ICategoriaBeta) {
    const serviciosActualizados = categoria.servicios.map(s => ({
      id: s.id,
      nombre: this.servicios().find(serv => serv.id === s.id)?.nombre || s.nombre,
      categorias: []
    }));

    const updatedCategoria: ICategoriaBeta = {
      ...categoria,
      servicios: serviciosActualizados
    };

    if (!categoria.id) {
      Swal.fire('Error', 'ID de categoría no válido', 'error');
      return;
    }

    this.categoriasService.actualizarCategoria(categoria.id, updatedCategoria).subscribe({
      next: () => {
        Swal.fire('Éxito!', 'Categoría actualizada', 'success');
        this.categoriasResource.reload();
      },
      error: (err) => Swal.fire('Error', err.error.message, 'error')
    });
  }

  //ELIMINAR CATEGORIA
  eliminarCategoria(id: string | undefined) {
    this.alert().fire().then((result) => {
      if (result.isConfirmed) {
        if(id){
          this.categoriasService.eliminarCategoria(id).subscribe({
            next: () => {
              this.categoriasResource.reload();
              Swal.fire('Eliminada!', 'Categoría eliminada', 'success');
            },
            error: (err) => Swal.fire('Error', err.error.message, 'error')
          });
        }
      }
    });
  }


  toggleServicioEnCategoria(categoria: ICategoriaBeta, servicioId: string) {
    const index = categoria.servicios.findIndex(s => s.id === servicioId);

    if (index > -1) {
      //REMOVER SERVICIO
      categoria.servicios = categoria.servicios.filter(s => s.id !== servicioId);
    } else {
      // AGREGAR SERVICIO
      const servicio = this.servicios().find(s => s.id === servicioId);
      if (servicio) {
        categoria.servicios.push({
          id: servicio.id,
          nombre: servicio.nombre,
          categorias: []
        });
      }
    }
  }

  servicioEstaSeleccionado(categoria: ICategoriaBeta, servicioId: string): boolean {
    return categoria.servicios.some(s => s.id === servicioId);
  }
}
