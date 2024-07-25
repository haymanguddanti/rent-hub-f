import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingsService } from '../listings.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  listing: any;
  amenities: number[] = [];
  furnishing = 'Furnishing';
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
  imagePath: any;
  url1: string | ArrayBuffer | null | undefined;
  url2: string | ArrayBuffer | null | undefined;
  url3: string | ArrayBuffer | null | undefined;
  url4: string | ArrayBuffer | null | undefined;
  message = '';

  listingForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private listingsService: ListingsService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.loadListing();
    this.listingForm = this.fb.group({
      ListingTitle: new FormControl('', [Validators.required]),
      ListingDescription: ['', Validators.required],
      sharedSpace: new FormControl(false),
      gym: new FormControl(false),
      PowerBackup: new FormControl(false),
      PlantSecuritySystem: new FormControl(false),
      SwimmingPool: new FormControl(false),
      GarbageDisposal: new FormControl(false),
      LaundryService: new FormControl(false),
      CarPark: new FormControl(false),
      PrivateLawn: new FormControl(false),
      Elevator: new FormControl(false),
      VisitorsParking: new FormControl(false),
      WaterHeater: new FormControl(false),
      ClubHouse: new FormControl(false),
      ListingRent: ['', Validators.required],
      ListingDeposit: ['', Validators.required],
      ListingSpace: ['', Validators.required],
      imageUrl1: ['', Validators.required],
      imageUrl2: [''],
      imageUrl3: [''],
      imageUrl4: [''],
      funrishing: ['', Validators.required],
      ListingLocation: ['', Validators.required],
      ListingUser: JSON.parse(localStorage.getItem('user') ?? '{}')?.id,
    });
  }
  loadListing() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.listingsService.getListingDetails(parseInt(id)).subscribe((data) => {
        this.listing = data.filter((listing) => listing.id === id)[0];
        console.log(this.listing.imageUrl1);
        this.listingForm
          .get('ListingTitle')
          ?.setValue(this.listing.ListingTitle);
        this.listingForm
          .get('ListingDescription')
          ?.setValue(this.listing.ListingDescription);
        this.listingForm.get('ListingRent')?.setValue(this.listing.ListingRent);
        this.listingForm
          .get('ListingDeposit')
          ?.setValue(this.listing.ListingDeposit);
        this.listingForm
          .get('ListingSpace')
          ?.setValue(this.listing.ListingSpace);
        this.listingForm
          .get('ListingLocation')
          ?.setValue(this.listing.ListingLocation);
        this.listingForm.get('gym')?.setValue(this.listing.gym);
        this.listingForm.get('PowerBackup')?.setValue(this.listing.PowerBackup);
        this.listingForm
          .get('PlantSecuritySystem')
          ?.setValue(this.listing.PlantSecuritySystem);
        this.listingForm
          .get('SwimmingPool')
          ?.setValue(this.listing.SwimmingPool);
        this.listingForm
          .get('GarbageDisposal')
          ?.setValue(this.listing.GarbageDisposal);
        this.listingForm
          .get('LaundryService')
          ?.setValue(this.listing.LaundryService);
        this.listingForm.get('CarPark')?.setValue(this.listing.CarPark);
        this.listingForm.get('PrivateLawn')?.setValue(this.listing.PrivateLawn);
        this.listingForm.get('Elevator')?.setValue(this.listing.Elevator);
        this.listingForm
          .get('VisitorsParking')
          ?.setValue(this.listing.VisitorsParking);
        this.listingForm.get('WaterHeater')?.setValue(this.listing.WaterHeater);
        this.listingForm.get('ClubHouse')?.setValue(this.listing.ClubHouse);
        this.furnishing =
          this.listing.funrishing === 1
            ? 'Unfurnished'
            : this.listing.funrishing === 2
            ? 'Semi Furnished'
            : 'Fully Furnished';
        this.url1 = this.listing.imageUrl1;
        this.url2 = this.listing.imageUrl2;
        this.url3 = this.listing.imageUrl3;
        this.url4 = this.listing.imageUrl4;
        this.listingForm.get('imageUrl1')?.setValue(this.url1);
        this.listingForm.get('imageUrl2')?.setValue(this.url2);
        this.listingForm.get('imageUrl3')?.setValue(this.url3);
        this.listingForm.get('imageUrl4')?.setValue(this.url4);
        this.listingForm.get('imageUrl4')?.setValue(this.url4);
        this.listingForm.get('funrishing')?.setValue(this.listing.furnishing);
      });
    }
  }
  modifyFurnishing(value: string) {
    this.furnishing = value;
    this.listingForm.get('funrishing')?.setValue(value);
  }
  onFileChanged(event: any, number: number) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (number === 1) this.url1 = reader.result;
        if (number === 2) this.url2 = reader.result;
        if (number === 3) this.url3 = reader.result;
        if (number === 4) this.url4 = reader.result;
        switch (number) {
          case 1:
            this.listingForm.get('imageUrl1')?.setValue(reader.result);
            break;
          case 2:
            this.listingForm.get('imageUrl2')?.setValue(reader.result);
            break;
          case 3:
            this.listingForm.get('imageUrl3')?.setValue(reader.result);
            break;
          case 4:
            this.listingForm.get('imageUrl4')?.setValue(reader.result);
            break;
        }
      };
    }
  }
  onPublish() {
    if (this.listingForm.valid) {
      this.listingsService
        .editListing(
          this.listingForm.value,
          this.route.snapshot.paramMap.get('id') ?? ''
        )
        .subscribe(
          (response) => {
            console.log('Listing created successfully!', response);
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Error adding listing:', error);
            this.message = 'Failed to add listing. Please try again.';
          }
        );
    } else {
      console.error('Form is invalid');
      console.log(this.listingForm);
    }
  }
}
