import { Clock, Settings, Shield, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const headerUi = {
  aria: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    openSearch: 'Open search',
    closeSearch: 'Close search',
    navigationMenu: 'Navigation menu',
    account: 'Account',
    signedInAs: 'Signed in as',
    wishlistBase: 'Wishlist',
    cartBase: 'Cart',
    itemsSuffix: 'items',
    search: 'Search',
  },
  brand: {
    wordmarkAlt: 'Wear Wine',
    mobileInitial: 'W',
    mobileName: 'Wear Wine',
  },
  account: {
    myProfile: 'My Profile',
    myOrders: 'My Orders',
    myAccount: 'My Account',
    signOut: 'Sign Out',
    signInJoin: 'Sign In / Join',
    accountSection: 'Account',
  },
  shop: {
    label: 'Shop',
  },
  search: {
    placeholder: 'Search products...',
    searching: 'Searching...',
    resultsLabel: 'Results',
    productsFoundSuffix: 'Products Found',
    viewAllCollections: 'View all collections',
    noMatchesFound: 'No Matches Found',
    tryDifferentKeyword: 'Try a different keyword',
  },
  utilityLinks: [
    { label: 'Track Order', href: '/track-order' },
    { label: 'Help', href: '/help' },
    { label: 'Support', href: '/support' },
  ],
  money: {
    searchCurrencySymbol: '₹',
  },
} as const

export const buildWishlistAriaLabel = (count: number): string => {
  if (count > 0) return `${headerUi.aria.wishlistBase}, ${count} ${headerUi.aria.itemsSuffix}`
  return headerUi.aria.wishlistBase
}

export const buildCartAriaLabel = (count: number): string => {
  if (count > 0) return `${headerUi.aria.cartBase}, ${count} ${headerUi.aria.itemsSuffix}`
  return headerUi.aria.cartBase
}

export const buildSearchCountLabel = (count: number): string =>
  `${count} ${headerUi.search.productsFoundSuffix}`

export const accountUi = {
  navItems: [
    { name: 'Profile Overview', href: '/account', icon: User },
    { name: 'My Orders', href: '/account/orders', icon: Clock },
    { name: 'Security', href: '/account/security', icon: Shield },
    { name: 'Settings', href: '/account/settings', icon: Settings },
  ] satisfies { name: string; href: string; icon: LucideIcon }[],
  avatar: {
    fallbackLetter: 'U',
    unauthenticatedPlaceholder: '?',
  },
  user: {
    fallbackName: 'User',
    loadingName: 'Loading...',
    loadingEmail: 'Please wait',
    missingName: 'Not provided',
  },
  sections: {
    personalInfoTitle: 'Personal Information',
    personalInfoDescription: 'Manage your personal details and how we can reach you.',
    accountPreferencesTitle: 'Account Preferences',
    accountPreferencesDescription: 'Manage your email formatting and newsletter subscriptions.',
  },
  fields: {
    fullName: 'Full Name',
    emailAddress: 'Email Address',
  },
  badges: {
    verified: 'Verified',
  },
  actions: {
    editProfile: 'Edit Profile Information',
  },
  newsletter: {
    title: 'Newsletter Subscription',
    description: 'Receive updates about new drops and exclusive offers.',
  },
} as const

export const wishlistUi = {
  aria: {
    remove: 'Remove',
  },
  money: {
    currencySymbol: '$',
  },
  row: {
    remove: 'Remove',
    pricePrefixMobile: 'Price:',
    statusPrefixMobile: 'Status:',
    inStock: 'In Stock',
    addToCart: 'Add To Cart',
  },
  empty: {
    title: 'Your wishlist is currently empty.',
    description: 'Save your favorite items here to keep track of what you love.',
    cta: 'Return To Shop',
  },
  topBar: {
    backToHome: 'Back to Home',
    promo: 'Free Shipping on orders over $150',
  },
  page: {
    title: 'My Wishlist',
    clearWishlistConfirm: 'Clear all items?',
    clearWishlist: 'Clear Wishlist',
  },
  table: {
    productDetails: 'Product Details',
    unitPrice: 'Unit Price',
    stockStatus: 'Stock Status',
    action: 'Action',
  },
  footer: {
    continueShopping: 'Continue Shopping',
    persistenceNote:
      'Items will be saved in your browser until they are removed or purchased.',
  },
  skeleton: {
    rows: [1, 2, 3],
  },
} as const

export const buildWishlistCountSummary = (count: number): string => {
  const noun = count === 1 ? 'item' : 'items'
  return `You have ${count} ${noun} saved in your list.`
}

export const authModalUi = {
  header: {
    loginTitle: 'Welcome Back',
    signupTitle: 'Create Account',
    loginSubtitle: 'Enter your details to sign in',
    signupSubtitle: 'Join us for a premium experience',
  },
  social: {
    googleCta: 'Continue with Google',
    divider: 'Or continue with',
  },
  actions: {
    signIn: 'Sign In',
    createAccount: 'Create Account',
    footerLoginPrompt: "Don't have an account?",
    footerSignupPrompt: 'Already have an account?',
    footerSignupCta: 'Sign up',
    footerSigninCta: 'Sign in',
  },
  fields: {
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    emailLabel: 'Email Address',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    forgot: 'Forgot?',
  },
  errors: {
    generic: 'An error occurred',
  },
} as const
