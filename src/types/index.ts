export type AppRole = 'customer' | 'restaurant' | 'admin';

export type OrderStatus =
  | 'placed'
  | 'payment_confirmed'
  | 'restaurant_accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'rider_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface UserAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  area: string;
  city: string;
  state: string;
  additionalDetails?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  savedAddresses: UserAddress[];
  role: AppRole;
  favoriteRestaurants: string[]; // Restaurant IDs
  favoriteDishes: string[]; // MenuItem IDs
  restaurantId?: string; // If role is restaurant
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  required: boolean;
  minSelect?: number;
  maxSelect?: number;
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isBestSeller?: boolean;
  isAvailable: boolean;
  spiceLevels?: ('Mild' | 'Medium' | 'Extra Spicy')[];
  customizationGroups?: CustomizationGroup[];
  prepTimeMinutes: number;
  calories?: number;
  tags?: string[];
}

export interface RestaurantReview {
  id: string;
  orderId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  dishName?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  cuisines: string[];
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  openingHours: string;
  address: string;
  area: string;
  city: string;
  isFeatured?: boolean;
  hasFreeDelivery?: boolean;
  discountBadge?: string;
}

export interface SelectedCustomization {
  groupId: string;
  groupTitle: string;
  selectedOptions: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface CartItem {
  cartItemId: string; // unique instance in cart
  item: MenuItem;
  restaurant: Restaurant;
  quantity: number;
  selectedSpice?: 'Mild' | 'Medium' | 'Extra Spicy';
  selectedCustomizations: SelectedCustomization[];
  specialInstructions?: string;
  unitTotalPrice: number; // base price + selected options
  totalPrice: number; // unitTotalPrice * quantity
}

export interface Cart {
  restaurant: Restaurant | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  appliedPromo?: PromoCode | null;
  finalTotal: number;
}

export interface PromoCode {
  code: string;
  description: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minimumOrder: number;
  maxDiscount?: number;
  isActive: boolean;
}

export interface RiderInfo {
  name: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  avatar: string;
  rating: number;
  currentLat?: number;
  currentLng?: number;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderReference: string; // e.g. CN-82914
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurant: Restaurant;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  deliveryAddress: UserAddress;
  deliveryInstructions?: string;
  paymentMethod: 'paystack' | 'flutterwave' | 'cash_on_delivery';
  paymentReference?: string;
  paymentStatus: 'pending' | 'verified' | 'failed' | 'cash_pending';
  orderStatus: OrderStatus;
  statusTimeline: OrderTimelineStep[];
  rider?: RiderInfo;
  estimatedDeliveryMinutes: number;
  createdAt: string;
  deliveredAt?: string;
  reviewed?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
  orderReference?: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  iconName: string;
  count: number;
  image?: string;
}
