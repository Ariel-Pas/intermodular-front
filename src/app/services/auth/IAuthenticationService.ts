import { Observable } from "rxjs";
import { ICredenciales } from "../../types";
import { signal } from "@angular/core";

export abstract class IAuthenticationService{

  public abstract login(user : string, password : string) : Observable<ICredenciales>;

  public abstract logout() : Observable<boolean>;

  public user = signal<string | null>(null);
  public rol = signal<string | null>(null);
  public token = signal<string | null>(null);
}
