import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router'; 
import { Sidenav, SideNavItem, Card, CardTitle } from 'shared-ui'; 
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryService } from '../../services/category';
import { Category } from '../../models/category.models';
import { MfeRouting } from '../../services/mfe-routing';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, Sidenav, Card, CardTitle],
  templateUrl: './study.html',
  styleUrls: ['./study.scss'],
})
export class Study implements OnInit, OnDestroy {
  navItems: SideNavItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    public routingService: MfeRouting
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.categoryService.onCategoriesUpdate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('Notificação recebida: Recarregando a lista de categorias na Sidenav.');
        this.loadCategories();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleItemDelete(event: { item: SideNavItem; parent: SideNavItem | null }): void {
    const { item, parent } = event;
    const confirmationMessage = parent
      ? `Tem certeza que deseja deletar a subcategoria "${item.label}"?`
      : `Tem certeza que deseja deletar a categoria "${item.label}" e todos os seus sub-níveis?`;

    if (window.confirm(confirmationMessage)) {
      if (parent) {
        this.categoryService.deleteSubcategory(parent.id, item.id).subscribe({
          next: () => this.handleDeleteSuccess(item.id),
          error: (err) => console.error('Erro ao deletar subcategoria:', err),
        });
      } else {
        this.categoryService.deleteRootCategory(item.id).subscribe({
          next: () => this.handleDeleteSuccess(item.id),
          error: (err) => console.error('Erro ao deletar categoria raiz:', err),
        });
      }
    }
  }

  private handleDeleteSuccess(deletedItemId: string): void {
    console.log(`Recurso ${deletedItemId} deletado com sucesso.`);
    if (this.router.url.includes(deletedItemId)) {
      this.router.navigate(['/']);
    }
  }
  
  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.navItems = this.mapCategoriesToSideNavItems(categories);
    });
  }

  private mapCategoriesToSideNavItems(categories: Category[]): SideNavItem[] {
    if (!categories) {
      return [];
    }

    return categories.map((category) => ({
      id: category.id,
      label: category.name,
      link: this.routingService.buildPath(['categories', category.id]),
        children: this.mapCategoriesToSideNavItems(category.subcategories),
      expanded: false,
    }));
}
}