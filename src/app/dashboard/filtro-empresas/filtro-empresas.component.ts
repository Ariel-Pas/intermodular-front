import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { InfoGeografia, IFiltros, ITown, IRegion } from '../../types';
import townsJson from '../../data/towns.json';
import { ButtonMainComponent } from '../../components/button-main/button-main.component';
import { CaracteresProhibidosInputDirective } from '../../directives/caracteres-prohibidos-input.directive';
import IEmpresasService from '../../services/IEmpresasService';
import { GestionFiltradoEmpresasService } from '../../services/gestion-filtrado-empresas.service';
import { ILocalizacionService } from '../../services/localizacion/ILocalizacionService';
import { LocalizacionesJsonService } from '../../services/localizacion/localizaciones-json.service';
import { LocalizacionesApiService } from '../../services/localizacion/localizaciones-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ICategoriaService } from '../../services/categorias/ICategoriasService';
import { CategoriasApiService } from '../../services/categorias/categorias-api.service';
import { CategoriasJsonService } from '../../services/categorias/categorias-json.service';


interface IFiltrosForm extends HTMLFormControlsCollection {
  nombreEmpresa: HTMLInputElement;
  localidad: HTMLSelectElement;
  provincia: HTMLSelectElement;
  vacantes: HTMLSelectElement;
  categorias: HTMLSelectElement;
  servicios: HTMLSelectElement;
}

@Component({
  selector: 'app-filtro-empresas',
  imports: [ButtonMainComponent, CaracteresProhibidosInputDirective],
  templateUrl: './filtro-empresas.component.html',
  styleUrl: './filtro-empresas.component.scss',
  providers: [
    {
      provide: ILocalizacionService,
      useExisting: LocalizacionesApiService,
    },
    {
      provide: ICategoriaService,
      useExisting : CategoriasApiService
    }

  ],
})
export class FiltroEmpresasComponent {
  private empresasService = inject(GestionFiltradoEmpresasService);
  private localizacionesService = inject(ILocalizacionService);
  private categoriasService = inject(ICategoriaService);


  //obtener info localizaciones del servicio
  //provincias - no cambian
  private provinciasRx = rxResource({
    loader: () =>this.localizacionesService.getRegiones()
  })

  public provincias = computed (()=>
    this.provinciasRx.value() ?? []
  );

  //señal para saber cuál es la provincia seleccionada
  public provinciaSeleccionada = signal('0');

  //rxResource para localidades - depende de la provincia seleccionada
  private rxLocalidades = rxResource({
    request : ()=>({provSelec : this.provinciaSeleccionada()}),
    loader : ({request}) => this.localizacionesService.getPoblaciones(request.provSelec)
  })

  public rxLocalidadesComputed = computed(()=> this.rxLocalidades.value() ?? []);


  //Arrays para generar selects
  //opciones select vacantes
  protected opcionesVacantes = [1, 2, 3, 4, 5, 6];


  //Categorias y servicios
  protected categoriaSeleccionada = signal<string>('0');

  private categoriasRx = rxResource({
    loader : () => this.categoriasService.getCategorias()
  })

  public categorias = computed(()=> this.categoriasRx.value() ?? []);

  private serviciosRx = rxResource({
    request : () =>({categoriaSeleccionada : this.categoriaSeleccionada()}),
    loader: ({request})=>this.categoriasService.getServicios(request.categoriaSeleccionada)
  })

  public servicios = computed(()=> this.serviciosRx.value() ?? []);


  //Gestión cambios filtros

  filtrosEmpresas: IFiltros = {
    nombre: '',
    localidad: '',
    provincia: '',
    vacantes: 0,
    categoria: '',
    servicio: '',
  };

  aplicarFiltros(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const {
      nombreEmpresa,
      localidad,
      provincia,
      vacantes,
      categorias,
      servicios,
    } = form.elements as IFiltrosForm;

    //asignar valores form a model
    this.filtrosEmpresas = {
      nombre: nombreEmpresa.value,
      localidad: localidad.value,
      provincia: provincia.value,
      vacantes: Number(vacantes.value),
      categoria: categorias.value,
      servicio: servicios.value,
    };

    this.empresasService.actualizarFiltros(this.filtrosEmpresas);
  }
}
