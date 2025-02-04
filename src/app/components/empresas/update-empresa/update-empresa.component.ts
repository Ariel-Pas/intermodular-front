import { Component, computed, inject, input, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategoria, IEmpresaCompleta, IRegion, ITown } from '../../../types';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ButtonMainComponent } from '../../button-main/button-main.component';
import IEmpresasService from '../../../services/IEmpresasService';
import { ILocalizacionService } from '../../../services/localizacion/ILocalizacionService';
import { ICategoriaService } from '../../../services/categorias/ICategoriasService';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  checkboxValidation,
  fileInputTodoImagenes,
  validarHoraInicioPrecedeFin,
} from '../../FormValidation/FormValidationsFn';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { leerImagenBase64 } from '../../FuncionesGenerales';


@Component({
  selector: 'update-empresa',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    KeyValuePipe,
    SweetAlert2Module,
    ButtonMainComponent,
  ],
  templateUrl: './update-empresa.component.html',
  styleUrl: './update-empresa.component.scss',
})
export class UpdateEmpresaComponent {
  private route = inject(ActivatedRoute);
  public id = input.required<string>();

  public empresa!: IEmpresaCompleta;

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.empresa = data['empresa'];
    });
  }

  private empresasService = inject(IEmpresasService);
  private localizacionesService = inject(ILocalizacionService);
  private categoriasService = inject(ICategoriaService);
  private router = inject(Router);

  alert = viewChild.required(SwalComponent);

  private provinciasRx = rxResource({
    loader: () => this.localizacionesService.getRegiones(),
  });

  public provincias = computed(() => this.provinciasRx.value() ?? []);

  //categorias y servicios

  private categoriasRx = rxResource({
    loader: () => this.categoriasService.getCategorias(),
  });

  public categorias = computed(() => this.categoriasRx.value() ?? []);

  private serviciosRx = rxResource({
    loader: () => this.categoriasService.getAllServicios(),
  });

  public servicios = computed(() => this.serviciosRx.value() ?? []);

  //Form reactivo
  form = new FormGroup({
    nombre: new FormControl(
      '',
      [Validators.required, Validators.minLength(5)],
      this.nombreEmpresaDisponible.bind(this)
    ),
    email: new FormControl('', [Validators.required, Validators.email]),
    descripcion: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    cif: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z][0-9]{8}$/),
    ]),
    vacantes: new FormControl(1, [Validators.min(1), Validators.required]),
    imagen: new FormControl('', [fileInputTodoImagenes('imagen')]),
    direccion: new FormGroup({
      provincia: new FormControl<IRegion | null>(null, [Validators.required]),
      localidad: new FormControl<ITown | null>(null, [Validators.required]),
      calle: new FormControl('', [Validators.required]),
      coordX: new FormControl(0),
      coordY: new FormControl(0),
    }),
    horarios: new FormGroup(
      {
        horarioManana: new FormControl<string | null>(null, [
          Validators.required,
        ]),
        horarioTarde: new FormControl<string | null>(null, [
          Validators.required,
        ]),
        finSemana: new FormControl(false),
      },
      [
        validarHoraInicioPrecedeFin({
          campoInicio: 'horarioManana',
          campoFin: 'horarioTarde',
        }),
      ]
    ),
    categorizacion: new FormGroup({
      categoria: new FormControl<ICategoria | null>(null, [
        Validators.required,
      ]),
      servicios: new FormRecord({}, [checkboxValidation({ min: 1 })]),
    }),
  });

  //cambiar localidades al cambiar provincia
  localidades$ =
    this.form.controls.direccion.controls.provincia.valueChanges.pipe(
      switchMap((provincia) =>
        provincia
          ? this.localizacionesService.getPoblaciones(provincia.id)
          : of([])
      )
    );

  //Funciones validación
  nombreEmpresaDisponible(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (control.value === '' || control.value === null) return of(null);

    return this.empresasService.getByName(control.value).pipe(
      map((x) => ({ 'nombre-disponible': true })),
      catchError(() => of(null))
    );
  }

  cifEmpresaDisponible(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (control.value === '' || control.value === null) return of(null);
    //buscar la empresa por cif. si el id es igual al de la empresa de la respuesta ok. sino fallo
    return this.empresasService.buscarPorCif(control.value).pipe(
      map((x) => ({
         'cif-disponible': true
        })),
      catchError(() => of(null))
    );
  }



  //función que determina si un servicio se debe ver o no
  ocultarServicio(servicio: string) {
    //comprobar si el nombre del servicio está asociado a la categoria seleccionada del form
    const infoServicio = this.servicios().find((x) => x.name == servicio);
    if (!infoServicio) return true;
    //comparar la categoria del servicio encontrado con el valor seleccionado
    //para saber si hay que esconderlo o no
    let esconder =
      infoServicio.category !=
      this.form.controls.categorizacion.controls.categoria.value?.id;

    return esconder;
  }

  leerImagen(event : Event){
    if(event.target instanceof HTMLInputElement){
      /* const preview = document.getElementById("img-preview") as HTMLImageElement;
      preview.src = ''; */
      const fileList = event.target.files;
      if(fileList && fileList.length == 1){
        if (!fileList[0].type.startsWith("image/")) {
          return;
        }
        this.form.controls.imagen.setValue(fileList[0].type.split('/')[1], {emitModelToViewChange: false});
        const reader = new FileReader();

        new Promise((resolve, reject) =>{
          reader.readAsDataURL(fileList[0]);
          reader.onload = ()=> resolve(reader.result)
        }).then(url => {
          let imageUrl = url as string;
          //preview.src = imageUrl;
          this.form.controls.imagen.setValue(imageUrl, {emitModelToViewChange: false});
        })

      }

    }
  }

  onSubmit() {}
}
