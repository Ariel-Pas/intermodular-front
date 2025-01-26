import { Component, computed, effect, inject, signal } from '@angular/core';
import { ILocalizacionService } from '../../../services/localizacion/ILocalizacionService';
import { rxResource } from '@angular/core/rxjs-interop';
import { ICategoria, ICheckboxOption, INewEmpresa, IRegion, IServicio, ITown } from '../../../types';
import { FormsModule } from '@angular/forms';
import { ValidarHorarioEmpresaDirective } from '../../../directives/validar-horario-empresa.directive';
import { ICategoriaService } from '../../../services/categorias/ICategoriasService';
import { ValidarCheckbox } from '../../../directives/validar-checkbox.directive';
import { NombreDisponibleDirective } from '../../../directives/nombre-disponible.directive';
import { filter } from 'rxjs';


interface ActivableICheckboxOption extends ICheckboxOption{
  visible: boolean
}

interface ServicioModel extends ActivableICheckboxOption{
  category: string
}

interface INewEmpresaModel{
  nombre: string,
  provincia: IRegion | null,
  localidad: ITown | null,
  cif: string,
  horario:{
    manana: string,
    tarde: string
  },
  categoria: ICategoria[] | null,
  servicios: ServicioModel[]
}

@Component({
  selector: 'app-create-empresa',
  imports: [FormsModule, ValidarHorarioEmpresaDirective, ValidarCheckbox, NombreDisponibleDirective],
  templateUrl: './create-empresa.component.html',
  styleUrl: './create-empresa.component.scss'
})
export class CreateEmpresaComponent {

  constructor(){
    effect(()=>{
      //para poder generar opciones checkbox asociadas al model, hay que actualizar sus servicios cuando cambia
      //la categoria seleccionada
      //this.model.servicios = this.servicios().map(x => {return {name: x.name, selected: false, id: x.id}})
      //console.log(this.model.servicios);

      //actualizar los servicios del model cuando acaben de cargar
      this.model.servicios =  this.servicios().map(x => {

        return{...x, visible: false, selected: false}}
      )
      console.log('effect');

    })
  }


  private localizacionesService = inject(ILocalizacionService);
  private categoriasService = inject(ICategoriaService);

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

      public localidades = computed(()=> this.rxLocalidades.value() ?? []);


    //categorias y servicios

    protected categoriaSeleccionada = signal<string>('0');

    private categoriasRx = rxResource({
      loader : () => this.categoriasService.getCategorias()
    })

    public categorias = computed(()=> this.categoriasRx.value() ?? []);

   /*  private serviciosRx = rxResource({
      request : () =>({categoriaSeleccionada : this.categoriaSeleccionada()}),
      loader: ({request})=>this.categoriasService.getServicios(request.categoriaSeleccionada)
    }) */

    private serviciosRx = rxResource({
      loader: ()=>this.categoriasService.getAllServicios()
    })

    public servicios = computed(()=> this.serviciosRx.value() ?? []);

    public serviciosMostrar = computed(()=> this.servicios().filter(x => x.category = this.categoriaSeleccionada()))
    //generar nombres de los checks para pasárselos a la directiva
    protected serviciosControlsNames = computed(()=>this.servicios().map(x => 'servicio'+x.id));



    //Validacion form
    model : INewEmpresaModel = {
      nombre: '',
      provincia: {
        id: '',
        name: '',
        area: ''
      },
      localidad: {
        id: '',
        name:'',
        region: ''
      },
      cif: '',
      horario: {
        manana: '',
        tarde: ''
      },
      categoria: [],
      servicios: this.servicios().map(x => {
        return{...x, visible:false, selected: false}}
      )

    }

    private obtenerCategorias(model: INewEmpresaModel) : string[]
    {
      let ar = model.servicios.filter(serv => serv.selected).map(serv => serv.category);
          const s = new Set(ar);
          return Array.from(s);
    }


    modelToData (model: INewEmpresaModel): INewEmpresa{
      return{
        nombre: model.nombre,
        cif: model.cif,
        provincia: model.provincia?.id ?? '',
        localidad: model.localidad?.id ?? '',
        horario: {
          manana: model.horario.manana,
          tarde: model.horario.tarde
        },
        categoria: this.obtenerCategorias(model),
        servicios: model.servicios.filter(serv => serv.selected).map(x => {return{categoria: x.category, id: x.id}})

      }
    }

    onSubmit()
    {
      //console.log(this.model);

      let data = this.modelToData(this.model);
      console.log(data);

    }
}
