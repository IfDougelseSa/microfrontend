import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h1>Bem-vindo à Aplicação Principal!</h1>
      <p>Esta é a página inicial do Shell.</p>
      <p>Use a barra de navegação acima para acessar a <strong>Área de Estudos</strong>, que é um Micro-Frontend carregado sob demanda.</p>
    </div>
  `,
})
export class HomeComponent { }