import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; 
import { SideNavItem } from './sidenav.models'; 

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], 
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class Sidenav {

  @Input()
  items: SideNavItem[] = [];

  @Output()
  itemDelete = new EventEmitter<{ item: SideNavItem; parent: SideNavItem | null }>();

  private currentlyOpenItemId: string | null = null;

  toggleItem(item: SideNavItem, parent: SideNavItem | null): void {

    if (item.children && item.children.length > 0) {
      if (parent === null) {
        if (this.currentlyOpenItemId && this.currentlyOpenItemId !== item.id) {
          const lastOpenItem = this.findItemById(this.items, this.currentlyOpenItemId);
          if (lastOpenItem) {
            lastOpenItem.expanded = false;
          }
        }
      }

      item.expanded = !item.expanded;
      
      if (parent === null) {
        this.currentlyOpenItemId = item.expanded ? item.id : null;
      }
    }
  }

  onDeleteItemClick(item: SideNavItem, parent: SideNavItem | null, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.itemDelete.emit({ item, parent });
  }

  private findItemById(items: SideNavItem[], id: string): SideNavItem | null {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = this.findItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}