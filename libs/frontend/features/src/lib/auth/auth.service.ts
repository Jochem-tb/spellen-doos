import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<any> {
        const url = 'http://localhost:3000/api/auth/login';
        return this.http.post(url, { email, password });
    }
}