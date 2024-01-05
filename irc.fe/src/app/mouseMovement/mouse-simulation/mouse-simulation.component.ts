import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MouseMovementService } from '../mouse-movement.service';

@Component({
  selector: 'app-mouse-simulation',
  standalone: true,
  imports: [CommonModule],
  providers: [MouseMovementService],
  templateUrl: './mouse-simulation.component.html',
  styleUrl: './mouse-simulation.component.css',
})
export class MouseSimulationComponent implements OnInit {
  mouseMovements: any[] = [];

  constructor(private mouseMovementService: MouseMovementService) {}

  ngOnInit(): void {
    this.loadMouseMovements();
  }

  loadMouseMovements(): void {
    this.mouseMovementService.getMouseMovements().subscribe(
      (data) => {
        this.mouseMovements = data;
        this.startSimulation();
      },
      (error) => {
        console.error('Greška prilikom dobijanja podataka:', error);
      }
    );
  }

  startSimulation(): void {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    // const backgroundImage = new Image();
    // // canvas.width = window.innerWidth - 25;
    // // canvas.height = window.innerHeight;
    // backgroundImage.src = '../../../assets/2.2.png'; // Putanja do vaše slike
    // backgroundImage.onload = () => {
    //   canvas.width = backgroundImage.width;
    //   canvas.height = backgroundImage.height;
    //   // Ovde možete dodati logiku crtanja na canvas ako je potrebno
    // };
    // if (ctx) {
    //   this.animateMovements(ctx);
    // } else {
    //   console.error('Kontekst crtanja nije dobro definisan.');
    // }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width - 25;
      canvas.height = img.height;
      if (ctx) {
        this.animateMovements(ctx);
      } else {
        console.error('Kontekst crtanja nije dobro definisan.');
      }
    };

    img.src = '../../../assets/2.2.png';
  }

  animateMovements(ctx: CanvasRenderingContext2D): void {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.mouseMovements.length) {
        const movement = this.mouseMovements[index];
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Crtanje strelice
        ctx.beginPath();
        ctx.moveTo(movement.x, movement.y);
        ctx.lineTo(movement.x + 10, movement.y + 10);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Crtanje žutog kruga
        ctx.beginPath();
        ctx.arc(movement.x + 2, movement.y + 2, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();

        index++;
      } else {
        clearInterval(interval);
      }
    }, 10);
  }
}
