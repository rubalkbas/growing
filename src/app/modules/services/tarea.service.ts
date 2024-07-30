import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { ResponseDTO } from 'app/mock-api/common/interfaces/response.interface';
import { environment } from 'environments/environment.desa';

@Injectable({
    providedIn: 'root',
})
export class TareaService {
    baseUrl = environment.basePathUrl;

    constructor(private http: HttpClient) {}

    /**
     * Get all proyects
     * @returns ResponseDTO<any> with all proyects
     */
    getPrioridades(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(
            `${this.baseUrl}/prioridad/findAll`
        );
    }

    getTareaPorId(id: any): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/tarea/` + id);
    }

    getArchivosPorIdTarea(id: any): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(
            `${this.baseUrl}/tarea-archivos/listar/` + id
        );
    }

    getSubtareaPorTarea(id: any): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(
            `${this.baseUrl}/subTarea/tarea/` + id
        );
    }

    saveTarea(tarea: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(
            `${this.baseUrl}/tarea/save`,
            tarea
        );
    }

    saveSubTarea(subTarea: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(
            `${this.baseUrl}/subTarea/save`,
            subTarea
        );
    }

    editarProgresoTarea(
        idtarea: any,
        progreso: any
    ): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(
            `${this.baseUrl}/tarea/progreso/${idtarea}?progreso=${progreso}`,
            null // Pasar `null` como cuerpo de la solicitud
        );
    }

    /**
     * Upload a file
     * @param fileData
     * @returns
     */
    uploadFile(fileData: any): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/tarea-archivos/agregar`,
            fileData
        );
    }

    /**
     * Save a user task
     * @param userTask 
     * @returns 
     */
    saveUserTask(userTask: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(
            `${this.baseUrl}/usuarios-tarea/save`,
            userTask
        );
    }

    /**
     * Delete a user task
     * @param id
     * @returns
     */
    deleteUserTask(id: any): Observable<ResponseDTO<any>> {
        return this.http.delete<ResponseDTO<any>>(
            `${this.baseUrl}/usuarios-tarea/${id}`
        );
    }

    /**
     * Get all user tasks
     * @returns
     */
    getUserTasks(idTarea: any): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(
            `${this.baseUrl}/usuarios-tarea/tarea/${idTarea}`
        );
    }

    eliminaDetalleTareas(idTarea: any): Observable<ResponseDTO<any>> {
        return this.http.delete<ResponseDTO<any>>(`${this.baseUrl}/detalle-tarea/${idTarea}`);
    }

    crearDetalleTareas(detalleTarea: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/detalle-tarea/save`, detalleTarea);
    }

    getDetalleTareas(idTarea: any): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/detalle-tarea/tarea/${idTarea}`);
    }

}
