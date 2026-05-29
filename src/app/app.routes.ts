import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { NewCountryPageComponent } from './pages/new-country-page/new-country-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent},
    { path: 'login', component: LoginPageComponent},
    { path: 'register', component: RegisterPageComponent},
    { path: 'about', component: AboutPageComponent},
    { path: 'contact', component: ContactPageComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'not-found', component: NotFoundPageComponent },
    { path: 'new-country', component: NewCountryPageComponent },
    { path: '**', redirectTo: '/not-found' }
];
