import { PRODUCT_PROVIDERS } from './constants';
import { Product } from './product.model';

export const productProviders = [
  {
    provide: PRODUCT_PROVIDERS,
    useValue: Product,
  },
];
