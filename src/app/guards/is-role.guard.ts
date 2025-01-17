import { CanMatchFn } from '@angular/router';
import { IAuthenticationService } from '../services/auth/IAuthenticationService';
import { inject } from '@angular/core';

export const isRoleGuard: CanMatchFn = (route, segments) => {
  return true;
};


export const roleIs = (rol:string) : boolean =>{
  return inject(IAuthenticationService).rol() === rol;
}
