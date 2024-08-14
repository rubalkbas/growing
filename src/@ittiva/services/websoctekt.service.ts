// src/app/services/websocket-rxjs.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketRxjsService {
  private socket$: WebSocketSubject<any>;

  connect(url: string): void {
    this.socket$ = webSocket(url);
  }

  sendMessage(message: any): void {
    this.socket$.next(message);
  }

  onMessage(): Observable<any> {
    return this.socket$.asObservable();
  }

  close(): void {
    this.socket$.complete();
  }
}