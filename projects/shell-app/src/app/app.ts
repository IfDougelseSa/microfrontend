import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar, UiTab } from 'shared-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  
  mainTabs: UiTab[] = [
    { id: 'home', title: 'Início', link: '/home' },
    { id: 'study', title: 'Área de Estudos', link: '/study' },
    { id: 'reports', title: 'Relatórios', link: '/reports', disabled: true },
  ];
}