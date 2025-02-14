export interface IUniqueResource{
  id: string,
  name: string
}



export interface IEmpresaDisplay {
  id: string;
  nombre: string;
  descripcion: string;
  email?: string;
  direccion: {
    calle: string;
    provincia: IRegion;
    poblacion: ITown;
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
  vacantes: number;
  puntuacion: number
}

export interface IEmpresaCompleta extends IEmpresaDisplay{
  urlEditar: string,
  cif : string,
  notas? : string

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
  vacantes: number |undefined;
  categoria: string;
  servicio: string;
}

export interface IFiltrosModel {
  nombre: string;
  provincia: IRegion | null;
  localidad: ITown | null;
  vacantes: number| undefined;
  categoria: ICategoria| null;
  servicio: IServicio| null;
}


//parejas de strings para generar el nav subrayado. id-nombre seccion
export type stringPair = [string, string];


//Auth
export interface ICredenciales{
  usuario : string | null,
  rol : string | null,
  token : string | null,
  centro?: number | null
}

//AUTH BETA
export type role = 'Admin' | 'Centro' | 'Tutor';

export interface ISession{
  username: string,
  roles: role[],
  token: string,
  activatedRole: role | null;
}
//AUTH BETA

//Categorias y servicios
export interface ICategoria{
  id : string,
  name : string
}

export interface IServicio{
  category : string,
  id : string,
  name : string
}


export interface INewEmpresa{
  nombre: string,
  provincia: string
  localidad: string,
  coordX: number,
  coordY: number,
  direccion: string,
  cif: string,
  email: string,
  descripcion: string,
  vacantes: number,
  horario_manana: string,
  horario_tarde: string,
  finSemana : boolean,
  categorias: string[],
  servicios: {categoria: string, id:string}[];
  imagen: string,
  tipoImagen: string
}


export interface ICheckboxOption{
  name: string,
  selected: boolean
  id: string
}


export interface UrlValue{
  url: string
}

export interface ApiErrorMessage{
  error:string
}
// Tipos formularios
export interface IFormulario {
  id: string,
  nombre: string | null,
  descripcion: string,
  tipo: string
}

export interface IPregunta {
  id: string;
  titulo: string;
  tipo: 'text' | 'textarea' | 'estrellas';
  orden: string;
}

export interface IToken {
  id: string | null;
  token: string;
  formulario_id: number | null;
  centro_id: number | null;
  empresa_id: number | null;
}

export interface IResenia {
  respuesta: string | number | null;
  pregunta_id: string;
  formulario_id: number; //string
  centro_id: number;
  empresa_id: number;
  [key: string]: any;
}

export interface IRespuesta {
  pregunta_id: number;
  respuesta: string | number | null;  // Puede ser texto, número o null
}

export interface ISolicitud {
  nombreEmpresa: string;
  actividad: string;
  cif: string,
  provincia: string | null,
  localidad: string | null,
  email: string,
  titularidad: string,
  horario_comienzo: string | null;
  horario_fin: string | null;
  empresa_id: number | null;
  centro_id: ICentro | number | null;
}


export interface ICentro {
  id: number;
  nombre: string;
  codigo: string;
  email: string;
  password: string;
  direccion: string;
  telefono: string;

}

export interface IUsuario{
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  //AQUI NO ES string|null, YA QUE SIEMPRE EXISTIRA UN CENTRO PARA ASOCIAR AL USUARIO
  //REVISAR CASO ADMIN, QUIZAS ESTE NO TENGA UN CENTRO
  centro_id: string;
}
