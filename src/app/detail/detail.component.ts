import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WeatherService} from '../service/weather.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  currentWeather: any = {};
  forecastWeather: any = {};
  locationNotFound: string = '';

  constructor(private activatedRoute: ActivatedRoute,
              private weatherService: WeatherService,
              private router: Router) {
  }

  ngOnInit() {
    // updates screen when location is changed.
    this.activatedRoute.params.subscribe(params => {
      // current and forecast weather are requested only if type and value have been passed.
      if (params.type && params.location) {
        this.getWeather('weather', 'imperial', params);
        this.getWeather('forecast', 'imperial', params);
      } else {
        // if no type and location have been passed, user is redirected to Home screen.
        this.router.navigate(['/home']);
      }
    });
  }

  // calls service to request data from endpoint.
  getWeather(mode, units, params): void {
    this.weatherService.getWeather(mode, units, params).subscribe(
      (weather) => {
        if (weather.mode === 'weather'){
          this.currentWeather = weather.data;
        } else if (weather.mode === 'forecast'){
          this.forecastWeather = weather.data;
        }
      },
      (e) => {
        this.currentWeather = null;
        this.forecastWeather = null;
        this.locationNotFound = 'Location not found.';
      });
  }

  // returns URL of description's icon.
  getDescriptionIcon(description): string {
    return `http://openweathermap.org/img/w/${description.icon}.png`;
  }

  refreshCurrentWeather(): void {
    this.getWeather('weather', 'imperial', this.activatedRoute.snapshot.params);
  }

  refreshForecastWeather(): void {
    this.getWeather('forecast', 'imperial', this.activatedRoute.snapshot.params);
  }

  // shows/hides details of each forecast.
  toggleForecastDetails(forecast): void {
    forecast.isOpen = !forecast.isOpen;
  }
}
