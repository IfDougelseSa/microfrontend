import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadResponse {
  location: string;
}

@Injectable({
  providedIn: 'root'
} )
export class FileUploadService {

  private uploadUrl = 'http://localhost:8080/api/media/upload';

  constructor(private http: HttpClient ) { }

  upload(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<UploadResponse>(this.uploadUrl, formData );
  }
}
