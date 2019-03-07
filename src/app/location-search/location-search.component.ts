import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

export interface ILocationRequest {
  type: string;
  location: string;
}

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
  searchForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,
              private router: Router) {
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      location: ['']
    });
  }

  // validates location. Only City, State or Zip codes are valid values.
  validateForm(data): void {
    let request: ILocationRequest;

    // validates only if a value has been passed.
    if (data) {
      if (/^\d{5}$/.test(data.location)) {
        // checks whether location is a Zip code.
        request = {
          type: 'zip',
          location: data.location
        };
        this.goToDetails(request);
      } else if (/^[A-Za-z\s]{1,},\s\w{1}\s?\w?/g.test(data.location)) {
        // checks whether location is a City, State.
        request = {
          type: 'city',
          location: data.location
        };
        this.goToDetails(request);
      } else {
        this.errorMessage = 'Location must be a valid City, State (ex: Miami, FL) or Zip Code.';
      }
    } else {
      this.errorMessage = 'Location must be a valid City, State (ex: Miami, FL) or Zip Code.';
    }

  }

  // redirects user to Details screen.
  goToDetails(request: ILocationRequest): void {
    if (request.type && request.location) {
      this.router.navigate(['/detail', request.type, request.location]);
    }
  }

  // Error message is reset when location textbox is modifed.
  resetErrorMessage(): void {
    this.errorMessage = '';
  }
}
