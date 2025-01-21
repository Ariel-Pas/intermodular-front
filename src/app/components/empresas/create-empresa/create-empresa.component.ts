import { Component, computed, inject } from '@angular/core';
import { ILocalizacionService } from '../../../services/localizacion/ILocalizacionService';
import { rxResource } from '@angular/core/rxjs-interop';
import { INewEmpresa, IRegion } from '../../../types';
import { FormsModule } from '@angular/forms';
import { ValidarHorarioEmpresaDirective } from '../../../directives/validar-horario-empresa.directive';



interface INewEmpresaModel{
  nombre: string,
  provincia: IRegion,
  cif: string
  horario:{
    manana: string,
    tarde: string
  }
}

@Component({
  selector: 'app-create-empresa',
  imports: [FormsModule, ValidarHorarioEmpresaDirective],
  templateUrl: './create-empresa.component.html',
  styleUrl: './create-empresa.component.scss'
})
export class CreateEmpresaComponent {
  private localizacionesService = inject(ILocalizacionService);
   private provinciasRx = rxResource({
      loader: () =>this.localizacionesService.getRegiones()
    })

    public provincias = computed (()=>
      this.provinciasRx.value() ?? []
    );



    //Validacion form
    model : INewEmpresaModel = {
      nombre: '',
      provincia: {
        id: '',
        name: '',
        area: ''
      },
      cif: '',
      horario: {
        manana: '',
        tarde: ''
      }

    }


    modelToData (model: INewEmpresaModel): INewEmpresa{
      return{
        nombre: model.nombre,
        cif: model.cif,
        provincia: model.provincia.id,
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
