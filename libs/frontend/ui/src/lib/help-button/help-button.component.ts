import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HelpContentService } from './help-content.service';

@Component({
  selector: 'app-help-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-button.component.html',
  styleUrls: ['./help-button.component.css'],
})
export class HelpButtonComponent implements OnInit {
  isPopupOpen = false;
  helpContent = 'Aan het laden...'; // Default content while loading
  title = 'Help'; // Default content while loading

  constructor(
    private router: Router,
    private helpContentService: HelpContentService
  ) {}

  ngOnInit() {
    // Listen for route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadHelpContent(this.router.url);
      }
    });
  }

  togglePopup() {
    console.log('Toggling popup');
    this.isPopupOpen = !this.isPopupOpen;
  }

  loadHelpContent(url: string) {
    this.helpContent = '<h5>Aan het laden...</h5>'; // Set loading state
    this.helpContentService.getHelpContent(url).subscribe({
      next: (results) => (
        (this.helpContent = results.content), (this.title = results.title)
      ),
      error: (err) => {
        console.error('Failed to load help content', err);
        this.helpContent =
          '<h3>Oeps.</h3><h5>Er is iets fout gegaan. Probeer het later nog een keer.</h5>';
        this.title = 'Help';
      },
    });
  }
}
