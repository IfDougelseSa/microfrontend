import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface UiTab {
  id: string;
  title: string;
  disabled?: boolean;
  link?: string;
}

@Component({
  selector: 'app-navbar', 
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,        
    RouterLinkActive  
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class Navbar {

  @Input()
  tabs: UiTab[] = [];

  @Input()
  activeId: string | null = null;

  @Input()
  navStyle: 'tabs' | 'pills' = 'tabs';

  @Output()
  activeIdChange = new EventEmitter<string>();

  @Output()
  tabSelect = new EventEmitter<UiTab>();

  selectTab(tab: UiTab): void {
    if (!tab.disabled) {
      this.activeId = tab.id;
      this.activeIdChange.emit(tab.id);
      this.tabSelect.emit(tab); 
    }
  }
}