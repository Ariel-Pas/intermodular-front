import { Component, computed, inject, input, signal, viewChild } from '@angular/core';
import IEmpresasService from '../../../services/IEmpresasService';

import { ApiErrorMessage, ICategoria, IEmpresaCompleta, IServicio } from '../../../types';

import { SectionsUnderlineComponent } from '../../sections-underline/sections-underline.component';
import { ButtonMainComponent } from '../../button-main/button-main.component';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { IEmpresaDisplay, IPregunta } from '../../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { ITokenService } from '../../../services/token/ITokenService';
import { FormsModule } from '@angular/forms';
import { FormulariosApiService } from '../../../services/formularios/formularios-api.service';
import { forkJoin, of, switchMap } from 'rxjs';
import { GestionFiltradoEmpresasService } from '../../../services/gestion-filtrado-empresas.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ICategoriaService } from '../../../services/categorias/ICategoriasService';


interface CategoriasServicios {
  categoria :ICategoria,
  servicios : IServicio[]
}

@Component({
  selector: 'app-empresa',
  imports: [
    FormsModule,
    SectionsUnderlineComponent,
    ButtonMainComponent,
    MatTabContent,
    MatTabGroup,
    MatTab,
    ReactiveFormsModule,
    SweetAlert2Module,
  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss',
})
export class EmpresaComponent {
  constructor(private router: Router) {}
  private route = inject(ActivatedRoute);
  private navigator = inject(Router);
  private empresasService = inject(IEmpresasService);
  public id = input.required<string>();
  private gestionEmpresasService = inject(GestionFiltradoEmpresasService);

  alert = viewChild.required(SwalComponent);

  public empresa!: IEmpresaCompleta;

  ngOnInit(): void {
    //obtener datos del resolver
    this.route.data.pipe(
      switchMap((data)=>
        forkJoin({
          empresa: of(data['empresa'] as IEmpresaCompleta) ,
          categorias: this.categoriasService.getCategorias()
        })
      )

    ).subscribe((data) => {
      this.categorias.set(data.categorias)
      this.empresa = data['empresa'];
      this.urlEditarToken = `${window.origin}/company/update/${this.empresa.urlEditar}`;
      this.urlEditar = `/company/update/${this.empresa.id}`;

      this.formNotas.patchValue({ notas: this.empresa.notas });

      console.log(this.empresa.servicios);

      //inicializar array servicios y categorias
      this.empresa.servicios.forEach(serv => {
        serv.categories?.forEach(catId => {

          //buscar si la categoría está ya en el array
          const catEnArray = this.categoriasYServicios.find(c => c.categoria.id == catId)
          //si no está en el array se añade con el servicio
          if(!catEnArray){
            const categoriaCompleta = this.categorias().find(c => c.id == catId )
            console.log(categoriaCompleta);

            //añadir la categoria
            if(categoriaCompleta)
              this.categoriasYServicios.push({categoria: categoriaCompleta, servicios:[serv]})
          }
          else{
            //si ya está en el array se le añade el servicio
            catEnArray.servicios = [...catEnArray.servicios, serv]
          }
        })
      })
      console.log(this.categoriasYServicios);
    });
  }

  //Datos empresas mostrar
  protected urlEditar = '';
  protected urlEditarToken = '';

  formNotas = new FormGroup({
    notas: new FormControl(''),
  });

  actualizarNotas() {
    console.log(this.formNotas.controls.notas.value);
    this.empresasService
      .actualizarNota(
        this.empresa.id,
        this.formNotas.controls.notas.value ?? ''
      )
      .subscribe({
        next: () => {
          this.alert().title = 'Nota actualizada';
          this.alert().text = '';
          this.alert().icon = 'success';
          this.alert().fire();
        },
        error: (errorMsg: ApiErrorMessage) => {
          this.alert().title = 'Ha ocurrido un error';
          this.alert().text = 'No se ha podido guardar';
          this.alert().icon = 'error';
          this.alert().fire();
        },
      });
  }

  eliminarEmpresa(event: Event) {
    this.empresasService.eliminarEmpresa(this.empresa.id).subscribe({
      next: () => {
        this.alert().title = 'Empresa eliminada';
        this.alert().text = '';
        this.alert().icon = 'success';
        this.alert().fire();
        this.gestionEmpresasService.recargarEmpresas();
        this.navigator.navigate(['/dashboard']);
      },
      error: (errorMsg: ApiErrorMessage) => {
        this.alert().title = 'Ha ocurrido un error';
        this.alert().text = 'No se ha podido eliminar';
        this.alert().icon = 'error';
        this.alert().fire();
      },
    });
  }

  private categoriasService = inject(ICategoriaService);

  private categoriasRx = rxResource({
    loader: () => this.categoriasService.getCategorias(),
  });

  public categorias = signal<ICategoria[]>([]);

  //prepara categorias y servicios para visualizar

  protected categoriasYServicios : CategoriasServicios[] = [];

  // DEBORA
  private tokenService = inject(ITokenService);
  private formulariosService = inject(FormulariosApiService);

  protected formularioId!: number;
  protected centroId: number = 2;
  protected tokenIngresado: string = '';
  protected urlFormulario: string | null = null;
  protected preguntas: IPregunta[] = [];
  public empresaId = computed(() => this.id());

  crearToken(event: Event): void {
    event.preventDefault();

    const empresaId = this.empresaId();

    if (!empresaId) {
      console.error('El ID de la empresa aún no está disponible.');
      return;
    }

    if (this.formularioId) {
      console.log(
        'Generando token con:',
        this.formularioId,
        'para la empresa:',
        empresaId
      );

      this.tokenService
        .generarToken(Number(empresaId), this.formularioId, 2)
        .subscribe({
          next: (response) => {
            console.log('Token generado:', response);
            this.tokenIngresado = response.token; // era token
            console.log('Token asignado:', this.tokenIngresado); // Verifica si el token está asignado correctamente
          },
          error: (error) => console.error('Error al generar token:', error),
        });
    } else {
      console.error('Por favor, selecciona un formulario.');
    }
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement; // Asegura que event.target es un HTMLInputElement
    if (target) {
      this.tokenIngresado = target.value; // Asigna el valor al tokenIngresado
    }
  }

  buscarFormulario() {
    if (!this.tokenIngresado) {
      alert('Ingrese un token');
      return;
    }

    this.tokenService
      .buscarFormularioPorToken(this.tokenIngresado)
      .pipe(
        switchMap((response) => {
          if (response.formulario_id == null) {
            throw new Error('El formulario no tiene un ID válido.');
          }
          this.formularioId = response.formulario_id;
          return this.formulariosService.getPreguntas(
            this.formularioId.toString()
          );
        })
      )
      .subscribe({
        next: (preguntas) => {
          this.preguntas = preguntas;
          this.urlFormulario = `http://localhost:8000/api/mostrarFormulario/${this.formularioId}`;
          console.log('Preguntas obtenidas:', preguntas);
          this.router.navigate(['/formulario', this.formularioId], {
            queryParams: { empresaId: this.empresaId() },
          });
        },
        error: (error) => {
          console.error('Error al obtener las preguntas', error);
          alert('No se pudieron obtener las preguntas.');
        },
        complete: () => {
          console.log('Consulta de preguntas completada.');
        },
      });
  }
}
