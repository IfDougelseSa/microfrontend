import { Injectable } from '@angular/core';

@Injectable()
export class MfeRouting {

  

  buildPath(segments: any[]): any[] {
      return ['/study', ...segments];
    
 
  }
}