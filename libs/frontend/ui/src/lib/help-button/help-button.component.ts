import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-help-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-button.component.html',
  styleUrls: ['./help-button.component.css']
})
export class HelpButtonComponent implements OnInit {
  isPopupOpen = false;
  helpContent = 'Default help content'; // Default content

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen for route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateHelpContent(this.router.url);
      }
    });
  }

  togglePopup() {
    console.log('Toggling popup');
    this.isPopupOpen = !this.isPopupOpen;
  }

  updateHelpContent(url: string) {
    // Change content based on the route
    if (url.includes('/home')) {
      this.helpContent = 'This is the help content for the Home page.';
    } else if (url.includes('/about')) {
      this.helpContent = 'This is the help content for the About page.';
    } else if (url.includes('/contact')) {
      this.helpContent = 'This is the help content for the Contact page.';
    } else {
      this.helpContent = 'Default help content for unknown pages.';
    }
  }
}
