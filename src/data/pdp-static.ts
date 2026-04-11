export interface PDPStaticData {
  shipping: {
    title: string
    description: string
  }
  returns: {
    title: string
    description: string
  }
  trustBadges: {
    label: string
    description?: string
  }[]
  sizeGuide: {
    title: string
    description: string
  }
  sizeChart: {
    id: string
    url: string
    alt: string
    description: string
  }
  cta: {
    addToCart: string
    buyNow: string
    addedToCart: string
    outOfStock: string
  }
  accordions: {
    id: string
    title: string
    content: string
  }[]
}

export const pdpStaticData: PDPStaticData = {
  shipping: {
    title: 'Free Shipping',
    description: 'Free shipping on all orders above ₹100',
  },

  returns: {
    title: 'Easy Returns',
    description: '30-day hassle-free returns',
  },

  trustBadges: [
    { label: 'Free Delivery', description: '3–5 business days' },
    { label: 'Secure Payment', description: 'SSL encrypted' },
    { label: 'Easy Returns', description: 'Within 30 days' },
  ],

  sizeGuide: {
    title: 'Size & Fit',
    description: 'Fits true to size. Model is 6\'1" wearing size M.',
  },

sizeChart: {
  id: 'size-chart-1',
  url: 'https://cdn.shopify.com/s/files/1/0657/6821/files/mens-size-chart_1024x1024.png?v=1614335883',
  alt: 'Men clothing size chart with chest, waist and length measurements',
  description:
    'Use this guide to find your perfect fit based on chest, waist, and garment measurements.',
},
  cta: {
    addToCart: 'Add to Bag',
    buyNow: 'Buy it Now',
    addedToCart: 'Added to Bag',
    outOfStock: 'Out of Stock',
  },

  accordions: [
    {
      id: 'details',
      title: 'Product Details',
      content:
        'Premium construction with high-grade finishes designed for daily versatility and lasting style. Each piece is meticulously crafted to ensure the highest quality standards.',
    },
    {
      id: 'shipping',
      title: 'Delivery & Returns',
      content:
        'Standard delivery 3–5 business days. Hassle-free returns within 30 days of purchase. We offer free shipping on all orders over ₹100.',
    },
    {
      id: 'care',
      title: 'Care Instructions',
      content:
        'Follow the care label instructions. We recommend professional cleaning for best results. For cotton items, machine wash cold with like colors.',
    },
  ],
}
