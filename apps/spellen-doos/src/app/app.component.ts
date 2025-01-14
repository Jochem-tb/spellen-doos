import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'spellen-doos';

  isLandscape: boolean = true;

  constructor() {
    this.checkOrientation(); // Initial check
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkOrientation();
  }

  private checkOrientation() {
    this.isLandscape = window.innerWidth > window.innerHeight;
  }
}
