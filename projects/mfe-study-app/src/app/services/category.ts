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

  // Usaremos um Subject para notificar outros componentes que a lista de categorias mudou
  private categoriesUpdated = new Subject<void>();
  
  constructor(private http: HttpClient) { }

  // Observable público para que outros componentes possam se inscrever nas atualizações
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

  /**
   * NOVO MÉTODO: Cria uma nova categoria raiz.
   */
  createRootCategory(categoryData: CategoryCreate): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, categoryData).pipe(
      map(response => response.data),
      // O operador 'tap' executa um efeito colateral sem modificar o fluxo
      tap(() => {
        // Notifica todos os 'ouvintes' que a lista de categorias foi atualizada
        this.categoriesUpdated.next();
      })
    );
  }
  
  createSubcategory(parentId: string, categoryData: CategoryCreate): Observable<Category> {
    // A URL agora é específica para o endpoint de subcategorias
    const url = `${this.apiUrl}/${parentId}/subcategories`;
    
    return this.http.post<ApiResponse<Category>>(url, categoryData).pipe(
      map(response => response.data),
      // Também notificamos que a árvore de categorias mudou
      tap(() => this.categoriesUpdated.next())
    );
  }

  addContentToCategory(categoryId: string, contentData: ContentCreateDTO): Observable<Content> {
    const url = `${this.apiUrl}/${categoryId}/contents`;
    
    return this.http.post<ApiResponse<Content>>(url, contentData).pipe(
      map(response => response.data)
      // Não precisamos notificar o 'categoriesUpdated' aqui,
      // pois a estrutura de categorias não mudou, apenas seu conteúdo interno.
      // A atualização será tratada pelo redirecionamento.
    );
  }

  updateCategory(categoryId: string, categoryData: CategoryUpdateDTO): Observable<Category> {
    const url = `${this.apiUrl}/${categoryId}`;
    
    // Usamos o método PUT para a atualização
    return this.http.put<ApiResponse<Category>>(url, categoryData).pipe(
      map(response => response.data),
      // Notificamos a Sidenav que uma categoria foi atualizada para que ela recarregue.
      tap(() => this.categoriesUpdated.next())
    );
  }

  updateContent(categoryId: string, contentId: string, contentData: ContentUpdateDTO): Observable<Content> {
    // Constrói a URL exata do endpoint da API
    const url = `${this.apiUrl}/${categoryId}/contents/${contentId}`;
    
    // Faz a requisição PUT, enviando os novos dados no corpo.
    return this.http.put<ApiResponse<Content>>(url, contentData).pipe(
      map(response => response.data)
    );
  }


  deleteRootCategory(categoryId: string): Observable<void> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.delete<ApiResponse<void>>(url).pipe(
      map(response => response.data),
      // Notifica a Sidenav para recarregar após a exclusão
      tap(() => this.categoriesUpdated.next())
    );
  }

  /**
   * NOVO MÉTODO: Deleta uma subcategoria.
   */
  deleteSubcategory(parentId: string, subcategoryId: string): Observable<void> {
    const url = `${this.apiUrl}/${parentId}/subcategories/${subcategoryId}`;
    return this.http.delete<ApiResponse<void>>(url).pipe(
      map(response => response.data),
      // Também notifica a Sidenav para recarregar
      tap(() => this.categoriesUpdated.next())
    );
  }

  deleteContent(categoryId: string, contentId: string): Observable<void> {
    const url = `${this.apiUrl}/${categoryId}/contents/${contentId}`;
    return this.http.delete<ApiResponse<void>>(url).pipe(
      map(response => undefined)
      // Nota: Não precisa do tap() aqui. A atualização da UI será feita
      // no próprio componente que chamou a exclusão, recarregando seus dados.
    );
  }
  // No futuro, você adicionaria aqui createSubcategory, createContent, etc.
}