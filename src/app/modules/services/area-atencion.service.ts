import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDTO } from 'app/mock-api/common/interfaces/response.interface';
import { environment } from 'environments/environment.desa';

@Injectable({
    providedIn: 'root',
})
export class AreaAtencionService {

    baseUrl = environment.basePathUrl;

    constructor(private http: HttpClient) {}

    /**
     * Consultar todas las areas de atención de usuarios
     */
    getAreasAtencionUsuarios(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/area-atencion`);
    }

}