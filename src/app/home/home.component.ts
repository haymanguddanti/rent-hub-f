import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListingsService } from '../listings.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  listings: any[] = [];
  filteredListings: any[] = [];
  lowestRent: number = 0;
  highestRent: number = 0;
  locations: Set<string> = new Set();
  means: number[] = [];
  location: string = '';
  start: number = this.lowestRent;
  end: number = this.highestRent;
  featureImages: string[] = [];

  constructor(
    private listingsService: ListingsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getListings();
  }

  getListings() {
    this.listingsService.getListings().subscribe((data) => {
      this.listings = data;
      this.filteredListings = data;
      console.log(this.listings[0].ListingLocation);
      this.listings.forEach((listing) =>
        this.locations.add(listing.ListingLocation)
      );
      console.log(this.locations);
      if (this.listings[0].imageUrl1)
        this.featureImages.push(this.listings[0].imageUrl1);

      if (this.listings[0].imageUrl2)
        this.featureImages.push(this.listings[0].imageUrl2);

      if (this.listings[0].imageUrl3)
        this.featureImages.push(this.listings[0].imageUrl3);

      if (this.listings[0].imageUrl4)
        this.featureImages.push(this.listings[0].imageUrl4);
      this.getLeastAndHighestRent();
    });
  }

  handleLocationClick(location: string) {
    this.start = this.lowestRent;
    this.end = this.highestRent;
    if (location === '') this.filteredListings = this.listings;
    else
      this.filteredListings = this.listings.filter(
        (listing) =>
          // listing.ListingRent > this.start &&
          // listing.ListingRent <= this.end &&
          listing.ListingLocation === location
      );
    this.location = location;
  }

  handlePriceChange(start: number, end: number) {
    this.start = start;
    this.end = end;
    this.filteredListings = this.listings.filter(
      (listing) => listing.ListingRent >= start && listing.ListingRent <= end
    );
  }

  getLeastAndHighestRent() {
    this.lowestRent = this.listings.reduce((cheapestListing, currentListing) =>
      currentListing.ListingRent < cheapestListing.ListingRent
        ? currentListing
        : cheapestListing
    ).ListingRent;
    this.highestRent = this.listings.reduce((cheapestListing, currentListing) =>
      currentListing.ListingRent > cheapestListing.ListingRent
        ? currentListing
        : cheapestListing
    ).ListingRent;
    this.means.push(this.lowestRent);
    this.means[2] = (this.lowestRent + this.highestRent) / 2;
    this.means[1] = (this.lowestRent + this.means[2]) / 2;
    this.means[3] = (this.means[2] + this.highestRent) / 2;
    this.means[4] = this.highestRent;
    console.log(this.means);
  }

  isUserFav(listingID: number) {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    if (user.UserFavorites.indexOf(listingID) !== -1) return true;
    return false;
  }

  toggleFavorites(idToAdd: string) {
    const userId = JSON.parse(localStorage.getItem('user') ?? '{}').id;
    this.userService
      .addToFavorites(userId, idToAdd)
      .subscribe((updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      });
  }
}
