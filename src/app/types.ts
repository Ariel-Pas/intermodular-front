export interface IEmpresaDisplay {
  id: number;
  nombre: string;
  cif: string;
  descripcion: string;
  email: string;
  direccion: {
    calle: string;
    provincia: string;
    poblacion: string;
    posicion: {
      coordX: number;
      coordY: number;
    };
  };
  horario: {
    horario_manana: string;
    horario_tarde: string;
    finSemana: boolean;
  };
  imagen: string;
  categorias: string[];
  servicios: string[];
  vacantes: [
    {
      anyo : number,
      cantidad: number
    }
  ];
  puntuacion: {
    profesor: number,
    alumno: number
  }
}

export type InfoGeografia = Record<string, string[]>;

//interfaz de la información de filtrado que envía el componente filtros
export interface IFiltros {
  nombre: string;
  provincia: string;
  localidad: string;
  vacantes: number;
  categoria: string;
  servicio: string;
}


//parejas de strings para generar el nav subrayado. id-nombre seccion
export type stringPair = [string, string];
