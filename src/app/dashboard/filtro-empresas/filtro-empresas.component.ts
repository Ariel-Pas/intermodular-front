import {
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { InfoGeografia, IFiltros } from '../../types';
import townsJson from '../../towns.json';

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
  imports: [],
  templateUrl: './filtro-empresas.component.html',
  styleUrl: './filtro-empresas.component.scss',
})
export class FiltroEmpresasComponent {
  public towns: InfoGeografia = townsJson;

  //obtener nombre de provincias
  public provincias = [...Object.keys(this.towns)];

  public provinciaSeleccionada = signal('');

  //Actualizar localidades al cambiar la provincia seleccionada
  localidades = computed(() => {
    return this.towns[this.provinciaSeleccionada()];
  });

  //Arrays para generar selects
  //opciones select vacantes
  protected opcionesVacantes = [1, 2, 3, 4, 5, 6];
  protected categorias = [
    'Programación web',
    'Comercio electrónico',
    'RRSS',
    'Marketing',
    'Aplicaciones',
  ];

  protected opcionesServicios = ['PHP', 'TS', 'JS', 'Java', 'HTML', 'CSS'];

  //Gestión cambios filtros

  filtrosEmpresas = model<IFiltros>({
    nombre: '',
    localidad: '',
    provincia: '',
    vacantes: 0,
    categoria: '',
    servicio: '',
  });
  

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
    this.filtrosEmpresas.set({
      nombre: nombreEmpresa.value,
      localidad: localidad.value,
      provincia: provincia.value,
      vacantes: Number(vacantes.value),
      categoria: categorias.value,
      servicio: servicios.value,
    });
  }
}
