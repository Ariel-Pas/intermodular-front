import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CategoryService,
  ICategoria,
  IEmpresaCompleta,
  INewEmpresa,
  IRegion,
  IServicio,
  ITown,
} from '../../../types';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { IAuthenticationService } from '../../../services/auth/IAuthenticationService';
import { GestionFiltradoEmpresasService } from '../../../services/gestion-filtrado-empresas.service';
import { AuthApiBetaService } from '../../../services/auth/auth-api-beta.service';

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
  public empresaInfo: IEmpresaCompleta | null = null;
  public empresa!: IEmpresaCompleta;
  private empresasService = inject(IEmpresasService);
  private localizacionesService = inject(ILocalizacionService);
  private categoriasService = inject(ICategoriaService);
  private router = inject(Router);
  private gestionEmpresasService = inject(GestionFiltradoEmpresasService);

  ngOnInit(): void {
    this.route.data
      .pipe(
        //pedirle todos los observables
        switchMap((data) =>
          forkJoin({
            empresa: of(data['empresa'] as IEmpresaCompleta),
            provincias: this.localizacionesService.getRegiones(),
            localidades: this.localizacionesService.getPoblaciones(
              data['empresa'].direccion.provincia.id
            ),
            servicios: this.categoriasService.getAllServicios(),
          })
        ),
        tap((datos) => {
          this.empresaInfo = datos.empresa;

          this.provinciasInit.set(datos.provincias);
          this.poblacionesInit.set(datos.localidades);

          this.form.patchValue({
            nombre: datos.empresa.nombre,
            cif: datos.empresa.cif,
            email: datos.empresa.email,
            descripcion: datos.empresa.descripcion,
            vacantes: datos.empresa.vacantes,
          });

          this.form.controls.direccion.patchValue({
            calle: datos.empresa.direccion.calle,
            coordX: datos.empresa.direccion.posicion.coordX,
            coordY: datos.empresa.direccion.posicion.coordY,
            provincia: this.provinciasInit()?.find(
              (p) => p.id == datos.empresa.direccion.provincia.id
            ),
            localidad: this.poblacionesInit()?.find(
              (l) => l.id == datos.empresa.direccion.poblacion.id
            ),
          });

          this.form.controls.horarios.patchValue({
            horarioManana: datos.empresa.horario.horario_manana,
            horarioTarde: datos.empresa.horario.horario_tarde,
            finSemana: datos.empresa.horario.finSemana,
          });

          //rellenar array de servicios seleccionados y marcar checkboxes
          datos.servicios.forEach((element) => {
            //inicializar checkboxes
            this.form.controls.categorizacion.controls.servicios.addControl(
              element.name,
              new FormControl<boolean>(
                datos.empresa.servicios.find((servEmpresa) => {
                  const servicioEnEmpresa = servEmpresa.id == element.id;
                  //añadir al array de servicios seleccionados los elementos ya seleccionados
                  if (servicioEnEmpresa) {
                    this.infoServiciosSeleccionados.push({
                      id: element.id,
                      name: element.name,
                      //esto se carga que un mismo servicio esté en varias categorías pero bueno
                      category:
                        element.categories?.length &&
                        element.categories?.length > 0
                          ? element.categories[0]
                          : '',
                      categories: element.categories,
                    });
                  }
                  return servicioEnEmpresa;
                })
                  ? true
                  : false
              )
            );


          });
        })
      )
      .subscribe((datos) => {});
  }

  alert = viewChild.required(SwalComponent);

  private provinciasRx = rxResource({
    loader: () => this.localizacionesService.getRegiones(),
  });

  //this.provinciasRx.set() //actualizar array y clonar con filter

  public provincias = computed(() => this.provinciasRx.value() ?? []);
  public provinciasInit = signal<IRegion[] | null>(null);
  public poblacionesInit = signal<ITown[] | null>(null);


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
    cif: new FormControl(
      '',
      [Validators.required, Validators.pattern(/^[A-Z][0-9]{8}$/)],
      this.cifEmpresaDisponible.bind(this)
    ),
    vacantes: new FormControl(1, [Validators.min(1), Validators.required]),
    imagen: new FormControl(''),
    tipoImagen: new FormControl(''),
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
      categoria: new FormControl<ICategoria | null>(null),
      servicios: new FormRecord({}, [checkboxValidation({ min: 1 })]),
    }),
  });

  //cambiar localidades al cambiar provincia

    onChangeProvincia(event: Event){
      this.localizacionesService.getPoblaciones(this.form.controls.direccion.controls.provincia.value?.id ?? '').subscribe({
        next : (datos) => this.poblacionesInit.set(datos)
      })
    }


  //Funciones validación
  nombreEmpresaDisponible(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (control.value === '' || control.value === null) return of(null);
    if (control.value === this.empresaInfo?.nombre) return of(null);
    return this.empresasService.getByName(control.value).pipe(
      map((x) => ({ 'nombre-disponible': true })),
      catchError(() => of(null))
    );
  }

  cifEmpresaDisponible(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (control.value === '' || control.value === null) return of(null);
    //si no ha variado respecto al valor del cif de la empresa no hay error
    if (control.value === this.empresaInfo?.cif) return of(null);

    return this.empresasService.buscarPorCif(control.value).pipe(
      map((x) => ({
        'cif-disponible': true,
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
    let esconder = !infoServicio.categories?.includes(
      this.form.controls.categorizacion.controls.categoria.value?.id ?? ''
    );

    return esconder;
  }

  leerImagen(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      /* const preview = document.getElementById("img-preview") as HTMLImageElement;
      preview.src = ''; */
      const fileList = event.target.files;
      if (fileList && fileList.length == 1) {
        if (!fileList[0].type.startsWith('image/')) {
          return;
        }
        this.form.controls.tipoImagen.setValue(fileList[0].type.split('/')[1], {
          emitModelToViewChange: false,
        });

        const reader = new FileReader();

        new Promise((resolve, reject) => {
          reader.readAsDataURL(fileList[0]);
          reader.onload = () => resolve(reader.result);
        }).then((url) => {
          let imageUrl = url as string;
          //preview.src = imageUrl;
          this.form.controls.imagen.setValue(imageUrl, {
            emitModelToViewChange: false,
          });
        });
      }
    }
  }

      //añadir validador de imagen una vez se ha cargado la vista
      ngAfterViewInit(){
        this.form.controls.imagen.addValidators(this.fileInputTodoImagenes());
        this.form.updateValueAndValidity();
      }

      imagenInput = viewChild<ElementRef<HTMLInputElement>>('imagen');

      //validar que se ha seleccionado una imagen
      fileInputTodoImagenes() :  ValidatorFn {
        return (control : AbstractControl) : ValidationErrors | null =>{

            //const fileList = fileInput.files;
            const fileList = this.imagenInput()?.nativeElement.files;
            if(fileList){
              for (const file of fileList) {
                if (!file.type.startsWith("image/")) {
                  return {'imagen-no-valida' : true};
                }
              }
            }
            return null;
        }
      }



  private infoServiciosSeleccionados: IServicio[] = [];

  //método que mantiene actualizado el array inforServiciosSeleccionados
  protected onChangeServicio(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    //obtener servicio correspondiente
    const servicioSeleccionado = this.servicios().find(
      (serv) => serv.name == checkbox.name
    );

    if (
      servicioSeleccionado &&
      this.form.controls.categorizacion.controls.categoria.value
    ) {
      //buscar la categoría seleccionada
      let categoriaSeleccionada =
        this.form.controls.categorizacion.controls.categoria.value?.id;
      //crear un objeto con la información del servicio y la categoría
      let infoServicio = {
        ...servicioSeleccionado,
        category: categoriaSeleccionada,
      };
      //buscar si este servicio con esta categoría ya está en el array de seleccionados
      const servicioYaSeleccionado = this.infoServiciosSeleccionados.findIndex(
        (serv) =>
          serv.name == servicioSeleccionado.name &&
          serv.category == categoriaSeleccionada
      );
      //si ya está en el array lo quitamos porque ha sido deseleccionado
      if (servicioYaSeleccionado >= 0)
        this.infoServiciosSeleccionados.splice(servicioYaSeleccionado, 1);
      //si no está se añade al array
      else this.infoServiciosSeleccionados.push(infoServicio);
    }

  }

  obtenerServiciosYCategorias(): CategoryService[] {
    return this.infoServiciosSeleccionados.map((infoServ) => {
      return { servicio: infoServ.id, categoria: infoServ.category };
    });
  }

  modelToData(): INewEmpresa {
    const regexBase64 = /data:image\/[a-z]+;base64,/;
    return {
      nombre: this.form.controls.nombre.value ?? '',
      cif: this.form.controls.cif.value ?? '',
      email: this.form.get('email')?.value ?? '',
      descripcion: this.form.get('descripcion')?.value ?? '',
      direccion: this.form.get('direccion')?.get('calle')?.value ?? '',
      vacantes: this.form.get('vacantes')?.value ?? 1,
      imagen: this.form.controls.imagen.value?.replace(regexBase64, '') ?? '',
      tipoImagen: this.form.controls.tipoImagen.value ?? '',
      provincia:
        this.form.controls.direccion.controls.provincia.value?.id ?? '',
      localidad:
        this.form.controls.direccion.controls.localidad.value?.id ?? '',
      coordX: this.form.controls.direccion.controls.coordX.value ?? 0,
      coordY: this.form.controls.direccion.controls.coordY.value ?? 0,
      horario_manana:
        this.form.controls.horarios.controls.horarioManana.value ?? '',
      horario_tarde:
        this.form.controls.horarios.controls.horarioTarde.value ?? '',
      finSemana: this.form.controls.horarios.controls.finSemana.value ?? false,
      servicios: this.obtenerServiciosYCategorias(),
    };
  }

  private authService = inject(AuthApiBetaService);
  onSubmit() {
    console.log(this.modelToData());

    //decidir qué método utilizar dependiendo de si el usuario está autenticado
    if (this.authService.currentToken) {
      this.empresasService
        .actualizarEmpresaAuth(this.empresaInfo?.id ?? '', this.modelToData())
        .subscribe({
          next: (x) => {

            this.gestionEmpresasService.recargarEmpresas();
            this.alert().title = 'Empresa actualizada correctamente';
            this.alert().text = '';
            this.alert().icon = 'success';
            this.alert().fire();
            this.router.navigate(['dashboard'])
          },
          error: () => {

            this.alert().title = 'Ha ocurrido un error';
            this.alert().text = 'No se ha podido actualizar.';
            this.alert().icon = 'error';
            this.alert().fire();
          },
        });
    } else {
      this.empresasService
        .actualizarEmpresaToken(this.id(), this.modelToData())
        .subscribe({
          next: (x) => {

            this.alert().title = 'Empresa actualizada correctamente';
            this.alert().text = '';
            this.alert().icon = 'success';
            this.alert().fire();
            //this.router.navigate(['dashboard'])
          },
          error: () => {

            this.alert().title = 'Ha ocurrido un error';
            this.alert().text = 'No se ha podido actualizar.';
            this.alert().icon = 'error';
            this.alert().fire();
          },
        });
    }
  }
}
