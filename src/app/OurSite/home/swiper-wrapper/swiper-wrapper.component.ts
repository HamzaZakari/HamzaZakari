import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ServicesService} from '../../../AdminArea/services/services.service';
import {SwiperConfigInterface, SwiperPaginationInterface} from 'ngx-swiper-wrapper';
import {PackserviceService} from '../../packs/pack/packservice.service';
import {AuthservisesService} from '../../../AdminArea/authservises.service';
import {Router} from '@angular/router';
import {NgbCarousel, NgbSlideEvent, NgbSlideEventSource} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-swiper-wrapper',
  templateUrl: './swiper-wrapper.component.html',
  styleUrls: ['./swiper-wrapper.component.scss']
})
export class SwiperWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
Category: any[] = [];
Category1: any[] = [];
imagesS: {id_slider: number,images: any, product_id: number, cat_id: number, boutique_id: number, date: any}[] = [];
subs: Subscription;
public config: SwiperConfigInterface = { };
  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };
url;
classMa;
rowclass = 'row';
containerclass= null;
  pauseOnHover = true;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  paused = false;
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;
  constructor(private services: ServicesService, private pack: PackserviceService, private serv: AuthservisesService, private route: Router) { }

  ngOnInit(): void {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.subs = this.serv.getAllsliderimages().subscribe(data => {
      this.imagesS = data.data;
      // this.updateimages();
    })
    window.innerWidth > 900 ? this.classMa = 'col-12' : this.classMa = 'col-12';
    if(window.innerWidth > 900) {
      this.containerclass = 'container';
      this.rowclass = 'row';
    } else if( window.innerWidth < 900 && window.innerWidth > 670) {
      this.containerclass = 'container-fluid';
      this.rowclass = 'row';
    } else if(window.innerWidth < 670) {
      this.containerclass = '';
      this.rowclass = '';
    }
    this.getCategories();
  }
  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },
      speed: 500,
      effect: 'slide',
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        480: {
          slidesPerView: 1
        },
        600: {
          slidesPerView: 1,
        },
        960: {
          slidesPerView: 1,
        },
        1280: {
          slidesPerView: 1,
        },
        1500: {
          slidesPerView: 1,
        }
      }
    };
  }
  sliderroute(prod, cat, boutique_id) {
    if(prod !== 0) {
      this.route.navigate(['/product_detail', prod]);
    } else if(prod === 0 && cat !== 0) {
      this.route.navigate(['/products', boutique_id ,cat]);
    } else {
      return;
    }
  }
  getCategories() {
    this.pack.getAllCat();
    this.pack.observerCat().subscribe(data => {
      this.Category1 = data;
    })
  }
  scrollto() {
    window.scrollTo(0, 599);
  }
  urllls(id_boutique,cat_id) {
    this.route.navigate(['/products', id_boutique, cat_id]);
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
  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;

  }
  ngOnDestroy(): void {
    if(this.subs){
      this.subs.unsubscribe();
    }
  }

}
