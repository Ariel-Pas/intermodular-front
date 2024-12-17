import { Component, computed, input, output, signal } from '@angular/core';
import { InfoGeografia, IFiltros } from '../../types';
import townsJson from '../../towns.json';

interface IFiltrosForm extends HTMLFormControlsCollection{
  nombreEmpresa : HTMLInputElement,
  localidad : HTMLSelectElement,
  provincia : HTMLSelectElement,
  vacantes : HTMLSelectElement,
  categorias : HTMLSelectElement
}


@Component({
  selector: 'app-filtro-empresas',
  imports: [],
  templateUrl: './filtro-empresas.component.html',
  styleUrl: './filtro-empresas.component.scss'
})


export class FiltroEmpresasComponent {
  public towns : InfoGeografia = townsJson;


  public provincias = [...Object.keys(this.towns)];
  //Actualizar localidades al cambiar la provincia seleccionada
  public provinciaSeleccionada = signal('');

  localidades = computed(()=>{
    return this.towns[this.provinciaSeleccionada()]
  })

  //opciones select vacantes
  protected opcionesVacantes = [1, 2, 3, 4, 5, 6];
  protected categorias = ['Programación web', 'Comercio electrónico', 'RRSS', 'Marketing', 'Aplicaciones'];

  //Gestión cambios filtros


  filtrosChanged = output<IFiltros>();

  aplicarFiltros(event : Event) {

    event.preventDefault();

     const form = event.target as HTMLFormElement;

    const {
      nombreEmpresa,
      localidad,
      provincia,
      vacantes,
      categorias
    } = form.elements as IFiltrosForm;

    console.log(nombreEmpresa.value);

    this.filtrosChanged.emit({
      nombre : nombreEmpresa.value,
      localidad : localidad.value,
      provincia : provincia.value,
      vacantes: Number(vacantes.value),
      categoria: categorias.value
    })
  }

}
