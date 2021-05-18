import {Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit , OnDestroy {
  title = 'Chia.ma';
  subs: Subscription;

   constructor(private route: Router) {}



  ngOnInit(): void {
     this.subs = this.route.events.pipe(filter(event => event instanceof NavigationEnd)).
       subscribe(()=> window.scroll(0,0));
  }

ngOnDestroy(): void {
this.subs.unsubscribe();
   }

}
