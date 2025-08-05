import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [

  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: 'study',
    loadChildren: () =>
      loadRemoteModule({
        remoteName: 'mfe-study-app',
        exposedModule: './routes',
      }).then((m) => m.routes),
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];