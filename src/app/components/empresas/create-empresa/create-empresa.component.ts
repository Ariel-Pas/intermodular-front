import { Component, computed, inject, signal } from '@angular/core';
import { ILocalizacionService } from '../../../services/localizacion/ILocalizacionService';
import { rxResource } from '@angular/core/rxjs-interop';
import { INewEmpresa, IRegion, ITown } from '../../../types';
import { FormsModule } from '@angular/forms';
import { ValidarHorarioEmpresaDirective } from '../../../directives/validar-horario-empresa.directive';
import { ICategoriaService } from '../../../services/categorias/ICategoriasService';



interface INewEmpresaModel{
  nombre: string,
  provincia: IRegion,
  localidad: ITown,
  cif: string,
  horario:{
    manana: string,
    tarde: string
  },
  categoria: string,
  servicios: {name: string, selected:boolean}[]
}

@Component({
  selector: 'app-create-empresa',
  imports: [FormsModule, ValidarHorarioEmpresaDirective],
  templateUrl: './create-empresa.component.html',
  styleUrl: './create-empresa.component.scss'
})
export class CreateEmpresaComponent {
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

    private serviciosRx = rxResource({
      request : () =>({categoriaSeleccionada : this.categoriaSeleccionada()}),
      loader: ({request})=>this.categoriasService.getServicios(request.categoriaSeleccionada)
    })

    public servicios = computed(()=> this.serviciosRx.value() ?? []);

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
      categoria: '',
      servicios: []

    }


    modelToData (model: INewEmpresaModel): INewEmpresa{
      return{
        nombre: model.nombre,
        cif: model.cif,
        provincia: model.provincia.id,
        localidad: model.localidad.id,
        horario: {
          manana: model.horario.manana,
          tarde: model.horario.tarde
        }
      }
    }

    onSubmit()
    {
      let data = this.modelToData(this.model);
      console.log(data);

    }
}
