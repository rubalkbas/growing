export interface Proyecto {
    idProyecto?: number;
    nombre: string;
    descripcion: string;
    fecha: string;
    estatus: number;
    idResponsableProyecto: number | string;
}
