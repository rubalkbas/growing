// src/app/services/websocket-rxjs.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketCriptoService {
  private socketCrypto$: WebSocketSubject<any>;

  connect(url: string): void {
    this.socketCrypto$ = webSocket(url);
  }

  sendMessage(message: any): void {
    this.socketCrypto$.next(message);
  }

  onMessage(): Observable<any> {
    return this.socketCrypto$.asObservable();
  }

  close(): void {
    this.socketCrypto$.complete();
  }
}