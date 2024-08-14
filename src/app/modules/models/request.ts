export interface RequestModel {
    accion: string;
    dinero: number;
    estatusRetiro: number;
    fechaCreacion: string; // O puedes usar Date si prefieres manejarlo como un objeto de fecha
    idDinero: number;
    idUsuario: number;
    tipo: string;
  }