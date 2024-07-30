import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDTO } from 'app/mock-api/common/interfaces/response.interface';
import { environment } from 'environments/environment.desa';

@Injectable({
    providedIn: 'root',
})
export class ScrumboardBoardService {

    baseUrl = environment.basePathUrl;

    constructor(private http: HttpClient) {}



    /**
     * Consultar todas las plantillas
     */
    getPlantillaId(idPlantilla: number): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/estatusPlantilla/findByPlantillaId/${idPlantilla}`);
    }

    /**
     * Consultar todas las areas de atención de usuarios
     */
    getTareasProyecto(idProyecto: number): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/tarea/proyecto/${idProyecto}`);
    }

    /**
     * Crear area de atención de usuarios
     */
    createAreaAtencionUsuario(areaAtencionUsuario: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/area-atencion-usuarios/save`, areaAtencionUsuario);
    }

    updateEstatusPlantilla(idTarea: any, idEstatusPlantilla: number): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(
            `${this.baseUrl}/tarea/estatus-plantilla/${idTarea}?idEstatusPlantilla=${idEstatusPlantilla}`,
            {}  
        );
    }

}