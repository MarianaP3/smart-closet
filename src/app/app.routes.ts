import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { NewGarmentPageComponent } from './pages/new-garment-page/new-garment-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { InventoryPageComponent } from './pages/inventory-page/inventory-page.component';
import { EditGarmentPageComponent } from './pages/edit-garment-page/edit-garment-page.component';
import { OutfitsGalleryPageComponent } from './pages/outfits-gallery-page/outfits-gallery-page.component';
import { NewOutfitPageComponent } from './pages/new-outfit-page/new-outfit-page.component';
import { EditOutfitPageComponent } from './pages/edit-outfit-page/edit-outfit-page.component';
import { ArmariosPageComponent } from './pages/armarios-page/armarios-page.component';
import { NewArmarioPageComponent } from './pages/new-armario-page/new-armario-page.component';
import { EditArmarioPageComponent } from './pages/edit-armario-page/edit-armario-page.component';
import { CategoriasPageComponent } from './pages/categorias-page/categorias-page.component';
import { NewCategoriaPageComponent } from './pages/new-categoria-page/new-categoria-page.component';
import { EditCategoriaPageComponent } from './pages/edit-categoria-page/edit-categoria-page.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent},
    { path: 'inventory', component: InventoryPageComponent},
    { path: 'inventory/:id', component: EditGarmentPageComponent},
    { path: 'outfits', component: OutfitsGalleryPageComponent},
    { path: 'outfits/:id', component: EditOutfitPageComponent},
    { path: 'new-outfit', component: NewOutfitPageComponent},
    { path: 'armarios', component: ArmariosPageComponent},
    { path: 'armarios/:id', component: EditArmarioPageComponent},
    { path: 'new-armario', component: NewArmarioPageComponent},
    { path: 'categorias', component: CategoriasPageComponent},
    { path: 'categorias/:id', component: EditCategoriaPageComponent},
    { path: 'new-categoria', component: NewCategoriaPageComponent},
    { path: 'login', component: LoginPageComponent},
    { path: 'register', component: RegisterPageComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'not-found', component: NotFoundPageComponent },
    { path: 'new-garment', component: NewGarmentPageComponent },
    { path: '**', redirectTo: '/not-found' }
];
