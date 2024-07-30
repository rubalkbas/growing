import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Ticket } from 'app/mock-api/common/interfaces/ticket.interface';
import { ResponseDTO } from 'app/mock-api/common/interfaces/response.interface';
import { environment } from 'environments/environment.desa';
import { RespuestaTicket } from 'app/mock-api/common/interfaces/comments.interface';


@Injectable({
    providedIn: 'root',
})
export class AreaAtencionService {

    baseUrl = environment.basePathUrl;

    constructor(private http: HttpClient) {}

  

    getAllAreas(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/area-atencion`);
    }

    consultaAreaPorId(id:any): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/area-atencion/` + id);
    }

    cambiarEstatusArea(id:any): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(`${this.baseUrl}/area-atencion/` + id,{});
    }

    asignAreaToUser(user: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/area-atencion-usuarios/save`, user);
    }

    getUsersByArea(id: number): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/area-atencion-usuarios/area-atencion/${id}`);
    }

    deleteAreaFromUser(id): Observable<ResponseDTO<any>> {
        return this.http.delete<ResponseDTO<any>>(`${this.baseUrl}/area-atencion-usuarios/delete/` + id );
    }

   

    /**
     * Create a new Area Atencion
     * @param AreaAtencion 
     */

    consultaAreaAtencion(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/area-atencion`);
    }

    createAreaAtencion(areaAtencion): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/area-atencion`, areaAtencion);
    }

    actualizaAreaAtencion(areaAtencion): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(`${this.baseUrl}/area-atencion`, areaAtencion);
    }

    eliminaAreaAtencion(id: number): Observable<ResponseDTO<any>> {
        return this.http.delete<ResponseDTO<any>>(`${this.baseUrl}/area-atencion/${id}`);
    }
}