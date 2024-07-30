import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;
  private subject: Subject<MessageEvent>;

  constructor() {
    this.subject = new Subject<MessageEvent>();
  }

  public connect(url: string): Observable<MessageEvent> {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event: MessageEvent) => {
        
      this.subject.next(event);
    };

    this.socket.onerror = (event: Event) => {
      console.error('WebSocket error observed:', event);
    };

    return this.subject.asObservable();
  }

  public send(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
        console.log('WebSocket :', JSON.stringify(message));
      this.socket.send(JSON.stringify(message));
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
