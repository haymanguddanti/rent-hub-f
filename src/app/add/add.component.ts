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
  templateUrl: './add.component.html',
  styleUrl: './add.component.css',
})
export class AddComponent {
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

  titlePlaceHolder: string = 'Title';

  constructor(
    private route: ActivatedRoute,
    private listingsService: ListingsService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
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

    this.listingForm.get('ListingTitle')?.valueChanges.subscribe((value) => {
      this.titlePlaceHolder = value ? 'Title' : 'Please enter a title';
    });
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
      this.listingsService.addListing(this.listingForm.value).subscribe(
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
    }
  }
}
