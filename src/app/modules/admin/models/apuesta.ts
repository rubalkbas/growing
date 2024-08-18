export class ApuestaRequest {
    bloqueCompra: string;
    compra: string;
    idUsuario: string;
    montoApuesta: number;
    tipoCompra: string;
    unidades: number;
    valorUnidad: number;
    variacion: number;
    estatusCompra: string;
    fechaCierre: string;  // También puedes usar `Date` si prefieres trabajar con objetos Date en lugar de cadenas ISO
    fechaCreacion: string;  // También puedes usar `Date` si prefieres trabajar con objetos Date en lugar de cadenas ISO
    gananciaPerdida: number;
    idApuestaCliente: number;
}