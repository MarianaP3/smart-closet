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
      image: 'https://i.pinimg.com/736x/47/7c/fd/477cfdb9bd62db206393c8e0ed9abecf.jpg',
    },
    {
      name: 'Pantalón con diamantes',
      type: 'Pantalón',
      style: 'Creativo',
      trendScore: 93,
      image: 'https://i.pinimg.com/736x/9b/c1/86/9bc1861843a7d4ffd6a568b0a2eb48d9.jpg',
    },
    {
      name: 'Falda de lentejuelas',
      type: 'Falda',
      style: 'Seductor',
      trendScore: 91,
      image: 'https://i.pinimg.com/1200x/eb/78/0c/eb780c315d9a43e9ae2e522382141c67.jpg',
    },
    {
      name: 'Ballet flats sneakers',
      type: 'Zapatilla',
      style: 'Trendy',
      trendScore: 88,
      image: 'https://i.pinimg.com/736x/4d/cf/d7/4dcfd7e959ef3c11dd1976710b510346.jpg',
    },
  ]);

  public fashionWeeks = signal<FashionWeek[]>([
    {
      name: 'Paris Fashion Week',
      season: 'SS 2026',
      city: 'París, Francia',
      showCount: 92,
      image: 'https://i.pinimg.com/736x/a1/12/9b/a1129b1958123570452a1993affd139a.jpg',
    },
    {
      name: 'Milan Fashion Week',
      season: 'FW 2025',
      city: 'Milán, Italia',
      showCount: 78,
      image: 'https://i.pinimg.com/736x/5b/b7/d3/5bb7d31cd16e6d1b1753fc7ba071714d.jpg',
    },
    {
      name: 'New York Fashion Week',
      season: 'SS 2026',
      city: 'Nueva York, EE.UU.',
      showCount: 85,
      image: 'https://i.pinimg.com/736x/c7/c1/aa/c7c1aa9987996957cf4416df5e704b7d.jpg',
    },
    {
      name: 'Mexico Fashion Week',
      season: 'FW 2025',
      city: 'CDMX, México',
      showCount: 71,
      image: 'https://i.pinimg.com/736x/5a/36/0a/5a360ab2a453cfeea78dd675f72ee63b.jpg',
    },
  ]);
}
