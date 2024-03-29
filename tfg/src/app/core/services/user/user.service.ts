import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, Rol } from '../../clases/clases';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usuarioURL = 'http://localhost:8080/api/usuarios/';
  private usuarioURL1 = 'http://192.168.0.21:8080/api/usuarios/';

  constructor(private httpClient: HttpClient) { }

  public getUsuarios(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.usuarioURL1+'lista');
  }

  public getFamiliares(rol: number): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.usuarioURL1 + `lista/${rol}`);
  }

  public getPacientes(familiar: number): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.usuarioURL1 + `familiar/${familiar}`);
  }

  public editarUsuario(usuario: Usuario, id: number): Observable<any> {
    return this.httpClient.put<any>(this.usuarioURL1 + `actualizar/${id}`, usuario);
  }

  public borrar(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.usuarioURL1 + `borrar/${id}`);
  } 
}
