// src/app/services/websocket-rxjs.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketFondoService {
  private socketAcciones$: WebSocketSubject<any>;

  connect(url: string): void {
    this.socketAcciones$ = webSocket(url);
  }

  sendMessage(message: any): void {
    this.socketAcciones$.next(message);
  }

  onMessage(): Observable<any> {
    return this.socketAcciones$.asObservable();
  }

  close(): void {
    this.socketAcciones$.complete();
  }
}