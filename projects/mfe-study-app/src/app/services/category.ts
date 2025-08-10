import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject, tap } from 'rxjs';
import { ApiResponse, Category, Content } from '../models/category.models';

export interface CategoryCreate {
  name: string;
}

export interface ContentCreateDTO {
  title: string;
  body: string;
}

export interface CategoryUpdateDTO {
  name: string;
}

export interface ContentUpdateDTO {
  title?: string;
  body?: string;
}


@Injectable()
export class CategoryService {
  private apiUrl = '/api/categories';

  private categoriesUpdated = new Subject<void>();
  
  constructor(private http: HttpClient) { }

  get onCategoriesUpdate$(): Observable<void> {
    return this.categoriesUpdated.asObservable();
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${categoryId}`).pipe(
      map(response => response.data)
    );
  }

  createRootCategory(categoryData: CategoryCreate): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, categoryData).pipe(
      map(response => response.data),

      tap(() => {
        this.categoriesUpdated.next();
      })
    );
  }
  
  createSubcategory(parentId: string, categoryData: CategoryCreate): Observable<Category> {
    const url = `${this.apiUrl}/${parentId}/subcategories`;
    
    return this.http.post<ApiResponse<Category>>(url, categoryData).pipe(
      map(response => response.data),
      tap(() => this.categoriesUpdated.next())
    );
  }

  addContentToCategory(categoryId: string, contentData: ContentCreateDTO): Observable<Content> {
    const url = `${this.apiUrl}/${categoryId}/contents`;
    
    return this.http.post<ApiResponse<Content>>(url, contentData).pipe(
      map(response => response.data)
    );
  }

  updateCategory(categoryId: string, categoryData: CategoryUpdateDTO): Observable<Category> {
    const url = `${this.apiUrl}/${categoryId}`;
    
    return this.http.put<ApiResponse<Category>>(url, categoryData).pipe(
      map(response => response.data),
      tap(() => this.categoriesUpdated.next())
    );
  }

  updateContent(categoryId: string, contentId: string, contentData: ContentUpdateDTO): Observable<Content> {
    const url = `${this.apiUrl}/${categoryId}/contents/${contentId}`;
    
    return this.http.put<ApiResponse<Content>>(url, contentData).pipe(
      map(response => response.data)
    );
  }


  deleteRootCategory(categoryId: string): Observable<void> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.delete<ApiResponse<void>>(url).pipe(
      map(response => response.data),
      tap(() => this.categoriesUpdated.next())
    );
  }

  deleteSubcategory(parentId: string, subcategoryId: string): Observable<void> {
    const url = `${this.apiUrl}/${parentId}/subcategories/${subcategoryId}`;
    return this.http.delete<ApiResponse<void>>(url).pipe(
      map(response => response.data),
      tap(() => this.categoriesUpdated.next())
    );
  }

  deleteContent(categoryId: string, contentId: string): Observable<void> {
    const url = `${this.apiUrl}/${categoryId}/contents/${contentId}`;
    return this.http.delete<ApiResponse<void>>(url).pipe(
      map(response => undefined)
    );
  }
}