import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ListingsService {
  constructor(private http: HttpClient) {}

  getListingDetails(id: number) {
    return this.http.get<any[]>('https://rent-hub-one.vercel.app/listings');
  }

  getListings() {
    return this.http.get<any[]>('https://rent-hub-one.vercel.app/listings');
  }

  addListing(listing: any): Observable<any> {
    return this.http.post<any>('https://rent-hub-one.vercel.app/listings', listing);
  }

  editListing(listing: any, id: string): Observable<any> {
    return this.http.patch<any>('https://rent-hub-one.vercel.app/listings/' + id, listing);
  }

  addComment(listingId: string, userId: number, comment: string) {
    return this.http
      .get<any>(`https://rent-hub-one.vercel.app/listings/${listingId}`)
      .pipe(
        switchMap((listing) => {
          const updatedComments = [
            ...listing.comments,
            { user: userId, comment },
          ];
          return this.http.patch(
            `https://rent-hub-one.vercel.app/listings/${listingId}`,
            {
              comments: updatedComments,
            }
          );
        })
      );
  }
}
