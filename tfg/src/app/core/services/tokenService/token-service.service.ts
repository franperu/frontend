import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../authService/auth-service.service';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AutAuthorities';
const ID_KEY = 'IdUser';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor(private router: Router, private authService: AuthService ) { }

  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public setUserName(userName: string): void {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, userName);
  }

  public getUserName(): string {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  public setId(id: Number): void {
    window.sessionStorage.removeItem(ID_KEY);
    window.sessionStorage.setItem(ID_KEY, JSON.stringify(id));
    console.log(id);
    console.log(sessionStorage.getItem(ID_KEY));
  }

  public getId(): number {
    return Number(sessionStorage.getItem(ID_KEY));
  }

  public setIdUsuario(id: Number): void {
    window.sessionStorage.removeItem('ID_USUARIO');
    window.sessionStorage.setItem('ID_USUARIO', JSON.stringify(id));
  }

  public getIdUsuario(): number {
    return Number(sessionStorage.getItem('ID_USUARIO'));
  }

  public setAuthorities(authorities: string[]): void {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];
    if (sessionStorage.getItem(AUTHORITIES_KEY)) {
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        this.roles.push(authority.authority);
      });
    }
    return this.roles;
  }

  public logOut(): void {
    window.sessionStorage.clear();
    this.router.navigate(['login']);
  }

  public isLoggedIn(): boolean {
    return sessionStorage.getItem(TOKEN_KEY) !== null;
  }
}
