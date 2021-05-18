import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {AuthservisesService} from '../../AdminArea/authservises.service';

@Component({
  selector: 'app-homenav',
  templateUrl: './homenav.component.html',
  styleUrls: ['./homenav.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomenavComponent implements OnInit {
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  showNavigationArrows = false;
  showNavigationIndicators = false;
  images:{image: string, title: string, subtitle: string}[] = [];
  imagesS: {id_banner: number,images: any, date: any}[] = [];
  subs: Subscription;
  showbande = false;
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
  constructor(config: NgbCarouselConfig, private serv:AuthservisesService) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit() {
    this.showbande = true;
    this.subs = this.serv.getAllbannerimages().subscribe(data => {
      this.imagesS = data.data;
      this.showbande = false;
      if(!this.imagesS) {
        this.showbande = true;
      }else{
        this.showbande = false;
      }

    })
  }
  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }
  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }
}
