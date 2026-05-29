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
      name: 'Blazer oversize',
      type: 'Chaqueta',
      style: 'Minimalista',
      trendScore: 96,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c726dae?w=400&h=500&fit=crop',
    },
    {
      name: 'Vestido midi satinado',
      type: 'Vestido',
      style: 'Elegante',
      trendScore: 93,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    },
    {
      name: 'Pantalón wide leg',
      type: 'Pantalón',
      style: 'Casual chic',
      trendScore: 91,
      image: 'https://images.unsplash.com/photo-1594633312681-425a7b956cc9?w=400&h=500&fit=crop',
    },
    {
      name: 'Bolso estructurado',
      type: 'Accesorio',
      style: 'Atemporal',
      trendScore: 88,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop',
    },
  ]);

  public fashionWeeks = signal<FashionWeek[]>([
    {
      name: 'Paris Fashion Week',
      season: 'SS 2026',
      city: 'París, Francia',
      showCount: 92,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=500&fit=crop',
    },
    {
      name: 'Milan Fashion Week',
      season: 'FW 2025',
      city: 'Milán, Italia',
      showCount: 78,
      image: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=400&h=500&fit=crop',
    },
    {
      name: 'New York Fashion Week',
      season: 'SS 2026',
      city: 'Nueva York, EE.UU.',
      showCount: 85,
      image: 'https://images.unsplash.com/photo-1496442226666-8d0d0ee62ea6?w=400&h=500&fit=crop',
    },
    {
      name: 'London Fashion Week',
      season: 'FW 2025',
      city: 'Londres, Reino Unido',
      showCount: 71,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=500&fit=crop',
    },
  ]);
}
