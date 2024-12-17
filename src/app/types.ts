export interface IEmpresaDisplay {
  id : number,
  nombre : string,
  cif: string,
  descripcion : string,
  email: string,
  direccion: string,
  provincia: string,
  poblacion: string,
  coordX : number,
  coordY : number,
  horario_manana : string,
  horario_tarde : string,
  finSemana : boolean,
  imagen : string,
  categorias : string[],
  servicios: string[],
  vacantes : number
}

export type InfoGeografia = Record<string, string[]>;

//interfaz de la información de filtrado que envía el componente filtros
export interface IFiltros{
  nombre : string,
  provincia : string,
  localidad : string,
  vacantes : number,
  categoria : string
}
