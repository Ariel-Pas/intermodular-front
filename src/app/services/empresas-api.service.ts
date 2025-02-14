import { Inject, inject, Injectable } from '@angular/core';
import IEmpresasService from './IEmpresasService';
import { map, Observable } from 'rxjs';
import {
  IEmpresaDisplay,
  EmpresaJson,
  UrlValue,
  INewEmpresa,
  IEmpresaCompleta,
  ICategoria,
  IServicio,
  IRegion,
  ITown,
} from '../types';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../tokens/tokens';
import { IAuthenticationService } from './auth/IAuthenticationService';

@Injectable({
  providedIn: 'root',
})
export class EmpresasApiService extends IEmpresasService {
  constructor(@Inject(API_BASE) private baseUrl: string) {
    super();
  }
  private authService = inject(IAuthenticationService);
  private httpClient = inject(HttpClient);

  getEmpresas(): Observable<IEmpresaDisplay[]> {
    return this.httpClient
      .get<IEmpresaJSON[]>(`${this.baseUrl}/empresas-usuario`)
      .pipe(map((x) => x.map((empresa) => this.mapToEmpresaDisplay(empresa))));
  }



  getEmpresa(idEmpresa: string): Observable<IEmpresaCompleta> {
    return this.httpClient.get<IEmpresaJSON>(
      `${this.baseUrl}/empresa-completa/${idEmpresa}`
    ).pipe(map((x) => this.mapToEmpresaCompleta(x)));
  }

  getEmpresaByToken(token: string): Observable<IEmpresaCompleta | undefined> {
    return this.httpClient.get<IEmpresaJSON>(
      `${this.baseUrl}/empresas/token/${token}`
    ).pipe(map((x) => this.mapToEmpresaCompleta(x)));
  }

  getByName(nombreEmpresa: string): Observable<IEmpresaDisplay | undefined> {
    return this.httpClient.get<IEmpresaDisplay>(
      `${this.baseUrl}/companies/name/${nombreEmpresa}`
    );
  }

  getUrlAbierta(): Observable<UrlValue> {
    return this.httpClient.get<UrlValue>(`${this.baseUrl}/empresas-centro-url`);
  }

  getEmpresasAlumnos(idEmpresa: string): Observable<IEmpresaDisplay[]> {
    return this.httpClient
      .get<IEmpresaJSON[]>(`${this.baseUrl}/empresas-centro/${idEmpresa}`)
      .pipe(map((x) => x.map((empresa) => this.mapToEmpresaDisplay(empresa))));
  }

  crearEmpresa(empresa: INewEmpresa): Observable<IEmpresaDisplay> {
    return this.httpClient.post<IEmpresaDisplay>(
      `${this.baseUrl}/empresas`,
      empresa
    );
  }

  actualizarEmpresaAuth(
    id: string,
    empresa: INewEmpresa
  ): Observable<IEmpresaDisplay> {
    return this.httpClient.put<IEmpresaDisplay>(
      `${this.baseUrl}/empresas/${id}`,
      empresa
    );
  }

  actualizarEmpresaToken(
    token: string,
    empresa: INewEmpresa
  ): Observable<IEmpresaDisplay> {
    return this.httpClient.put<IEmpresaDisplay>(
      `${this.baseUrl}/empresas/token/${token}`,
      empresa
    );
  }

  buscarPorCif(cif: string): Observable<IEmpresaDisplay> {
    return this.httpClient.get<IEmpresaDisplay>(
      `${this.baseUrl}/empresas/comprobar-cif/${cif}`
    );
  }

  asociarEmpresa(idEmpresa: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${this.baseUrl}/empresas/asociar-centro/${idEmpresa}`
    );
  }

  actualizarNota(idEmpresa: string, nota: string): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${this.baseUrl}/empresas/notas/${idEmpresa}`,
      { notas: nota }
    );
  }

  enviarMail(datos: {
    empresas: string[];
    mensaje: string;
  }): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.baseUrl}/mail`, datos);
  }

  eliminarEmpresa(id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.baseUrl}/empresas/${id}`);
  }




  //Esto está hecho con el chatgpt para ahorrar tiempo
  mapToEmpresaDisplay(data: any): IEmpresaDisplay {
    return {
      id: data.id?.toString() || '',
      nombre: data.nombre || '',
      descripcion: data.descripcion || '',
      email: data.email || undefined,
      direccion: {
        calle: data.direccion?.calle || '',
        provincia: {
          area: data.direccion?.provincia?.area || '',
          id: data.direccion?.provincia?.id?.toString() || '',
          name: data.direccion?.provincia?.name || '',
        } as IRegion,
        poblacion: {
          region: data.direccion?.poblacion?.region?.toString() || '',
          id: data.direccion?.poblacion?.id?.toString() || '',
          name: data.direccion?.poblacion?.name || '',
        } as ITown,
        posicion: {
          coordX: data.direccion?.posicion?.coordX || 0,
          coordY: data.direccion?.posicion?.coordY || 0,
        },
      },
      horario: {
        horario_manana: data.horario?.horario_manana || '',
        horario_tarde: data.horario?.horario_tarde || '',
        finSemana: Boolean(data.horario?.finSemana), // Convertir a booleano explícitamente
      },
      imagen: data.imagen || null,
      categorias: (data.categorias || []).map((cat: any) => ({
        id: cat.id?.toString() || '',
        name: cat.nombre || '', // Cambio "name" por "nombre"
      })) as ICategoria[],
      servicios: (data.servicios || []).map((serv: any) => ({
        category: serv.categorias?.[0]?.toString() || '', // Usamos la primera categoría si existe
        id: serv.id?.toString() || '',
        name: serv.nombre || '', // Cambio "name" por "nombre"
        categories: (serv.categorias || []).map((cat: number) =>
          cat.toString()
        ), // Convertir IDs de categorías a string
      })) as IServicio[],
      vacantes: data.vacantes ?? 0,
      puntuacion: data.puntuacion ?? 0,
    };
  }


  mapToEmpresaCompleta(data: any): IEmpresaCompleta {
    return {
      ...this.mapToEmpresaDisplay(data), // Reutilizamos la conversión a IEmpresaDisplay
      urlEditar: data.urlEditar,
      cif: data.cif || '',
      notas: data.notas || undefined,
    };
  }
}
interface IEmpresaJSON {
  id: number;
  nombre: string;
  descripcion: string;
  email: string;
  direccion: {
    calle: string;
    provincia: {
      area: string;
      id: number;
      name: string;
    };
    poblacion: {
      id: number;
      name: string;
      region: number;
    };
    posicion: {
      coordX: number;
      coordY: number;
    };
  };
  horario: {
    horario_manana: string;
    horario_tarde: string;
    finSemana: number; // Puede ser 0 o 1
  };
  imagen: string | null;
  categorias: {
    id: number;
    nombre: string;
  }[];
  servicios: {
    id: number;
    nombre: string;
    categorias: number[]; // Lista de IDs de categorías
  }[];
  vacantes: number;
  puntuacion: number;
  notas? : string,
  cif?: string,
  urlEditar? : string
}


