import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
    private socket$: WebSocketSubject<string>;

    private messagesSubject: Subject<string> = new Subject<string>();
    public messages$: Observable<string> = this.messagesSubject.asObservable();
  
    constructor() {
      this.connect();
    }
  
    private connect(): void {
      this.socket$ = webSocket<string>('ws://localhost:8086/websocket');
  
      this.socket$.subscribe(
        message => this.messagesSubject.next(message),
        err => console.error(err),
        () => console.log('WebSocket connection closed')
      );
    }
  
    public sendMessage(message: string): void {
      if (this.socket$) {
        this.socket$.next(message);
      }
    }
  
    public disconnect(): void {
      if (this.socket$) {
        this.socket$.complete();
      }
    }
  
}
