export interface IEmpresaDisplay {
  id: string;
  nombre: string;
  cif: string;
  descripcion: string;
  email?: string;
  telefono? : string;
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

export interface EmpresaJson {
  id: string,
  name: string,
  image: string,
  phone?: string | undefined,
  email?: string | undefined,
  address: {
      region: string,
      town: string,
      street: string,
      position: {
          lat: number,
          lng: number
      }
  },
  openings: {
      year: number,
      count: number
  }[],
  categories: string[],
  workingHours: {
      start: string,
      end: string
  },
  score: {
      teacher: number,
      student: number
  }
}

export type InfoGeografia = Record<string, string[]>;

export interface IRegion {
  area : string,
  id : string,
  name : string
}

export interface ITown{
  region : string,
  id : string,
  name : string
}

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


//Auth
export interface ICredenciales{
  usuario : string | null,
  rol : string | null,
  token : string | null
}
