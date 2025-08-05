import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category';
import { Category, Content } from '../../models/category.models';
import { Observable, switchMap, tap } from 'rxjs';
import { MfeRouting } from '../../services/mfe-routing';
import { SafeHtmlPipe } from '../../pipes/safe-html-pipe';

@Component({
  selector: 'app-category-content',
  standalone: true,
  imports: [CommonModule, RouterModule, SafeHtmlPipe],
  templateUrl: './category-content.html',
  styleUrls: ['./category-content.scss'],
})
export class CategoryContent implements OnInit {
  category$: Observable<Category> | undefined;
  private currentCategoryId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    public routingService: MfeRouting
  ) {}

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory(): void {
    this.category$ = this.route.paramMap.pipe(

      tap((params) => {
        this.currentCategoryId = params.get('categoryId');
      }),
      switchMap((params) => {
        const categoryId = params.get('categoryId');
        if (categoryId) {
          return this.categoryService.getCategoryById(categoryId);
        }
        throw new Error('Category ID not found in route.');
      })
    );
  }

  onDeleteContent(categoryId: string, content: Content): void {
    const confirmation = window.confirm(
      `Tem certeza que deseja deletar o conteúdo "${content.title}"?`
    );

    if (confirmation) {
      this.categoryService.deleteContent(categoryId, content.id).subscribe({
        next: () => {
          console.log(`Conteúdo "${content.title}" deletado com sucesso.`);
          this.loadCategory();
        },
        error: (err) => {
          console.error('Erro ao deletar conteúdo:', err);
        },
      });
      console.log('Simulando deleção de conteúdo.');
      this.loadCategory();
    }
  }
}
