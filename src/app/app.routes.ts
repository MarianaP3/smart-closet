import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { NewGarmentPageComponent } from './pages/new-garment-page/new-garment-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { InventoryPageComponent } from './pages/inventory-page/inventory-page.component';
import { EditGarmentPageComponent } from './pages/edit-garment-page/edit-garment-page.component';
import { OutfitsGalleryPageComponent } from './pages/outfits-gallery-page/outfits-gallery-page.component';
import { NewOutfitPageComponent } from './pages/new-outfit-page/new-outfit-page.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent},
    { path: 'inventory', component: InventoryPageComponent},
    { path: 'inventory/:id', component: EditGarmentPageComponent},
    { path: 'outfits', component: OutfitsGalleryPageComponent},
    { path: 'new-outfit', component: NewOutfitPageComponent},
    { path: 'login', component: LoginPageComponent},
    { path: 'register', component: RegisterPageComponent},
    { path: 'about', component: AboutPageComponent},
    { path: 'contact', component: ContactPageComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'not-found', component: NotFoundPageComponent },
    { path: 'new-garment', component: NewGarmentPageComponent },
    { path: '**', redirectTo: '/not-found' }
];
