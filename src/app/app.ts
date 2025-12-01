import {Component, OnInit, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {RootComponent} from '../modules/root/root.component';
import {AuthService} from '../core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private authService: AuthService) {
    if (this.authService.isLogged()) {
      this.authService.redirect();
    }
  }
}
