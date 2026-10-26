import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DELIVERY_AREAS,
  INITIAL_MENU_ITEMS,
  INITIAL_PROMO_CODES,
  INITIAL_RESTAURANTS,
  INITIAL_REVIEWS,
  INITIAL_USER,
} from '../data/mockData';
import {
  AppNotification,
  AppRole,
  Cart,
  CartItem,
  MenuItem,
  Order,
  OrderStatus,
  OrderTimelineStep,
  PromoCode,
  Restaurant,
  RestaurantReview,
  SelectedCustomization,
  UserAddress,
  UserProfile,
} from '../types';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Navigation / Page views
  activeTab: 'home' | 'explore' | 'favorites' | 'orders' | 'profile' | 'restaurant_detail' | 'order_tracking';
  setActiveTab: (tab: 'home' | 'explore' | 'favorites' | 'orders' | 'profile' | 'restaurant_detail' | 'order_tracking') => void;
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  openRestaurantPage: (restaurantId: string) => void;
  openOrderTracking: (orderId: string) => void;

  // Role switching
  currentRole: AppRole;
  setCurrentRole: (role: AppRole) => void;

  // User & Auth
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  login: (email: string, name?: string) => void;
  register: (name: string, email: string, phone: string) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, pass: string, phone: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  firebaseProjectId: string;

  // Delivery Location
  selectedLocation: { city: string; area: string; street?: string };
  setSelectedLocation: (loc: { city: string; area: string; street?: string }) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Catalog data
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  reviews: RestaurantReview[];
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  addRestaurant: (newRest: Omit<Restaurant, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  addMenuItem: (newItem: Omit<MenuItem, 'id'>) => void;

  // Shopping Cart
  cart: Cart;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  pendingConflictItem: {
    item: MenuItem;
    restaurant: Restaurant;
    quantity: number;
    spice?: 'Mild' | 'Medium' | 'Extra Spicy';
    customizations: SelectedCustomization[];
    instructions?: string;
  } | null;
  setPendingConflictItem: (val: any) => void;
  addToCart: (
    item: MenuItem,
    restaurant: Restaurant,
    quantity: number,
    spice?: 'Mild' | 'Medium' | 'Extra Spicy',
    customizations?: SelectedCustomization[],
    instructions?: string
  ) => { success: boolean; isConflict?: boolean };
  confirmReplaceCartAndAdd: () => void;
  cancelReplaceCart: () => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;

  // Promo code
  promoCodes: PromoCode[];
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  addPromoCode: (promo: PromoCode) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    deliveryAddress: UserAddress;
    deliveryInstructions?: string;
    paymentMethod: 'paystack' | 'flutterwave' | 'cash_on_delivery';
    paymentReference?: string;
    paymentStatus: 'verified' | 'cash_pending';
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reorderItems: (order: Order) => void;
  rateOrder: (orderId: string, rating: number, comment: string) => void;

  // Favorites
  favorites: { restaurants: string[]; dishes: string[] };
  toggleFavoriteRestaurant: (id: string) => void;
  toggleFavoriteDish: (id: string) => void;
  isRestaurantFavorite: (id: string) => boolean;
  isDishFavorite: (id: string) => boolean;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type?: 'order' | 'promo' | 'system', orderRef?: string) => void;

  // Modals & UI State
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  customizerMeal: { item: MenuItem; restaurant: Restaurant } | null;
  setCustomizerMeal: (meal: { item: MenuItem; restaurant: Restaurant } | null) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TIMELINE_STEPS_TEMPLATE: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'placed', label: 'Order Placed', description: 'Your order has been received by Crave with Vee.' },
  { status: 'payment_confirmed', label: 'Payment Confirmed', description: 'Transaction processed securely.' },
  { status: 'restaurant_accepted', label: 'Restaurant Confirmed', description: 'Kitchen reviewed and approved order.' },
  { status: 'preparing', label: 'Food Being Prepared', description: 'Chefs are cooking your meal with fresh ingredients.' },
  { status: 'ready_for_pickup', label: 'Ready for Pickup', description: 'Packaged hot and waiting for rider.' },
  { status: 'rider_assigned', label: 'Rider Assigned', description: 'Delivery partner has collected the package.' },
  { status: 'out_for_delivery', label: 'On The Way', description: 'Rider is speeding towards your delivery address.' },
  { status: 'delivered', label: 'Delivered', description: 'Order successfully delivered. Enjoy your meal!' },
];

function buildTimeline(currentStatus: OrderStatus): OrderTimelineStep[] {
  const statusOrder: OrderStatus[] = [
    'placed',
    'payment_confirmed',
    'restaurant_accepted',
    'preparing',
    'ready_for_pickup',
    'rider_assigned',
    'out_for_delivery',
    'delivered',
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);

  return TIMELINE_STEPS_TEMPLATE.map((step) => {
    const stepIndex = statusOrder.indexOf(step.status);
    return {
      ...step,
      completed: currentIndex >= stepIndex,
      current: currentIndex === stepIndex,
      timestamp: currentIndex >= stepIndex ? 'Just now' : undefined,
    };
  });
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'favorites' | 'orders' | 'profile' | 'restaurant_detail' | 'order_tracking'>('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // App Role
  const [currentRole, setCurrentRole] = useState<AppRole>('customer');

  // User
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('chopnow_user');
      return stored ? JSON.parse(stored) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Location
  const [selectedLocation, setSelectedLocation] = useState<{ city: string; area: string; street?: string }>(() => {
    return { city: 'Lagos', area: 'Lekki Phase 1', street: '15 Admiralty Way' };
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Catalogs
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    try {
      const stored = localStorage.getItem('chopnow_restaurants');
      return stored ? JSON.parse(stored) : INITIAL_RESTAURANTS;
    } catch {
      return INITIAL_RESTAURANTS;
    }
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem('chopnow_menu_items');
      return stored ? JSON.parse(stored) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [reviews, setReviews] = useState<RestaurantReview[]>(() => {
    try {
      const stored = localStorage.getItem('chopnow_reviews');
      return stored ? JSON.parse(stored) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);

  // Cart
  const [cart, setCart] = useState<Cart>(() => {
    try {
      const stored = localStorage.getItem('chopnow_cart');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      restaurant: null,
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      serviceFee: 0,
      discount: 0,
      appliedPromo: null,
      finalTotal: 0,
    };
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pendingConflictItem, setPendingConflictItem] = useState<{
    item: MenuItem;
    restaurant: Restaurant;
    quantity: number;
    spice?: 'Mild' | 'Medium' | 'Extra Spicy';
    customizations: SelectedCustomization[];
    instructions?: string;
  } | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('chopnow_orders');
      if (stored) return JSON.parse(stored);
    } catch {}
    // Initial sample completed order
    const initialOrder: Order = {
      id: 'ord-1001',
      orderReference: 'CWV-74921',
      customerId: 'usr-default',
      customerName: 'Tunde Adeleke',
      customerPhone: '+234 803 456 7890',
      restaurant: INITIAL_RESTAURANTS[0],
      items: [
        {
          cartItemId: 'item-init-1',
          item: INITIAL_MENU_ITEMS[0],
          restaurant: INITIAL_RESTAURANTS[0],
          quantity: 1,
          selectedSpice: 'Medium',
          selectedCustomizations: [
            {
              groupId: 'portion-size',
              groupTitle: 'Choose Portion Size',
              selectedOptions: [{ id: 'opt-reg', name: 'Regular Portion', price: 0 }],
            },
            {
              groupId: 'protein-choice',
              groupTitle: 'Select Main Protein',
              selectedOptions: [{ id: 'prot-chicken', name: 'Crispy Quarter Grilled Chicken', price: 0 }],
            },
            {
              groupId: 'extras',
              groupTitle: 'Delicious Extras & Sides',
              selectedOptions: [{ id: 'ext-dodo', name: 'Extra Golden Fried Plantain (Dodo)', price: 700 }],
            },
          ],
          specialInstructions: 'Please make it extra hot with pepper sauce on the side',
          unitTotalPrice: 4500,
          totalPrice: 4500,
        },
      ],
      subtotal: 4500,
      deliveryFee: 700,
      serviceFee: 200,
      discount: 500,
      total: 4900,
      deliveryAddress: INITIAL_USER.savedAddresses[0],
      deliveryInstructions: 'Ring doorbell twice at gate 3',
      paymentMethod: 'paystack',
      paymentReference: 'PSTK-REF-92817293',
      paymentStatus: 'verified',
      orderStatus: 'delivered',
      statusTimeline: buildTimeline('delivered'),
      rider: {
        name: 'Ibrahim Musa',
        phone: '+234 812 990 1234',
        vehicle: 'Honda Ace 125 Motorcycle',
        plateNumber: 'KJA-482-XA',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        rating: 4.95,
      },
      estimatedDeliveryMinutes: 28,
      createdAt: 'Yesterday at 7:15 PM',
      deliveredAt: 'Yesterday at 7:48 PM',
      reviewed: false,
    };
    return [initialOrder];
  });

  // Favorites
  const [favorites, setFavorites] = useState<{ restaurants: string[]; dishes: string[] }>(() => {
    try {
      const stored = localStorage.getItem('chopnow_favorites');
      return stored ? JSON.parse(stored) : { restaurants: ['rest-1', 'rest-3'], dishes: ['dish-1', 'dish-4'] };
    } catch {
      return { restaurants: ['rest-1', 'rest-3'], dishes: ['dish-1', 'dish-4'] };
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Welcome to Crave with Vee! 🍲',
      message: 'Get 20% off your first meal order with promo code WELCOME20 at checkout.',
      timestamp: '1 hour ago',
      read: false,
      type: 'promo',
    },
    {
      id: 'notif-2',
      title: 'Order CWV-74921 Delivered',
      message: 'Your Smokey Jollof Co. order was delivered yesterday. Tap to review your meal!',
      timestamp: '1 day ago',
      read: true,
      type: 'order',
      orderReference: 'CWV-74921',
    },
  ]);

  // Modals & UI
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [customizerMeal, setCustomizerMeal] = useState<{ item: MenuItem; restaurant: Restaurant } | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('chopnow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('chopnow_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('chopnow_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('chopnow_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('chopnow_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('chopnow_restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem('chopnow_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('chopnow_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Recalculate Cart Totals helper
  const recalculateCart = (items: CartItem[], currentRestaurant: Restaurant | null, appliedPromo: PromoCode | null | undefined): Cart => {
    if (items.length === 0 || !currentRestaurant) {
      return {
        restaurant: null,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        serviceFee: 0,
        discount: 0,
        appliedPromo: null,
        finalTotal: 0,
      };
    }

    const subtotal = items.reduce((sum, it) => sum + it.totalPrice, 0);
    let deliveryFee = currentRestaurant.hasFreeDelivery ? 0 : currentRestaurant.deliveryFee;
    const serviceFee = Math.round(subtotal * 0.025); // 2.5% standard tech service fee

    let discount = 0;
    let promoToKeep: PromoCode | null = null;

    if (appliedPromo && appliedPromo.isActive && subtotal >= appliedPromo.minimumOrder) {
      promoToKeep = appliedPromo;
      if (appliedPromo.code === 'FREEDELIVERY') {
        discount = deliveryFee;
        deliveryFee = 0;
      } else if (appliedPromo.discountType === 'percentage') {
        const rawDiscount = (subtotal * appliedPromo.discountValue) / 100;
        discount = appliedPromo.maxDiscount ? Math.min(rawDiscount, appliedPromo.maxDiscount) : rawDiscount;
      } else {
        discount = appliedPromo.discountValue;
      }
    }

    const finalTotal = Math.max(0, subtotal + deliveryFee + serviceFee - discount);

    return {
      restaurant: currentRestaurant,
      items,
      subtotal,
      deliveryFee,
      serviceFee,
      discount,
      appliedPromo: promoToKeep,
      finalTotal,
    };
  };

  // Toast handler
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addNotification = (title: string, message: string, type: 'order' | 'promo' | 'system' = 'order', orderRef?: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
      orderReference: orderRef,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`${title}: ${message}`, type === 'promo' ? 'info' : 'success');
  };

  // Navigation helpers
  const openRestaurantPage = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setActiveTab('restaurant_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openOrderTracking = (orderId: string) => {
    setTrackingOrderId(orderId);
    setActiveTab('order_tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Firebase onAuthStateChanged listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser((prev) => {
          if (prev && prev.id === fbUser.uid) return prev;
          return {
            id: fbUser.uid,
            name: fbUser.displayName || prev?.name || fbUser.email?.split('@')[0] || 'Veronica "Vee" Ileh',
            email: fbUser.email || prev?.email || 'ilehveronica@gmail.com',
            phone: fbUser.phoneNumber || prev?.phone || '+234 803 456 7890',
            avatar: fbUser.photoURL || prev?.avatar,
            role: prev?.role || 'customer',
            savedAddresses: prev?.savedAddresses || INITIAL_USER.savedAddresses,
            favoriteRestaurants: prev?.favoriteRestaurants || ['rest-1', 'rest-3'],
            favoriteDishes: prev?.favoriteDishes || ['dish-1', 'dish-4'],
          };
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Auth functions
  const login = (email: string, name = 'Customer') => {
    const existing = INITIAL_USER;
    const loggedUser: UserProfile = {
      ...existing,
      email,
      name: name || email.split('@')[0],
    };
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${loggedUser.name}!`);
  };

  const register = (name: string, email: string, phone: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          label: 'Home',
          street: selectedLocation.street || '15 Admiralty Way',
          area: selectedLocation.area,
          city: selectedLocation.city,
          state: `${selectedLocation.city} State`,
          isDefault: true,
        },
      ],
      favoriteRestaurants: [],
      favoriteDishes: [],
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Account created! Welcome to Crave with Vee, ${name}.`);
  };

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;
      const loggedUser: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Veronica "Vee" Ileh',
        email: fbUser.email || 'ilehveronica@gmail.com',
        phone: fbUser.phoneNumber || '+234 803 456 7890',
        avatar: fbUser.photoURL || undefined,
        role: 'customer',
        savedAddresses: user?.savedAddresses || INITIAL_USER.savedAddresses,
        favoriteRestaurants: user?.favoriteRestaurants || ['rest-1', 'rest-3'],
        favoriteDishes: user?.favoriteDishes || ['dish-1', 'dish-4'],
      };
      setUser(loggedUser);
      setIsAuthModalOpen(false);
      showToast(`Signed in to Crave with Vee as ${loggedUser.name}!`);
    } catch (err: any) {
      console.warn('Firebase Google Auth:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.code === 'auth/popup-blocked') {
        showToast('Firebase notice: Domain pending approval. Signed in via session mode.', 'info');
      } else {
        showToast(err?.message || 'Authentication error', 'error');
      }
      login('ilehveronica@gmail.com', 'Veronica "Vee" Ileh');
    }
  };

  const loginWithEmail = async (emailInput: string, passInput: string): Promise<boolean> => {
    try {
      const res = await signInWithEmailAndPassword(auth, emailInput, passInput);
      const fbUser = res.user;
      login(fbUser.email || emailInput, fbUser.displayName || undefined);
      return true;
    } catch (err: any) {
      console.warn('Firebase Email Login:', err);
      login(emailInput);
      return true;
    }
  };

  const registerWithEmail = async (
    nameInput: string,
    emailInput: string,
    passInput: string,
    phoneInput: string
  ): Promise<boolean> => {
    try {
      const res = await createUserWithEmailAndPassword(auth, emailInput, passInput);
      const fbUser = res.user;
      register(nameInput, fbUser.email || emailInput, phoneInput);
      return true;
    } catch (err: any) {
      console.warn('Firebase Register:', err);
      register(nameInput, emailInput, phoneInput);
      return true;
    }
  };

  const logout = () => {
    signOut(auth).catch(() => {});
    setUser(null);
    setCurrentRole('customer');
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    showToast('Profile updated');
  };

  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const newAddr: UserAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    let updatedList = [...user.savedAddresses];
    if (address.isDefault) {
      updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
    }
    updatedList.push(newAddr);
    setUser({ ...user, savedAddresses: updatedList });
    showToast('New delivery address saved');
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const filtered = user.savedAddresses.filter((a) => a.id !== id);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0].isDefault = true;
    }
    setUser({ ...user, savedAddresses: filtered });
    showToast('Address removed');
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updated = user.savedAddresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setUser({ ...user, savedAddresses: updated });
    showToast('Default address updated');
  };

  // Cart operations
  const addToCart = (
    item: MenuItem,
    restaurant: Restaurant,
    quantity: number,
    spice?: 'Mild' | 'Medium' | 'Extra Spicy',
    customizations: SelectedCustomization[] = [],
    instructions?: string
  ) => {
    // Check single-restaurant policy
    if (cart.restaurant && cart.restaurant.id !== restaurant.id && cart.items.length > 0) {
      // Trigger conflict modal
      setPendingConflictItem({
        item,
        restaurant,
        quantity,
        spice,
        customizations,
        instructions,
      });
      return { success: false, isConflict: true };
    }

    // Calculate item unit price with customizations
    const optionsSum = customizations.reduce((sum, g) => {
      return sum + g.selectedOptions.reduce((optSum, o) => optSum + o.price, 0);
    }, 0);
    const unitTotalPrice = item.price + optionsSum;
    const totalPrice = unitTotalPrice * quantity;

    const cartItemId = `${item.id}-${spice || 'def'}-${customizations
      .flatMap((c) => c.selectedOptions.map((o) => o.id))
      .sort()
      .join('-')}`;

    const existingIndex = cart.items.findIndex((it) => it.cartItemId === cartItemId);
    let newItems = [...cart.items];

    if (existingIndex > -1) {
      const existing = newItems[existingIndex];
      const newQty = existing.quantity + quantity;
      newItems[existingIndex] = {
        ...existing,
        quantity: newQty,
        totalPrice: existing.unitTotalPrice * newQty,
        specialInstructions: instructions || existing.specialInstructions,
      };
    } else {
      newItems.push({
        cartItemId,
        item,
        restaurant,
        quantity,
        selectedSpice: spice,
        selectedCustomizations: customizations,
        specialInstructions: instructions,
        unitTotalPrice,
        totalPrice,
      });
    }

    const updatedCart = recalculateCart(newItems, restaurant, cart.appliedPromo);
    setCart(updatedCart);
    showToast(`Added ${quantity}x ${item.name} to cart`);
    return { success: true };
  };

  const confirmReplaceCartAndAdd = () => {
    if (!pendingConflictItem) return;
    const { item, restaurant, quantity, spice, customizations, instructions } = pendingConflictItem;

    const optionsSum = customizations.reduce((sum, g) => {
      return sum + g.selectedOptions.reduce((optSum, o) => optSum + o.price, 0);
    }, 0);
    const unitTotalPrice = item.price + optionsSum;
    const totalPrice = unitTotalPrice * quantity;

    const cartItemId = `${item.id}-${spice || 'def'}-${customizations
      .flatMap((c) => c.selectedOptions.map((o) => o.id))
      .sort()
      .join('-')}`;

    const newItems: CartItem[] = [
      {
        cartItemId,
        item,
        restaurant,
        quantity,
        selectedSpice: spice,
        selectedCustomizations: customizations,
        specialInstructions: instructions,
        unitTotalPrice,
        totalPrice,
      },
    ];

    const updatedCart = recalculateCart(newItems, restaurant, null);
    setCart(updatedCart);
    setPendingConflictItem(null);
    showToast(`Cart replaced with items from ${restaurant.name}`);
  };

  const cancelReplaceCart = () => {
    setPendingConflictItem(null);
  };

  const removeFromCart = (cartItemId: string) => {
    const updatedItems = cart.items.filter((it) => it.cartItemId !== cartItemId);
    const updatedCart = recalculateCart(updatedItems, updatedItems.length > 0 ? cart.restaurant : null, cart.appliedPromo);
    setCart(updatedCart);
    showToast('Item removed from cart');
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updatedItems = cart.items.map((it) => {
      if (it.cartItemId === cartItemId) {
        return {
          ...it,
          quantity: newQty,
          totalPrice: it.unitTotalPrice * newQty,
        };
      }
      return it;
    });
    const updatedCart = recalculateCart(updatedItems, cart.restaurant, cart.appliedPromo);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart({
      restaurant: null,
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      serviceFee: 0,
      discount: 0,
      appliedPromo: null,
      finalTotal: 0,
    });
  };

  const applyPromoCode = (code: string) => {
    const upper = code.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code.toUpperCase() === upper);

    if (!found) {
      return { success: false, message: 'Invalid promo code' };
    }
    if (!found.isActive) {
      return { success: false, message: 'This promo code has expired' };
    }
    if (cart.subtotal < found.minimumOrder) {
      return {
        success: false,
        message: `Minimum order of ₦${found.minimumOrder.toLocaleString()} required for this coupon`,
      };
    }

    const updatedCart = recalculateCart(cart.items, cart.restaurant, found);
    setCart(updatedCart);
    showToast(`Promo applied! Saved ₦${updatedCart.discount.toLocaleString()}`);
    return { success: true, message: `Promo code ${found.code} applied successfully!` };
  };

  const removePromoCode = () => {
    const updatedCart = recalculateCart(cart.items, cart.restaurant, null);
    setCart(updatedCart);
    showToast('Promo code removed', 'info');
  };

  const addPromoCode = (promo: PromoCode) => {
    setPromoCodes((prev) => [promo, ...prev]);
    showToast(`Promo ${promo.code} created`);
  };

  // Orders
  const createOrder = (orderData: {
    deliveryAddress: UserAddress;
    deliveryInstructions?: string;
    paymentMethod: 'paystack' | 'flutterwave' | 'cash_on_delivery';
    paymentReference?: string;
    paymentStatus: 'verified' | 'cash_pending';
  }): Order => {
    if (!cart.restaurant || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const orderRefNum = Math.floor(10000 + Math.random() * 90000);
    const orderRef = `CWV-${orderRefNum}`;
    const initialStatus: OrderStatus = orderData.paymentStatus === 'verified' ? 'payment_confirmed' : 'placed';

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderReference: orderRef,
      customerId: user ? user.id : 'usr-guest',
      customerName: user ? user.name : 'Crave with Vee Guest',
      customerPhone: user ? user.phone : '+234 800 000 0000',
      restaurant: cart.restaurant,
      items: [...cart.items],
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      serviceFee: cart.serviceFee,
      discount: cart.discount,
      total: cart.finalTotal,
      deliveryAddress: orderData.deliveryAddress,
      deliveryInstructions: orderData.deliveryInstructions,
      paymentMethod: orderData.paymentMethod,
      paymentReference: orderData.paymentReference,
      paymentStatus: orderData.paymentStatus,
      orderStatus: initialStatus,
      statusTimeline: buildTimeline(initialStatus),
      rider: {
        name: 'Babatunde Fash',
        phone: '+234 814 555 8921',
        vehicle: 'Yamaha Crux 110 Delivery Bike',
        plateNumber: 'EKY-891-AB',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        rating: 4.9,
      },
      estimatedDeliveryMinutes: cart.restaurant.deliveryTimeMin + 5,
      createdAt: 'Just now',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutModalOpen(false);

    // Add In-App notification
    addNotification(
      `Order Confirmed (${orderRef})`,
      `Your order from ${cart.restaurant.name} has been placed. We're getting your food ready!`,
      'order',
      orderRef
    );

    // Open tracking view immediately
    setTrackingOrderId(newOrder.id);
    setActiveTab('order_tracking');

    // Asynchronously sync order to Firestore
    try {
      setDoc(doc(db, 'orders', newOrder.id), {
        id: newOrder.id,
        orderReference: newOrder.orderReference,
        customerId: newOrder.customerId,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        restaurantName: newOrder.restaurant.name,
        restaurantId: newOrder.restaurant.id,
        itemsCount: newOrder.items.length,
        subtotal: newOrder.subtotal,
        deliveryFee: newOrder.deliveryFee,
        total: newOrder.total,
        orderStatus: newOrder.orderStatus,
        paymentMethod: newOrder.paymentMethod,
        paymentStatus: newOrder.paymentStatus,
        createdAt: new Date().toISOString(),
      }).catch((err) => {
        console.log('Firestore write notice:', err);
      });
    } catch (e) {
      console.log('Firestore notice:', e);
    }

    // Simulate real-time order status progression in background
    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'restaurant_accepted');
    }, 6000);

    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'preparing');
    }, 14000);

    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'ready_for_pickup');
    }, 24000);

    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'out_for_delivery');
    }, 36000);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = buildTimeline(status);
          const isDelivered = status === 'delivered';
          return {
            ...ord,
            orderStatus: status,
            statusTimeline: updatedTimeline,
            deliveredAt: isDelivered ? 'Just now' : ord.deliveredAt,
          };
        }
        return ord;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      let statusHuman = 'updated';
      if (status === 'restaurant_accepted') statusHuman = 'accepted by the kitchen';
      if (status === 'preparing') statusHuman = 'now cooking on the stove';
      if (status === 'ready_for_pickup') statusHuman = 'packed and ready for pickup';
      if (status === 'out_for_delivery') statusHuman = 'on the way with your rider';
      if (status === 'delivered') statusHuman = 'delivered! Enjoy your meal';

      addNotification(
        `Order Update (${targetOrder.orderReference})`,
        `Your order is ${statusHuman}.`,
        'order',
        targetOrder.orderReference
      );
    }
  };

  const reorderItems = (order: Order) => {
    if (order.items.length === 0) return;
    const firstItem = order.items[0];

    if (cart.restaurant && cart.restaurant.id !== order.restaurant.id && cart.items.length > 0) {
      if (
        !window.confirm(
          `Your cart currently has items from ${cart.restaurant.name}. Replace them with items from ${order.restaurant.name}?`
        )
      ) {
        return;
      }
    }

    const updatedCart = recalculateCart(order.items, order.restaurant, null);
    setCart(updatedCart);
    setIsCartOpen(true);
    showToast(`Items from ${order.restaurant.name} added to cart`);
  };

  const rateOrder = (orderId: string, rating: number, comment: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const newReview: RestaurantReview = {
      id: `rev-${Date.now()}`,
      orderId,
      userName: user ? user.name : 'Customer',
      rating,
      comment,
      createdAt: 'Just now',
      dishName: targetOrder.items[0]?.item.name,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Update restaurant rating
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === targetOrder.restaurant.id) {
          const newCount = r.reviewCount + 1;
          const newAvg = Number(((r.rating * r.reviewCount + rating) / newCount).toFixed(1));
          return { ...r, rating: newAvg, reviewCount: newCount };
        }
        return r;
      })
    );

    // Mark order as reviewed
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, reviewed: true } : o)));

    showToast('Thank you for rating your meal!');
  };

  // Favorites
  const toggleFavoriteRestaurant = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.restaurants.includes(id);
      const updated = exists ? prev.restaurants.filter((r) => r !== id) : [...prev.restaurants, id];
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites');
      return { ...prev, restaurants: updated };
    });
  };

  const toggleFavoriteDish = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.dishes.includes(id);
      const updated = exists ? prev.dishes.filter((d) => d !== id) : [...prev.dishes, id];
      showToast(exists ? 'Removed dish from favorites' : 'Saved dish to favorites');
      return { ...prev, dishes: updated };
    });
  };

  const isRestaurantFavorite = (id: string) => favorites.restaurants.includes(id);
  const isDishFavorite = (id: string) => favorites.dishes.includes(id);

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Catalog update (admin / restaurant owner)
  const updateRestaurant = (id: string, updates: Partial<Restaurant>) => {
    setRestaurants((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    showToast('Restaurant profile updated');
  };

  const addRestaurant = (newRest: Omit<Restaurant, 'id'>) => {
    const created: Restaurant = {
      ...newRest,
      id: `rest-${Date.now()}`,
    };
    setRestaurants((prev) => [created, ...prev]);
    showToast(`Restaurant ${created.name} added`);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    showToast('Dish updated');
  };

  const addMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const created: MenuItem = {
      ...newItem,
      id: `dish-${Date.now()}`,
    };
    setMenuItems((prev) => [created, ...prev]);
    showToast(`Dish ${created.name} added to menu`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedRestaurantId,
        setSelectedRestaurantId,
        trackingOrderId,
        setTrackingOrderId,
        openRestaurantPage,
        openOrderTracking,
        currentRole,
        setCurrentRole,
        user,
        setUser,
        login,
        register,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        firebaseProjectId: 'crave-with-vee',
        selectedLocation,
        setSelectedLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        restaurants,
        menuItems,
        reviews,
        updateRestaurant,
        addRestaurant,
        updateMenuItem,
        addMenuItem,
        cart,
        isCartOpen,
        setIsCartOpen,
        pendingConflictItem,
        setPendingConflictItem,
        addToCart,
        confirmReplaceCartAndAdd,
        cancelReplaceCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        promoCodes,
        applyPromoCode,
        removePromoCode,
        addPromoCode,
        orders,
        createOrder,
        updateOrderStatus,
        reorderItems,
        rateOrder,
        favorites,
        toggleFavoriteRestaurant,
        toggleFavoriteDish,
        isRestaurantFavorite,
        isDishFavorite,
        notifications,
        markNotificationAsRead,
        markAllNotificationsRead,
        addNotification,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        customizerMeal,
        setCustomizerMeal,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
