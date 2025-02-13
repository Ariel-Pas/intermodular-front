import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ISession, role } from '../../types';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

//CORREGIR
export class AuthApiBetaService {

  private API_URL = 'http://localhost:8000/api';
  // private API_URL2 = 'http://127.0.0.1:8000/api';
  sessionSubject = new BehaviorSubject<ISession | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.initializeSession();
  }

  private initializeSession(): void{
    const savedSession = localStorage.getItem('session');
    if(savedSession){
      this.sessionSubject.next(JSON.parse(savedSession));
    }
  }

  get session$(): Observable<ISession|null>{
    return this.sessionSubject.asObservable();
  }

  login(email: string, password: string): Observable<ISession>{
    return this.http.post<{
      access_token: string,
      roles: role[],
      nombre: string,
    }>(`${this.API_URL}/login`, {email, password}).pipe(
      map(response => {
        const session: ISession = {
          username: response.nombre,
          roles: response.roles.filter(role => role !== 'Admin') as role[],
          token: response.access_token,
          activatedRole: null
        };

        //EXPERIMENTAL
        // if(session.roles.length === 0){
        //   throw new Error('Usuario sin roles validos');
        // }

        if(session.roles.length === 1){
          session.activatedRole = session.roles[0];
        }

        this.persistSession(session);
        this.redirectBasedOnRole();

        return session;
      })
    );
  }

  private persistSession(session: ISession): void{
    localStorage.setItem('session', JSON.stringify(session));
    this.sessionSubject.next(session);
  }

  selectRole(role:role) : void{
    const currentSession = this.sessionSubject.value;
    if(!currentSession || !currentSession.roles.includes(role)){
      throw new Error('Rol no valido para este usuario');
    }
    const updatedSession: ISession = {
      ...currentSession,
      activatedRole: role
    }
    this.persistSession(updatedSession);
    this.redirectBasedOnRole();
  }

  private redirectBasedOnRole(): void{

    const currentSession = this.sessionSubject.value;

    if(!currentSession) return;

    const role = currentSession.activatedRole;

    switch(role) {
      case 'Centro' :
        this.router.navigate(['/profile/Centro']);
        break;
      case 'Tutor':
        this.router.navigate(['/profile/Tutor']);
        break;
      default:
        if(currentSession.roles.length > 1) {
          this.router.navigate(['/select-role']);
        }
    }
  }

  logout() : void {
    this.http.post(`${this.API_URL}/logout`, {}).subscribe(() => {
      localStorage.removeItem('session');
      this.sessionSubject.next(null);
      this.router.navigate(['/loogin']);
    });
  }

  hasRole(role: role) : boolean {
    return this.sessionSubject.value?.roles.includes(role) ?? false;
  }

  get currentToken() : string | null {
    return this.sessionSubject.value?.token ?? null;
  }
}
