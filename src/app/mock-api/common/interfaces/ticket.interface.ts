export interface Ticket {
    idTicket?: number;
    titulo: string;
    idProyecto: string;
    descripcion: string;
    idEstatusTicket: number;
    idUsuarioSolicitante: number;
    idUsuarioAsignado: number;
    fechaCreacion: string;
    categoria: string;
    prioridad?: string;
    idTiempoAtencion?: number;
    idAreaAtencion?: number;
}
