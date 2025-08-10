// src/app/components/content-create/content-create.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService, ContentCreateDTO } from '../../services/category';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { FileUploadService } from '../../services/fileupload.service';

@Component({
  selector: 'app-content-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorComponent],
  templateUrl: './content-create.html',
  styleUrls: ['./content-create.scss']
})
export class ContentCreateComponent implements OnInit {

  contentForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    body: new FormControl('', [Validators.required])
  });

  isSubmitting = false;
  categoryId: string | null = null;

  editorConfig = {
    height: 500,
    plugins: 'lists link image media table code codesample help wordcount advlist autolink',
    toolbar: 'undo redo | bold italic underline | bullist numlist | link image media | alignleft aligncenter alignright | code',
    
    file_picker_types: 'image media',
    
    file_picker_callback: (cb: (url: string, meta: { title: string }) => void, value: any, meta: any) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      
      let accept = 'image/*';
      if (meta.filetype === 'media') {
        accept = 'video/*,audio/*';
      }
      input.setAttribute('accept', accept);

      input.onchange = () => {
        const file = input.files ? input.files[0] : null;

        if (file) {
          this.uploadService.upload(file).subscribe({
            next: (response) => {
              cb(response.location, { title: file.name });
            },
            error: (err) => {
              console.error('Falha no upload:', err);
            }
          });
        }
      };
      input.click();
    },
  };
  
  constructor(
    public categoryService: CategoryService,
    public router: Router,
    public route: ActivatedRoute,
    private uploadService: FileUploadService 
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (!this.categoryId) {
      console.error("ID da Categoria não encontrado na rota!");
      this.router.navigate(['/']);
    }
  }


  onSubmit(): void {
    if (this.contentForm.invalid || !this.categoryId) {
      return;
    }

    this.isSubmitting = true;
    const contentData: ContentCreateDTO = {
      title: this.contentForm.value.title || '',
      body: this.contentForm.value.body || '' 
    };

    this.categoryService.addContentToCategory(this.categoryId, contentData).subscribe({
      next: (createdContent) => {
        console.log('Conteúdo criado com sucesso!', createdContent);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Erro ao criar conteúdo', err);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
