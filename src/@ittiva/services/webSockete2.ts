import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment.desa';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService2 {

    private socket2$: WebSocketSubject<string>;

    environment

    private messagesSubject: Subject<any> = new Subject<any>();
    public messages$: Observable<any> = this.messagesSubject.asObservable();

    baseUrl = environment.socket2;

    constructor() {
      this.connect();
    }
   
    private connect(): void {
      this.socket2$ = webSocket<string>(this.baseUrl);
  
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
