export interface ResponseDTO<T> {
    estatus?: string;
    mensaje?: string;
    lista?: T[];
    dto?: T;
    codError?: string;
}