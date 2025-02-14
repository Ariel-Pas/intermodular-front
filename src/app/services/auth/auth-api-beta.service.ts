import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ISession, role } from '../../types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_BASE } from '../../tokens/tokens';

@Injectable({
  providedIn: 'root'
})

export class AuthApiBetaService {

  //private API_URL = 'http://localhost:8000/api';
  //BehaviorSubject, permite acceder siempre al ultimo estado de la variable, y a su vez actualiza a todos los suscritos
  //Observables DIAPOSITIVA 65
  sesionSubject = new BehaviorSubject<ISession | null>(null);

  constructor(private http: HttpClient, private router: Router, @Inject(API_BASE) private API_URL: string) {
    this.inicializarSesion();

  }

  private inicializarSesion(): void {
    const sesionGuardada = localStorage.getItem('session');
    if (sesionGuardada) {
      this.sesionSubject.next(JSON.parse(sesionGuardada));
    }
  }

  get session$(): Observable<ISession | null> {
    return this.sesionSubject.asObservable();
  }

  login(email: string, password: string): Observable<ISession> {
    return this.http.post<{
      access_token: string,
      roles: role[],
      nombre: string,
    }>(`${this.API_URL}/login`, { email, password }).pipe(
      map(response => {
        const session: ISession = {
          username: response.nombre,
          roles: response.roles.filter(role => role !== 'Admin') as role[],
          token: response.access_token,
          activatedRole: null
        };

        //Si solo tiene un rol, activarlo automaticamente
        if (session.roles.length === 1) {
          session.activatedRole = session.roles[0];
        }

        this.mantenerSesion(session);
        this.redirigirPorRol();

        return session;
      })
    );
  }

  private mantenerSesion(session: ISession): void {
    localStorage.setItem('session', JSON.stringify(session));
    this.sesionSubject.next(session);
  }

  elegirRol(role: role): void {
    const sesionActual = this.sesionSubject.value;
    if (!sesionActual || !sesionActual.roles.includes(role)) {
      throw new Error('Rol no valido para este usuario');
    }
    const updatedSession: ISession = {
      ...sesionActual,
      activatedRole: role
    }
    this.mantenerSesion(updatedSession);
    this.redirigirPorRol();
  }

  private redirigirPorRol(): void {

    const sesionActual = this.sesionSubject.value;
    if (!sesionActual) return;

    const roles = sesionActual.roles;
    const activatedRole = sesionActual.activatedRole;

    //Si el usuario tiene el rol Admin, pero no tiene otros roles, no permitir acceso
    if (roles.includes('Admin') && roles.length === 1) {
      this.router.navigate(['/unauthorized']);
      return;
    }

    //Si el usuario tiene Admin y otros roles, ignorar Admin y permitir seleccion
    if (roles.includes('Admin') && roles.length > 1) {
      const rolesSinAdmin = roles.filter(role => role !== 'Admin');
      if (rolesSinAdmin.length === 1) {
        //Si solo tiene un rol ademas de Admin, redirigir automaticamente
        sesionActual.activatedRole = rolesSinAdmin[0];
        this.mantenerSesion(sesionActual);
        this.redirigirPorRol();
        return;
      } else {
        //Si tiene multiples roles ademas de Admin, redirigir a la seleccion de roles
        this.router.navigate(['/select-role']);
        return;
      }
    }

    //Redirigir segun el rol activado
    switch (activatedRole) {
      case 'Centro':
        this.router.navigate(['/profile/Centro']);
        break;
      case 'Tutor':
        this.router.navigate(['/profile/Tutor']);
        break;
      default:
        if (roles.length > 1) {
          this.router.navigate(['/select-role']);
        } else {
          this.router.navigate(['/unauthorized']);
        }
    }
  }

  logout(): void {
    const token = this.currentToken;

    // Enviar petición solo si hay token
    if (token) {
      this.http.post(`${this.API_URL}/logout`, {}, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      }).subscribe({
        next: () => this.limpiarSesion(),
        // Limpiar incluso si falla
        error: () => this.limpiarSesion()
      });
    } else {
      this.limpiarSesion();
    }
  }

  private limpiarSesion(): void {
    localStorage.removeItem('session');
    this.sesionSubject.next(null);
    this.router.navigate(['/login']);
  }



  hasRole(role: role): boolean {
    return this.sesionSubject.value?.roles.includes(role) ?? false;
  }

  get currentToken(): string | null {
    return this.sesionSubject.value?.token ?? null;
  }
}
