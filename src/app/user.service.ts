import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://rent-hub-one.vercel.app/users'; // URL to JSON server

  constructor(private http: HttpClient) {}

  addToFavorites(userId: string, favorite: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`).pipe(
      switchMap((user: any) => {
        const index = user.UserFavorites.indexOf(favorite);
        if (index > -1) {
          user.UserFavorites.splice(index, 1);
        } else {
          user.UserFavorites.push(favorite);
        }
        return this.http.put(`${this.apiUrl}/${userId}`, user);
      })
    );
  }
}
