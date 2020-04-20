import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AuthService} from '../../account/shared/auth.service';
import {PagerService} from '../../pager/pager.service';
import {ProductsCacheService} from '../shared/products-cache.service';
import {ProductService} from '../shared/product.service';
import {UiService} from '../shared/ui.service';
import {SortPipe} from '../shared/sort.pipe';

import {Product} from '../../models/product.model';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-products',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  products: Product[];
  productsPaged: Product[];
  pager: any = {};
  user: User;
  productsLoading: boolean;
  currentPagingPage: number;

  constructor(
    private productService: ProductService,
    private productsCacheService: ProductsCacheService,
    private pagerService: PagerService,
    private sortPipe: SortPipe,
    private authService: AuthService,
    public uiService: UiService
  ) {
    try {
      this.user = JSON.parse(atob(localStorage.getItem('user')));
    } catch (e) {
      console.info(e);
    }
  }

  ngOnInit() {
    this.uiService.currentPagingPage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((page) => {
        this.currentPagingPage = page;
      });
    this.getProducts();
  }

  async getProducts() {
    this.productsLoading = true;
    this.products = await this.productService.getProducts();

    if (this.user && (this.user.role === 'PROVIDER' || this.user.role === 'EXTERNAL_PROVIDER')) {
      this.products = this.products.filter(prod => {
        return prod.userId === this.user.id;
      });
    }

    this.setPage(this.currentPagingPage);
    this.productsLoading = false;
  }

  onDisplayModeChange(mode: string, e: Event) {
    this.uiService.displayMode$.next(mode);
    e.preventDefault();
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.products.length, page, 8);
    this.productsPaged = this.products.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.uiService.currentPagingPage$.next(page);
  }

  onSort(sortBy: string) {
    this.sortPipe.transform(
      this.products,
      sortBy.replace(':reverse', ''),
      sortBy.endsWith(':reverse')
    );
    this.uiService.sorting$.next(sortBy);
    this.setPage(1);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
