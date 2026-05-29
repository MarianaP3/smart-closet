import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FashionWeek } from '../../interfaces/fashion-week.interface';

@Component({
  selector: 'app-fashion-week-card',
  imports: [DecimalPipe],
  templateUrl: './fashion-week-card.component.html',
  styleUrl: './fashion-week-card.component.css',
})
export class FashionWeekCardComponent {
  fashionWeek = input.required<FashionWeek>();
}
