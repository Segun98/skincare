export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Users = {
  __typename?: 'users';
  id?: Maybe<Scalars['ID']>;
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  confirm_password?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  pending?: Maybe<Scalars['String']>;
  online?: Maybe<Scalars['String']>;
  business_name?: Maybe<Scalars['String']>;
  business_name_slug?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  business_image?: Maybe<Scalars['String']>;
  business_bio?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['String']>;
  completed_qty?: Maybe<Scalars['Int']>;
};

export type UsersRes = {
  __typename?: 'usersRes';
  id?: Maybe<Scalars['ID']>;
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  pending?: Maybe<Scalars['String']>;
  online?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  business_name?: Maybe<Scalars['String']>;
  business_name_slug?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  business_image?: Maybe<Scalars['String']>;
  business_bio?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['String']>;
  completed_qty?: Maybe<Scalars['Int']>;
  jwt_user_id?: Maybe<Scalars['String']>;
  views?: Maybe<Scalars['Int']>;
  usersProducts?: Maybe<Array<Maybe<ProductsRes>>>;
  customerOrders?: Maybe<Array<Maybe<Orders>>>;
  homeProducts?: Maybe<Array<Maybe<ProductsRes>>>;
};

export type LoginRes = {
  __typename?: 'loginRes';
  refreshtoken?: Maybe<Scalars['String']>;
  accesstoken?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  pending?: Maybe<Scalars['String']>;
};

export type CustomRes = {
  __typename?: 'customRes';
  message?: Maybe<Scalars['String']>;
};

export type Products = {
  __typename?: 'products';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  name_slug?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Int']>;
  category?: Maybe<Array<Maybe<Scalars['String']>>>;
  main_category?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  in_stock?: Maybe<Scalars['String']>;
  creator_id?: Maybe<Scalars['String']>;
  available_qty?: Maybe<Scalars['Int']>;
  featured?: Maybe<Scalars['String']>;
};

export type ProductsRes = {
  __typename?: 'productsRes';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  name_slug?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Int']>;
  category?: Maybe<Array<Maybe<Scalars['String']>>>;
  main_category?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  in_stock?: Maybe<Scalars['String']>;
  creator_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  available_qty?: Maybe<Scalars['Int']>;
  featured?: Maybe<Scalars['String']>;
  creator?: Maybe<UsersRes>;
  related?: Maybe<Array<Maybe<ProductsRes>>>;
};

export type Cart = {
  __typename?: 'cart';
  id?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
  product_id?: Maybe<Scalars['ID']>;
  prod_creator_id?: Maybe<Scalars['ID']>;
  customer_id?: Maybe<Scalars['ID']>;
  created_at?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['ID']>;
  product?: Maybe<ProductsRes>;
  productCreator?: Maybe<UsersRes>;
};

export type Orders = {
  __typename?: 'orders';
  order_id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
  subtotal?: Maybe<Scalars['Int']>;
  request?: Maybe<Scalars['String']>;
  customer_email?: Maybe<Scalars['String']>;
  vendor_email?: Maybe<Scalars['String']>;
  customer_phone?: Maybe<Scalars['String']>;
  vendor_phone?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  product_id?: Maybe<Scalars['ID']>;
  customer_id?: Maybe<Scalars['ID']>;
  prod_creator_id?: Maybe<Scalars['ID']>;
  created_at?: Maybe<Scalars['String']>;
  orderStatus?: Maybe<Order_Status>;
};

export type Order_Status = {
  __typename?: 'order_status';
  id?: Maybe<Scalars['ID']>;
  order_id?: Maybe<Scalars['ID']>;
  transaction_id?: Maybe<Scalars['ID']>;
  delivery_fee?: Maybe<Scalars['Int']>;
  total_price?: Maybe<Scalars['Int']>;
  delivered?: Maybe<Scalars['String']>;
  in_transit?: Maybe<Scalars['String']>;
  canceled?: Maybe<Scalars['String']>;
  canceled_reason?: Maybe<Scalars['String']>;
  refund?: Maybe<Scalars['String']>;
  paid?: Maybe<Scalars['String']>;
  delivery_date?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
};

export type IdRes = {
  __typename?: 'idRes';
  id?: Maybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  users?: Maybe<Array<Maybe<UsersRes>>>;
  user?: Maybe<UsersRes>;
  getStores?: Maybe<Array<Maybe<UsersRes>>>;
  homeStores?: Maybe<Array<Maybe<UsersRes>>>;
  getUser?: Maybe<UsersRes>;
  customerProfile?: Maybe<UsersRes>;
  editUserPage?: Maybe<UsersRes>;
  featuredProducts?: Maybe<Array<Maybe<ProductsRes>>>;
  product?: Maybe<ProductsRes>;
  search?: Maybe<Array<Maybe<ProductsRes>>>;
  byCategory?: Maybe<Array<Maybe<ProductsRes>>>;
  mainCategory?: Maybe<Array<Maybe<ProductsRes>>>;
  editProductPage?: Maybe<ProductsRes>;
  getCartItems?: Maybe<Array<Maybe<Cart>>>;
  getCustomerOrders?: Maybe<Array<Maybe<Orders>>>;
  getVendorOrders?: Maybe<Array<Maybe<Orders>>>;
  getOrder?: Maybe<Array<Maybe<Orders>>>;
  getAllOrders?: Maybe<Array<Maybe<Orders>>>;
  getOrderStatus?: Maybe<Array<Maybe<Order_Status>>>;
  products?: Maybe<Array<Maybe<ProductsRes>>>;
  withdrawals?: Maybe<CustomRes>;
};


export type QueryUserArgs = {
  business_name_slug: Scalars['String'];
};


export type QueryGetStoresArgs = {
  query?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryEditUserPageArgs = {
  id: Scalars['ID'];
};


export type QueryFeaturedProductsArgs = {
  limit?: Maybe<Scalars['Int']>;
};


export type QueryProductArgs = {
  name_slug: Scalars['String'];
};


export type QuerySearchArgs = {
  query: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['String']>;
};


export type QueryByCategoryArgs = {
  category: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryMainCategoryArgs = {
  main_category?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryEditProductPageArgs = {
  id: Scalars['ID'];
};


export type QueryGetCartItemsArgs = {
  customer_id?: Maybe<Scalars['ID']>;
  user_id?: Maybe<Scalars['ID']>;
  prod_creator_id?: Maybe<Scalars['ID']>;
};


export type QueryGetVendorOrdersArgs = {
  limit?: Maybe<Scalars['Int']>;
};


export type QueryGetOrderArgs = {
  order_id: Scalars['ID'];
};


export type QueryProductsArgs = {
  limit?: Maybe<Scalars['Int']>;
};


export type QueryWithdrawalsArgs = {
  user_id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  signUp?: Maybe<CustomRes>;
  logIn?: Maybe<LoginRes>;
  updateProfile?: Maybe<CustomRes>;
  addProduct?: Maybe<CustomRes>;
  updateProduct?: Maybe<CustomRes>;
  deleteProduct?: Maybe<CustomRes>;
  updateQuantity?: Maybe<CustomRes>;
  addToCart?: Maybe<CustomRes>;
  deleteFromCart?: Maybe<CustomRes>;
  deleteAllFromCart?: Maybe<CustomRes>;
  updateCart?: Maybe<CustomRes>;
  createOrder?: Maybe<CustomRes>;
  updateOrder?: Maybe<CustomRes>;
  cancelOrder?: Maybe<CustomRes>;
  setUserStatus?: Maybe<CustomRes>;
  setInTransit?: Maybe<CustomRes>;
  completeOrder?: Maybe<CustomRes>;
  cancelOrderAdmin?: Maybe<CustomRes>;
  updateCompleted?: Maybe<CustomRes>;
  setFeatured?: Maybe<CustomRes>;
  deleteProductAdmin?: Maybe<CustomRes>;
  setOutOfStock?: Maybe<CustomRes>;
  withdraw?: Maybe<CustomRes>;
};


export type MutationSignUpArgs = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  confirm_password: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  role: Scalars['String'];
  pending: Scalars['String'];
  business_name?: Maybe<Scalars['String']>;
  business_name_slug?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  business_image?: Maybe<Scalars['String']>;
  business_bio?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
};


export type MutationLogInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateProfileArgs = {
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  business_name?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  business_image?: Maybe<Scalars['String']>;
  business_bio?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
  online?: Maybe<Scalars['String']>;
};


export type MutationAddProductArgs = {
  name: Scalars['String'];
  name_slug: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  price: Scalars['Int'];
  category?: Maybe<Array<Maybe<Scalars['String']>>>;
  main_category?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  available_qty: Scalars['Int'];
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  price: Scalars['Int'];
  category?: Maybe<Array<Maybe<Scalars['String']>>>;
  main_category?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  available_qty?: Maybe<Scalars['Int']>;
  in_stock?: Maybe<Scalars['String']>;
  creator_id: Scalars['String'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID'];
  creator_id: Scalars['String'];
};


export type MutationUpdateQuantityArgs = {
  id: Scalars['ID'];
  qty_ordered?: Maybe<Scalars['Int']>;
};


export type MutationAddToCartArgs = {
  user_id?: Maybe<Scalars['ID']>;
  customer_id: Scalars['ID'];
  product_id: Scalars['ID'];
  prod_creator_id: Scalars['ID'];
  quantity?: Maybe<Scalars['Int']>;
};


export type MutationDeleteFromCartArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type MutationDeleteAllFromCartArgs = {
  customer_id: Scalars['ID'];
  user_id?: Maybe<Scalars['ID']>;
};


export type MutationUpdateCartArgs = {
  id?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
};


export type MutationCreateOrderArgs = {
  order_id: Scalars['ID'];
  name: Scalars['String'];
  price: Scalars['Int'];
  quantity?: Maybe<Scalars['Int']>;
  subtotal: Scalars['Int'];
  request?: Maybe<Scalars['String']>;
  customer_email?: Maybe<Scalars['String']>;
  vendor_email?: Maybe<Scalars['String']>;
  customer_phone?: Maybe<Scalars['String']>;
  vendor_phone?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
  business_address?: Maybe<Scalars['String']>;
  product_id: Scalars['ID'];
  prod_creator_id: Scalars['ID'];
};


export type MutationUpdateOrderArgs = {
  order_id: Scalars['ID'];
  transaction_id: Scalars['ID'];
  delivery_fee?: Maybe<Scalars['Int']>;
  total_price: Scalars['Int'];
};


export type MutationCancelOrderArgs = {
  order_id: Scalars['ID'];
  canceled_reason?: Maybe<Scalars['String']>;
};


export type MutationSetUserStatusArgs = {
  pending: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationSetInTransitArgs = {
  order_id: Scalars['ID'];
  email: Scalars['String'];
};


export type MutationCompleteOrderArgs = {
  order_id: Scalars['ID'];
};


export type MutationCancelOrderAdminArgs = {
  order_id: Scalars['ID'];
  canceled_reason?: Maybe<Scalars['String']>;
};


export type MutationUpdateCompletedArgs = {
  id: Scalars['ID'];
};


export type MutationSetFeaturedArgs = {
  id: Scalars['ID'];
  featured: Scalars['String'];
};


export type MutationDeleteProductAdminArgs = {
  id: Scalars['ID'];
};


export type MutationSetOutOfStockArgs = {
  id: Scalars['ID'];
  in_stock: Scalars['String'];
};


export type MutationWithdrawArgs = {
  user_id: Scalars['ID'];
  amount: Scalars['Int'];
  recipient: Scalars['String'];
  transfer_id: Scalars['String'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

