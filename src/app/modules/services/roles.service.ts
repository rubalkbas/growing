import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDTO } from 'app/mock-api/common/interfaces/response.interface';
import { environment } from 'environments/environment.desa';

@Injectable({
    providedIn: 'root',
})
export class RolesService {

    baseUrl = environment.basePathUrl;

    constructor(private http: HttpClient) {}

    /**
     * Get all roles
     * @returns ResponseDTO with all roles
     */
    getRoles(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/rol/getAll`);
    }

    /**
     * Create a new role
     * @param role 
     * @returns ResponseDTO with created role
     */
    createRole(role: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/rol/save`, role);
    }

    /**
     * Update status of a role
     * @param role
     * @returns ResponseDTO with updated role
     */
    updateRole(role: any): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(`${this.baseUrl}/rol/update`, role);
    }

    /**
     * Get users by role
     * @param id
     * @returns ResponseDTO with users by role
     */
    getUsersByRole(id: number): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/usuarios/usuarioRol/${id}`);
    }

    /**
     * Asign role to user
     * @param user 
     * @returns ResponseDTO with assigned role
     */
    asignRoleToUser(user: any): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(`${this.baseUrl}/usuarios/asignaRol`, user);
    }

    /**
     * Delete role from user
     * @param user 
     * @returns ResponseDTO with deleted role
     */
    deleteRoleFromUser(user: any): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(`${this.baseUrl}/usuarios/eliminarRol` , user);
    }

}