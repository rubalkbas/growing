import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TradingViewWidgetService {
  // Define un BehaviorSubject para cada propiedad que quieras actualizar
  private symbolSource = new BehaviorSubject<string>('AAPL');
  symbol$ = this.symbolSource.asObservable();

  private widthSource = new BehaviorSubject<string | number>('100%');
  width$ = this.widthSource.asObservable();

  private heightSource = new BehaviorSubject<string | number>(550);
  height$ = this.heightSource.asObservable();

  // Métodos para actualizar las propiedades
  updateSymbol(symbol: string) {
    this.symbolSource.next(symbol);
  }

  updateWidth(width: string | number) {
    this.widthSource.next(width);
  }

  updateHeight(height: string | number) {
    this.heightSource.next(height);
  }
}
