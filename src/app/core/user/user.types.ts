export interface User
{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    rol?:string;
    permisos?: any[];
}