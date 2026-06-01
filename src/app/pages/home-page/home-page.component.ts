import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrendGarment } from '../../interfaces/trend-garment.interface';
import { FashionWeek } from '../../interfaces/fashion-week.interface';
import { TrendCardComponent } from '../../components/trend-card/trend-card.component';
import { FashionWeekCardComponent } from '../../components/fashion-week-card/fashion-week-card.component';

@Component({
  selector: 'app-home-page',
  imports: [TrendCardComponent, FashionWeekCardComponent, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  public trendingGarments = signal<TrendGarment[]>([
    {
      name: 'Cinturón de lazo',
      type: 'Cinturón',
      style: 'Casual chic',
      trendScore: 96,
      image: '/images/belt-1.jpg',
    },
    {
      name: 'Pantalón con diamantes',
      type: 'Pantalón',
      style: 'Creativo',
      trendScore: 93,
      image: '/images/pants-1.jpg',
    },
    {
      name: 'Falda de lentejuelas',
      type: 'Falda',
      style: 'Seductor',
      trendScore: 91,
      image: '/images/skirt-1.jpg',
    },
    {
      name: 'Ballet flats sneakers',
      type: 'Zapatilla',
      style: 'Trendy',
      trendScore: 88,
      image: '/images/shoes-1.jpg',
    },
  ]);

  public fashionWeeks = signal<FashionWeek[]>([
    {
      name: 'Paris Fashion Week',
      season: 'SS 2026',
      city: 'París, Francia',
      showCount: 92,
      image: '/images/paris.jpg',
    },
    {
      name: 'Milan Fashion Week',
      season: 'FW 2025',
      city: 'Milán, Italia',
      showCount: 78,
      image: '/images/milan.jpg',
    },
    {
      name: 'New York Fashion Week',
      season: 'SS 2026',
      city: 'Nueva York, EE.UU.',
      showCount: 85,
      image: '/images/ny.jpg',
    },
    {
      name: 'Mexico Fashion Week',
      season: 'FW 2025',
      city: 'CDMX, México',
      showCount: 71,
      image: '/images/mexico.jpg',
    },
  ]);
}
