import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyTickerComponent } from './currency-ticker.component';

describe('CurrencyTickerComponent', () => {
  let component: CurrencyTickerComponent;
  let fixture: ComponentFixture<CurrencyTickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyTickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
