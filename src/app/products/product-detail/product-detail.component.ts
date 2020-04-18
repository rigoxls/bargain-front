import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Params} from '@angular/router';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AuthService} from '../../account/shared/auth.service';
import {CartService} from '../../cart/shared/cart.service';
import {CartItem} from '../../models/cart-item.model';
import {ProductsCacheService} from '../shared/products-cache.service';
import {ProductService} from '../shared/product.service';

import {Product} from '../../models/product.model';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @Input() public product: Product;
  public productLoading: boolean;

  public user: User;

  public imagesLoaded: string[];
  public activeImageUrl: string;
  public activeImageIndex: number;

  public selectedQuantity: number;

  public ratingCount: number;
  public ratingValues: number[];
  public selectedRating: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private cartService: CartService,
    private productsCacheService: ProductsCacheService,
    private productService: ProductService,
  ) {
    try {
      this.user = JSON.parse(atob(localStorage.getItem('user')));
    } catch (e) {
      console.info(e);
    }
  }

  ngOnInit(): void {
    this.ratingValues = [1, 2, 3, 4, 5];
    this.selectedQuantity = 1;
    this.imagesLoaded = [];

    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: Params) => {
        this.getProduct();
      });
  }

  private async getProduct() {
    this.productLoading = true;

    const id = +this.route.snapshot.paramMap.get('id');
    this.product = await this.productService.getProduct(id);
    this.setupProduct();
    this.productLoading = false;

    if (!this.product) {
      this.router.navigate(['/404-product-not-found']);
    }
  }

  public onSelectThumbnail(event, index) {
    event.preventDefault();
    this.activeImageUrl = this.product.imageURLs[index];
    this.activeImageIndex = index;
  }

  public onAddToCart() {
    this.cartService.addItem(new CartItem(this.product, this.selectedQuantity));
  }

  public onSelectQuantity(event) {
    this.selectedQuantity = <number>+event.target.value;
  }

  public onImageLoad(e: any) {
    this.imagesLoaded.push(e.target.src);
  }

  private setupProduct() {
    if (this.product) {
      this.activeImageUrl = this.product.imageURLs[0];
      this.activeImageIndex = 0;
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
