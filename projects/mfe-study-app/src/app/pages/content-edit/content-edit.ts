import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService, ContentUpdateDTO } from '../../services/category';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { FileUploadService } from '../../services/fileupload.service';

@Component({
  selector: 'app-content-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorComponent],
  templateUrl: './content-edit.html',
  styleUrls: ['./content-edit.scss']
})
export class ContentEditComponent implements OnInit {

  contentForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    body: new FormControl('', [Validators.required])
  });

  isSubmitting = false;
  categoryId: string | null = null;
  contentId: string | null = null;
  editorConfig = {
    height: 500,
    plugins: 'lists link image media table code codesample help wordcount advlist autolink',
    toolbar: 'undo redo | bold italic underline | bullist numlist | link image media | codesample | alignleft aligncenter alignright | code',
    
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
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private uploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');
    this.contentId = this.route.snapshot.paramMap.get('contentId');

    if (!this.categoryId || !this.contentId) {
      console.error("IDs de Categoria ou Conteúdo não encontrados na rota!");
      this.router.navigate(['/study']);
      return;
    }
    
    this.loadContentForEdit();
  }

  loadContentForEdit(): void {
    if (!this.categoryId) return;
    
    this.categoryService.getCategoryById(this.categoryId).subscribe(category => {
      const contentToEdit = category.contents.find(c => c.id === this.contentId);
      if (contentToEdit) {
        this.contentForm.patchValue({
          title: contentToEdit.title,
          body: contentToEdit.body
        });
      } else {
        console.error("Conteúdo não encontrado. Redirecionando.");
        this.router.navigate(['../../../'], { relativeTo: this.route });
      }
    });
  }

  onSubmit(): void {
    if (this.contentForm.invalid || !this.categoryId || !this.contentId) {
      return;
    }

    this.isSubmitting = true;
    
    const contentData: ContentUpdateDTO = {
      title: this.contentForm.value.title || undefined,
      body: this.contentForm.value.body || undefined
    };

    this.categoryService.updateContent(this.categoryId, this.contentId, contentData).subscribe({
      next: (updatedContent) => {
        console.log('Conteúdo atualizado com sucesso!', updatedContent);
        this.router.navigate(['../../../'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Erro ao atualizar conteúdo', err);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
