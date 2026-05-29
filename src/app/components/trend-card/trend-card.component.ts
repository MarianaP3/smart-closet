import { Component, input } from '@angular/core';
import { TrendGarment } from '../../interfaces/trend-garment.interface';

@Component({
  selector: 'app-trend-card',
  imports: [],
  templateUrl: './trend-card.component.html',
  styleUrl: './trend-card.component.css',
})
export class TrendCardComponent {
  trend = input.required<TrendGarment>();
}
