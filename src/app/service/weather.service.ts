import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private key: string = 'ff9ed7b68ab4286fdfd9b85bce03e255';

  constructor(private http: HttpClient) {
  }

  // calls endpoint to request data of current or forecast weather.
  getWeather(mode = '', units = 'imperial', params): Observable<any> {
    const urlBase: string = `http://api.openweathermap.org/data/2.5/${mode}?`;

    if (params.type === 'zip') {
      return this.http.get<any>(`${urlBase}zip=${params.location}&APPID=${this.key}&units=${units}`).pipe(
        map(data => {
          return {
            data: data,
            mode: mode
          };
        }),
        catchError(this.handleError)
      );
    } else if (params.type === 'city') {
      return this.http.get<any>(`${urlBase}q=${params.location.replace(/, /g, ',')},US&APPID=${this.key}&units=${units}`).pipe(
        map(data => {
          return {
            data: data,
            mode: mode
          };
        }),
        catchError(this.handleError)
      );
    }
  }

  handleError(e): any {
    return Observable.create(observer => observer.error(e));
  }
}
