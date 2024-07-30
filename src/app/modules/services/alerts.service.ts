// alert.service.ts
import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    success(title: string, message: string): void {
        Swal.fire({
            title: title,
            text: message,
            icon: 'success',
        });
    }

    success2(title: string, message: string): Promise<any> {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: title,
                text: message,
                icon: 'success',
            }).then((result) => {
                if (
                    result.isConfirmed ||
                    result.dismiss === Swal.DismissReason.backdrop
                ) {
                    // Resolvemos la promesa cuando el usuario hace clic en Aceptar o cierra el cuadro de diálogo haciendo clic fuera de él
                    window.location.reload();
                } else {
                    // Rechazamos la promesa si el cuadro de diálogo se cierra de alguna otra manera
                    reject();
                }
            });
        });
    }

    error(title: string, message: string): void {
        Swal.fire({
            title: title,
            text: message,
            icon: 'error',
        });
    }

    warning(title: string, message: string): void {
        Swal.fire({
            title: title,
            text: message,
            icon: 'warning',
        });
    }

    confirm(title: string, message: string): Promise<boolean> {
        return Swal.fire({
            title: title,
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        }).then((result) => {
            return result.isConfirmed;
        });
    }

    prompt(title: string, inputLabel: string, inputPlaceholder: string): Promise<string> {
        return Swal.fire({
            title: title,
            input: 'text',
            inputLabel: inputLabel,
            inputPlaceholder: inputPlaceholder,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700',
                cancelButton: 'bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                return result.value;
            }
            return '';
        });
    }
}
