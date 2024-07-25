import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interface for user data (replace with your actual user model)
interface User {
  id: number;
  Username: string;
  UserListings: number[];
  UserFavorites: number[];
  UserEmail: string;
  Password: string; // **DO NOT STORE PASSWORDS IN PLAIN TEXT**
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly usersUrl = 'https://rent-hub-one.vercel.app/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.get<User[]>(this.usersUrl).pipe(
      map((users) =>
        users.find(
          (user) =>
            user.UserEmail === email &&
            this.verifyPassword(password, user.Password)
        )
      ),
      map((user) => (user ? { ...user, Password: undefined } : null)),
      catchError(this.handleError)
    );
  }

  private verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): boolean {
    return plainPassword === hashedPassword;
  }

  private handleError(error: any) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
