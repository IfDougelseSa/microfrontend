import { Component, ContentChild, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTitle } from './card-title'; 
import { CardFooter } from './card-footer';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Card implements AfterContentInit {
  @ContentChild(CardTitle) titleContent?: CardTitle;
  @ContentChild(CardFooter) footerContent?: CardFooter;
  
  hasHeader = false;
  hasFooter = false;

  ngAfterContentInit() {
    this.hasHeader = !!this.titleContent;
    this.hasFooter = !!this.footerContent;
  }
}