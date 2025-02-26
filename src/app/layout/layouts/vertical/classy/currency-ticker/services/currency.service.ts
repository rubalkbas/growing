import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Currency {
  code: string;
  symbol: string;
  rate_per_usd: number;
  as_of: string;
  value?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiUrl = 'https://api.appnexus.com/currency';

  constructor(private http: HttpClient) {}

  // Método para obtener el valor de una moneda
  getCurrencyRate(code: string): Observable<Currency> {
    const url = `${this.apiUrl}?show_rate=true&code=${code}`;
    return this.http.get<any>(url).pipe(
      map((response) => ({
        code: response.response.currency.code,
        symbol: response.response.currency.symbol,
        rate_per_usd: response.response.currency.rate_per_usd,
        as_of: response.response.currency.as_of,
      }))
    );
  }

  // Método para obtener los valores de varias monedas
  getCurrencyRates(codes: string[]): Observable<Currency[]> {
    const requests = codes.map((code) => this.getCurrencyRate(code));
    return forkJoin(requests); // Ejecuta todas las solicitudes en paralelo
  }
}