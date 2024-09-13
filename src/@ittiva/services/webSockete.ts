import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject, timer ,of} from 'rxjs';
import { catchError, retryWhen, switchMap, delayWhen, tap, takeWhile } from 'rxjs/operators';
import { environment } from 'environments/environment.desa';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket2$: WebSocketSubject<string>;
  private messagesSubject: Subject<any> = new Subject<any>();
  public messages$: Observable<any> = this.messagesSubject.asObservable();
  baseUrl = environment.socket;

  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 5;  // Máximo número de intentos de reconexión
  private readonly reconnectDelay: number = 3000;     // Tiempo de espera entre intentos de reconexión (en ms)

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket2$ = webSocket<string>(this.baseUrl);

    this.socket2$.pipe(
      catchError(err => {
        console.error('Error en la conexión del WebSocket', err);
        throw err;
      }),
      retryWhen(errors =>
        errors.pipe(
          delayWhen(() => timer(this.reconnectDelay)),
          tap(() => {
            if (this.reconnectAttempts++ >= this.maxReconnectAttempts) {
              console.error('Máximo número de intentos de reconexión alcanzado');
              throw new Error('No se puede reconectar al WebSocket');
            }
          }),
          switchMap(() => {
            console.log(`Intento de reconexión... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            return of(this.connect());  // Retorna un observable para intentar la reconexión
          })
        )
      )
    ).subscribe(
      message => this.messagesSubject.next(message),
      err => {
        console.error('Error en el WebSocket:', err);
        this.reconnect();  // Intentar reconectar en caso de error
      },
      () => {
        console.log('Conexión del WebSocket cerrada');
        this.reconnect();  // Intentar reconectar cuando se cierra
      }
    );
  }

  public sendMessage(message: string): void {
    if (this.socket2$) {
      this.socket2$.next(message);
    }
  }

  public disconnect(): void {
    if (this.socket2$) {
      this.socket2$.complete();
      console.log('Conexión del WebSocket desconectada manualmente.');
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      console.log(`Intentando reconectar... Intento: ${this.reconnectAttempts + 1}`);
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.error('No se pudo reconectar después de varios intentos.');
    }
  }
}
