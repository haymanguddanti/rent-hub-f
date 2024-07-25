import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingsService } from '../listings.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.css',
})
export class ListingComponent implements OnInit {
  listing: any;
  amenities: number[] = [];
  amenityList = [
    'Gym/Fitness Center',
    'Power Backup',
    'Plant Security System',
    'Swimming Pool',
    'Garbage Disposal',
    'Laundry Service',
    'Car Park',
    'Private Lawn',
    'Elevator',
    'Visitors Parking',
    'Water Heater',
    'Club House',
  ];
  featureImages: string[] = [];
  comment: string = '';
  constructor(
    private route: ActivatedRoute,
    private listingsService: ListingsService,
    private router: Router,
    private userService: UserService
  ) {}
  ngOnInit() {
    this.loadListing();
  }

  loadListing() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.listingsService.getListingDetails(parseInt(id)).subscribe((data) => {
        this.listing = data.filter((listing) => listing.id === id)[0];
        if (!this.listing) this.router.navigate(['/home']);
        // this.amenities = this.listing.Amenities;
        this.featureImages = [];
        if (this.listing.imageUrl1)
          this.featureImages.push(this.listing.imageUrl1);

        if (this.listing.imageUrl2)
          this.featureImages.push(this.listing.imageUrl2);

        if (this.listing.imageUrl3)
          this.featureImages.push(this.listing.imageUrl3);

        if (this.listing.imageUrl4)
          this.featureImages.push(this.listing.imageUrl4);
        this.amenities = [];
        if (this.listing.gym) this.amenities.push(1);
        if (this.listing.PowerBackup) this.amenities.push(2);
        if (this.listing.PlantSecuritySystem) this.amenities.push(2);
        if (this.listing.SwimmingPool) this.amenities.push(3);
        if (this.listing.GarbageDisposal) this.amenities.push(4);
        if (this.listing.LaundryService) this.amenities.push(5);
        if (this.listing.CarPark) this.amenities.push(6);
        if (this.listing.PrivateLawn) this.amenities.push(7);
        if (this.listing.Elevator) this.amenities.push(8);
        if (this.listing.VisitorsParking) this.amenities.push(9);
        if (this.listing.WaterHeater) this.amenities.push(10);
        if (this.listing.ClubHouse) this.amenities.push(11);
      });
    }
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

  postComment() {
    const userId = JSON.parse(localStorage.getItem('user') ?? '{}').id;
    const listingId = this.route.snapshot.paramMap.get('id') ?? '';
    this.listingsService
      .addComment(listingId, userId, this.comment)
      .subscribe((updatedListing) => {
        console.log(updatedListing);
        this.loadListing();
        this.comment = '';
      });
  }
}
