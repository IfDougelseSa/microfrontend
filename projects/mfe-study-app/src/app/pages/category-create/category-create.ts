import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService, CategoryCreate as CategoryCreateDTO, CategoryUpdateDTO } from '../../services/category'; // Use o caminho correto
import { Observable } from 'rxjs';
import { Category } from '../../models/category.models';
import { MfeRouting } from '../../services/mfe-routing';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-create.html',
  styleUrls: ['./category-create.scss']
})
export class CategoryCreate implements OnInit {
  
  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  isSubmitting = false;
  parentId: string | null = null;
  pageTitle = 'Criar Nova Categoria';
  categoryIdToUpdate: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private routingService: MfeRouting
  ) {}

  ngOnInit(): void {
    const parentIdFromRoute = this.route.snapshot.paramMap.get('parentId');
    const idFromRoute = this.route.snapshot.paramMap.get('id');

    if (parentIdFromRoute) {
      this.parentId = parentIdFromRoute;
      this.pageTitle = 'Criar Nova Subcategoria';
    } else if (idFromRoute) {
      this.categoryIdToUpdate = idFromRoute;
      this.pageTitle = 'Editar Categoria';
      this.loadCategoryForEdit();
    } else {
      this.pageTitle = 'Criar Nova Categoria';
    }
  }
  
  private loadCategoryForEdit(): void {
    if (!this.categoryIdToUpdate) return;
    this.categoryService.getCategoryById(this.categoryIdToUpdate).subscribe(category => {
      this.categoryForm.patchValue({ name: category.name });
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    
    if (this.categoryIdToUpdate) {
      const updateData: CategoryUpdateDTO = { name: this.categoryForm.value.name || '' };
      this.categoryService.updateCategory(this.categoryIdToUpdate, updateData).subscribe({
        next: (updatedCategory) => {
          console.log('Categoria atualizada com sucesso!', updatedCategory);
          const path = this.routingService.buildPath(['categories', updatedCategory.id]);
          this.router.navigate(path);
        },
        error: (err) => {
          console.error('Erro ao atualizar categoria', err);
          this.isSubmitting = false;
        }
      });
    } else {
      const createData: CategoryCreateDTO = { name: this.categoryForm.value.name || '' };
      let createObservable: Observable<Category>;

      if (this.parentId) {
        createObservable = this.categoryService.createSubcategory(this.parentId, createData);
      } else {
        createObservable = this.categoryService.createRootCategory(createData);
      }

      createObservable.subscribe({
        next: (createdCategory) => {
          const targetId = this.parentId ? this.parentId : createdCategory.id;
          const path = this.routingService.buildPath(['categories', targetId]);
          console.log(path)
          this.router.navigate(path);
        },
        error: (err) => {
          console.error('Erro ao criar recurso', err);
          this.isSubmitting = false;
        }
      });
    }
  }
}