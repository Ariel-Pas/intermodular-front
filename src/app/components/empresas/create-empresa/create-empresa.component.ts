import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { ILocalizacionService } from '../../../services/localizacion/ILocalizacionService';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApiErrorMessage,
  ICategoria,
  ICheckboxOption,
  IEmpresaDisplay,
  INewEmpresa,
  IRegion,
  IServicio,
  ITown,
} from '../../../types';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { ICategoriaService } from '../../../services/categorias/ICategoriasService';
import { catchError, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import {
  checkboxValidation,
  fileInputTodoImagenes,
  validarHoraInicioPrecedeFin,
} from '../../FormValidation/FormValidationsFn';

import IEmpresasService from '../../../services/IEmpresasService';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Router } from '@angular/router';
import { ButtonMainComponent } from "../../button-main/button-main.component";




@Component({
  selector: 'app-create-empresa',
  imports: [ReactiveFormsModule, AsyncPipe, KeyValuePipe, SweetAlert2Module, ButtonMainComponent],
  templateUrl: './create-empresa.component.html',
  styleUrl: './create-empresa.component.scss',
})
export class CreateEmpresaComponent {
  constructor() {
    //inicializar los valores del apartado servicios del form
    this.categoriasService.getAllServicios().subscribe({
      next: (x) => {
        x.forEach((element) => {
          this.form.controls.categorizacion.controls.servicios.addControl(
            element.name,
            new FormControl<boolean>(false)
          );
        });
      },
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


  //Gestión buscar cif
  protected cif = signal('');
  protected empresaExistente = signal<IEmpresaDisplay | null>(null);
  protected mostrarForm = signal(false);
  formComprobarCif = new FormGroup({
    cif: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z][0-9]{8}$/),
    ])
  })







  //Form reactivo
  form = new FormGroup({
    nombre: new FormControl(
      '',
      [Validators.required, Validators.minLength(5)],
      this.nombreEmpresaDisponible.bind(this)
    ),
    email: new FormControl('',[Validators.required, Validators.email]),
    descripcion: new FormControl('',[Validators.required, Validators.minLength(10)]),
    vacantes: new FormControl(1, [Validators.min(1), Validators.required]),
    imagen: new FormControl('', [fileInputTodoImagenes('imagen')]),
    direccion: new FormGroup({
      provincia: new FormControl<IRegion | null>(null, [Validators.required]),
      localidad: new FormControl<ITown | null>(null, [Validators.required]),
      calle : new FormControl('', [Validators.required]),
      coordX : new FormControl(0),
      coordY : new FormControl(0)
    }),
    horarios: new FormGroup(
      {
        horarioManana: new FormControl<string | null>(null, [
          Validators.required,
        ]),
        horarioTarde: new FormControl<string | null>(null, [
          Validators.required,
        ]),
        finSemana: new FormControl(false)
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

    ngOnInit(){
      //Cuando se introduce un valor válido en el campo cif, se comprueba si existe o no la empresa
       this.formComprobarCif.controls.cif.valueChanges.pipe(
       ).subscribe({
        next: (x) => {
          this.cif.set(x ?? '');

          if(this.formComprobarCif.controls.cif.valid)
          {
            this.empresasService.buscarPorCif(x ?? '').subscribe({
              next: (empr)=> this.empresaExistente.set(empr),
              error: ()=> {
                this.mostrarForm.set(true);
                this.empresaExistente.set(null)
              }
            })
          }
          else this.mostrarForm.set(false);
        },

      })
    }


    //Cargar imagen cuando se selecciona
    leerImagen(event : Event){
      if(event.target instanceof HTMLInputElement){
        const preview = document.getElementById("img-preview") as HTMLImageElement;
        preview.src = '';
        const fileList = event.target.files;
        if(fileList && fileList.length == 1){
          if (!fileList[0].type.startsWith("image/")) {
            return;
          }

          const reader = new FileReader();

          new Promise((resolve, reject) =>{
            reader.readAsDataURL(fileList[0]);
            reader.onload = ()=> resolve(reader.result)
          }).then(url => {
            let imageUrl = url as string;
            preview.src = imageUrl;
            this.form.controls.imagen.setValue(imageUrl, {emitModelToViewChange: false});
          })

        }

      }
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

  fileInputTodoImagenesLocal(fileInputName : string) :  ValidatorFn {
    return (control : AbstractControl) : ValidationErrors | null =>{
      const fileInput = this.form.get('imagen');
      if(fileInput instanceof HTMLInputElement)
      {
        const fileList = fileInput.files;
        if(fileList ){
          for (const file of fileList) {
            if (!file.type.startsWith("image/")) {
              return {'imagen-no-valida' : true};
            }
          }
        }
        return null;
      }
      return null;

    }
  }



  //obtener id de la categoria de un servicio a partir de su nombre
  private obtenerIdCategoria(servicio: string | undefined) {
    const infoServicio = this.servicios().find((x) => x.name == servicio);
    return infoServicio?.category ?? '';
  }

  //obtener categorias seleccionadas a partir de servicios seleccionados
  private obtenerCategorias(): string[] {
    const serviciosForm = this.form
      .get('categorizacion')
      ?.get('servicios')?.value;

    const arrayCategorias: string[] = [];
    for (let nombre in serviciosForm) {
      if (serviciosForm[nombre]) {
        const idCategoria = this.obtenerIdCategoria(nombre);
        if (idCategoria && !arrayCategorias.includes(idCategoria))
          arrayCategorias.push(idCategoria);
      }
    }

    return arrayCategorias;
  }

  //obtener array de servicios de la forma {idServicio, categoria}
  private obtenerServicios() {
    const serviciosForm = this.form
      .get('categorizacion')
      ?.get('servicios')?.value;

    const arrayServicios: { categoria: string; id: string }[] = [];
    for (let nombre in serviciosForm) {
      if (serviciosForm[nombre]) {
        const infoServicio = this.servicios().find((x) => x.name == nombre);
        if (infoServicio)
          arrayServicios.push({
            categoria: infoServicio.category,
            id: infoServicio.id,
          });
      }
    }

    return arrayServicios;
  }

  modelToData(): INewEmpresa {
    return {
      nombre: this.form.controls.nombre.value ?? '',
      cif: this.formComprobarCif.controls.cif.value ?? '',
      email: this.form.get('email')?.value ?? '',
      descripcion : this.form.get('descripcion')?.value ?? '',
      direccion: this.form.get('direccion')?.get('calle')?.value ?? '',
      vacantes: this.form.get('vacantes')?.value ?? 1,
      imagen: this.form.controls.imagen.value ?? '',
      provincia:
        this.form.controls.direccion.controls.provincia.value?.id ?? '',
      localidad:
        this.form.controls.direccion.controls.localidad.value?.id ?? '',
      coordX: this.form.controls.direccion.controls.coordX.value ?? 0,
      coordY: this.form.controls.direccion.controls.coordY.value ?? 0,
      horario_manana: this.form.controls.horarios.controls.horarioManana.value ?? '',
      horario_tarde: this.form.controls.horarios.controls.horarioTarde.value ?? '',
      finSemana: this.form.controls.horarios.controls.finSemana.value ?? false,
      categorias: this.obtenerCategorias(),
      servicios: this.obtenerServicios(),
    };
  }

  onSubmit() {
    this.empresasService.crearEmpresa(this.modelToData()).subscribe({
      next: (x)=>{
        console.log(x);
        this.form.reset();
        this.alert().title = "Empresa creada correctamente";
        this.alert().text = '';
        this.alert().icon = "success";
        this.alert().fire();
        this.router.navigate(['dashboard'])

      },
      error: ()=>{
        console.log('error');
        this.alert().title = "Ha ocurrido un error";
        this.alert().text = "No se ha podido crear.";
        this.alert().icon = "error";
        this.alert().fire();
      }

    })
  }

  //método para asociar una empresa existente al centro del usuario
  asociarEmpresa =(e :Event) => {
    this.empresasService.asociarEmpresa(this.empresaExistente()?.id ?? '').subscribe({
      next: ()=> {
        this.alert().title = "Empresa asociada correctamente";
        this.alert().text = '';
        this.alert().icon = "success";
        this.alert().fire();
        this.router.navigate(['company', this.empresaExistente()?.id])
      },
      error: (errorMsg: ApiErrorMessage) => {
        this.alert().title = "Ha ocurrido un error";
        this.alert().text = "No se ha podido asociar. Comprueba que la empresa aún no ha sido asociada a tu centro";
        this.alert().icon = "error";
        this.alert().fire();
      }
    })
  }
}
