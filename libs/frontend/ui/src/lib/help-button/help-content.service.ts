import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IHelpButton } from '@spellen-doos/shared/api';

@Injectable({
  providedIn: 'root',
})
export class HelpContentService {
  //TODO: Replace with actual API URL
  private apiUrl = 'http://localhost:3000/api/helpButton';
  // private apiUrl = 'http://localhost:3000/api/helpButton';  //IP voor computer/laptop met localhost API

  constructor(private http: HttpClient) {}
  getHelpContent(route: string): Observable<IHelpButton> {
    return this.http
      .get<{ results: IHelpButton }>(
        `${this.apiUrl}?route=${encodeURIComponent(route)}`
      )
      .pipe(
        map((response) => {
          if (!response.results) {
            throw new Error('No content found for the specified route');
          }
          return response.results;
        })
      );
  }

  getHelpContentMock(route: string): Observable<string> {
    return new Observable<string>((observer) => {
      observer.next(`
      <h1>Welcome to the Help Section</h1>
      <p>
        This help section is designed to assist you with navigating our application. Below are some common topics:
      </p>
      <h2>Getting Started</h2>
      <p>
        To get started, follow these steps:
      </p>
      <ol>
        <li>Log in to your account using your username and password.</li>
        <li>Navigate to the <strong>Dashboard</strong> to view your stats.</li>
        <li>
          Use the <em>Menu</em> to access different features.
        </li>
      </ol>
      <h2>Common Issues</h2>
      <ul>
        <li>
          <strong>Forgot Password:</strong> Use the 
          <a href="/reset-password" target="_blank">reset password</a> link on the login page.
        </li>
        <li>
          <strong>Page Not Loading:</strong> Ensure you have a stable internet connection.
        </li>
      </ul>
      <h2>Additional Resources</h2>
      <p>
        For detailed guides, visit our 
        <a href="/documentation" target="_blank">documentation page</a>.
      </p>


      `);
      observer.complete();
    });
  }
}
