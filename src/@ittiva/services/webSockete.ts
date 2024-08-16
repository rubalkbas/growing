import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
    private socket2$: WebSocketSubject<string>;

    private messagesSubject: Subject<any> = new Subject<any>();
    public messages$: Observable<any> = this.messagesSubject.asObservable();
  
    constructor() {
      this.connect();
    }
  
    private connect(): void {
      this.socket2$ = webSocket<string>('ws://localhost:8086/websocket');
  
      this.socket2$.subscribe(
        message => this.messagesSubject.next(message),
        err => console.error(err),
        () => console.log('WebSocket connection closed')
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
      }
    }
  
}
