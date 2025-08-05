import { Routes } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; 
import { Home } from './pages/home/home';
import { Study } from './layout/study/study';
import { CategoryService } from './services/category';
import { CategoryContent } from './pages/category-content/category-content';
import { CategoryCreate } from './pages/category-create/category-create';
import { ContentCreateComponent } from './pages/content-create/content-create';
import { ContentEditComponent } from './pages/content-edit/content-edit';
import { MfeRouting } from './services/mfe-routing';

export const routes: Routes = [
    {
        path: '', 
        component: Study,
        providers: [
            provideHttpClient(withInterceptorsFromDi()),

            CategoryService,
            MfeRouting,
        ],
        children: [
            { path: '', component: Home, pathMatch: 'full' },
            { path: 'categories/new', component: CategoryCreate },
            { path: 'categories/:parentId/new-subcategory', component: CategoryCreate },
            { path: 'categories/:id/edit', component: CategoryCreate },
            { path: 'categories/:categoryId', component: CategoryContent },
            { path: 'categories/:categoryId/new-content', component: ContentCreateComponent },
            { path: 'categories/:categoryId/contents/:contentId/edit', component: ContentEditComponent },
        ]
    },
];