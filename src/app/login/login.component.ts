import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  token :string;
  profile :object;
  loggedIn :boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    if(localStorage.getItem('token') && localStorage.getItem('profile')) {
      this.token = localStorage.getItem('token');
      this.profile = JSON.parse(localStorage.getItem('profile'));
      this.loggedIn = true;
    }
  }

  private complete(code :string) {
    this.http.get(
      'https://3oulphkf10.execute-api.eu-central-1.amazonaws.com/prod/strava-auth/complete',
      {
        params: new HttpParams().set('code', code)
      }
    )
    .subscribe(
      data => {
        console.log(data);
        this.token = data.access_token;
        this.profile = data.athlete;
        localStorage.setItem('token', this.token);
        localStorage.setItem('profile', JSON.stringify(this.profile));
        this.loggedIn = true;
      },
      err => {
        console.error(err);
      }
    )
  }

  ngOnInit() {
    if(!this.loggedIn) {
      let code :string = this.route.snapshot.queryParams["code"];
      this.complete(code);
    }
  }

}
