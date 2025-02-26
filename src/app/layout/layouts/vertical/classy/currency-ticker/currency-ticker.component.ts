import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-currency-ticker',
  templateUrl: './currency-ticker.component.html',
  styleUrls: ['./currency-ticker.component.scss'],
  standalone   : true,
  imports: [CommonModule],
})
export class CurrencyTickerComponent implements OnInit {
  currencies = [
    { symbol: 'USD', rate: 1.0 },
    { symbol: 'EUR', rate: 0.85 },
    { symbol: 'GBP', rate: 0.75 },
    { symbol: 'JPY', rate: 110.0 },
    { symbol: 'AUD', rate: 1.35 },
    // Agrega más divisas según sea necesario
  ];

  constructor() { }

  ngOnInit(): void {
  }
}