import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponentComponent } from '../products-component/products-component.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, ProductsComponentComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  animate: boolean = false;
  ngOnInit(): void {
    setTimeout(() => {
      this.animate = true;
    }, 100);
  }
}
