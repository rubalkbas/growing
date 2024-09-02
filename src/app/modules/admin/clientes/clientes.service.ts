import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestModel } from 'app/modules/models/request';
import { environment } from 'environments/environment.desa';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ClienteService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    baseUrl = environment.basePathUrl;
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get('/app/mock-api/dashboards/finance').pipe(
            tap((response: any) =>
            {
                this._data.next(response);
            }),
        );
    }

    getUsuarios(): Observable<any> {
        return this._httpClient.get<any>(`${this.baseUrl}/usuarios/consultaUsuariosClientes`);
    }

    getDinero(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/dinero/consultaIngreso`,request);
    }
    postDinero(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/dinero/cargarIngreso`,request);
    }
    getCredito(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/dinero/consultaCredito`,request);
    }
    getCreditoPagados(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/dinero/consultaCreditoPagados`,request);
    }
    postCredito(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/dinero/cargarCredito`,request);
    }
    pagaCredito(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/dinero/pagoCredito`,request);
    }

    getRetirosSolicitados(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/dinero/consultaRetiroSolicitado`,request);
    }
    
    getRetirosEfectuados(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/dinero/consultaRetiroEfectuado`,request);
    }

    aprobarRetiro(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/dinero/apruebaRetiro`,request);
    }


    consultaCliente(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/usuarios/consultaUsuarioClienteID`,request);
    }

    actualizaCliente(request: any): Observable<any> {
        return this._httpClient.put<any>(`${this.baseUrl}/usuarios/actualiza-usuario`,request);
    }

    agregaCliente(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/auth/nuevo`,request);
    }


    consultaAbiertas(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/apuestaCliente/consultaApuestasAbiertasClienteID`,request);
    }

    consultaCerradas(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/apuestaCliente/consultaApuestasCerradasClienteID`,request);
    }

    cargarRetiro(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/dinero/cargarRetiro`,request);
    }

    consultaHistoricoApuestas(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/apuestaCliente/consultaApuestasHistoricoAbiertasClienteID`,request);
    }
    crearApuesta(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/apuestaCliente/crearApuestas`,request);
    }

    cerrarApuesta(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/apuestaCliente/cerrarApuesta`,request);
    }

    actualizaApuesta(request: any): Observable<any> {
        return this._httpClient.post<any>(`${this.baseUrl}/apuestaCliente/actualizarApuesta`,request);
    }
    
    

}
