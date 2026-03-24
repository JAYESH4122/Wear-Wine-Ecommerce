import { LogoWhite } from 'assets'

export interface PolicyContentType {
  title: string
  slug: string
  lastUpdated: string
  sections?: { heading: string; content: string }[]
  faqs?: { question: string; answer: string }[]
}

export interface FooterType {
  logo: {
    url: string
    alt: string
    tagline: string
    description: string
  }
  policies: {
    title: string
    links: { label: string; href: string }[]
  }
  socials: { name: string; href: string }[]
  contact: {
    title: string
    email: string
    phone: string
    hours: string[]
  }
  copyright: {
    year: string
    brand: string
    text: string
  }
}

export const policyPages: Record<string, PolicyContentType> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    lastUpdated: 'March 2026',
    sections: [
      {
        heading: 'Information We Collect',
        content:
          'We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us for support. This may include your name, email address, postal address, phone number, and payment information.',
      },
      {
        heading: 'How We Use Your Information',
        content:
          'We use the information we collect to process transactions, send you order confirmations and updates, respond to your comments and questions, send you marketing communications (with your consent), personalize your shopping experience, and improve our services.',
      },
      {
        heading: 'Information Sharing',
        content:
          'We do not sell, trade, or otherwise transfer your personal information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.',
      },
      {
        heading: 'Data Security',
        content:
          'We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights.',
      },
      {
        heading: 'Cookies',
        content:
          'We use cookies to understand and save your preferences for future visits, keep track of advertisements, and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.',
      },
      {
        heading: 'Your Rights',
        content:
          'You have the right to access, correct, or delete your personal data. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us using the information provided below.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    slug: 'terms',
    lastUpdated: 'March 2026',
    sections: [
      {
        heading: 'Acceptance of Terms',
        content:
          'By accessing and using the Wear Wine website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
      },
      {
        heading: 'Use of Service',
        content:
          'You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to use the service in any way that violates any applicable local, national, or international law or regulation.',
      },
      {
        heading: 'Account Responsibilities',
        content:
          'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.',
      },
      {
        heading: 'Product Information',
        content:
          "We strive to display our products as accurately as possible. However, we cannot guarantee that your monitor's display of any color will be accurate. We reserve the right to limit quantities of any products or services that we offer.",
      },
      {
        heading: 'Pricing and Payment',
        content:
          'All prices are subject to change without notice. We reserve the right to refuse or cancel any orders placed for products listed at an incorrect price. Payment must be received prior to the acceptance of an order.',
      },
      {
        heading: 'Limitation of Liability',
        content:
          'Wear Wine shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, including but not limited to loss of profits, data, or other intangible losses.',
      },
    ],
  },
  shipping: {
    title: 'Shipping & Returns',
    slug: 'shipping',
    lastUpdated: 'March 2026',
    sections: [
      {
        heading: 'Shipping Policy',
        content:
          'We offer free standard shipping on all orders over $100. Standard shipping typically takes 5-7 business days. Express shipping (2-3 business days) is available for an additional fee. International shipping is available to select countries.',
      },
      {
        heading: 'Processing Time',
        content:
          'Orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day. You will receive a shipping confirmation email with tracking information once your order has shipped.',
      },
      {
        heading: 'Return Policy',
        content:
          'We accept returns within 30 days of delivery for unworn, unwashed items with original tags attached. Items must be in their original condition. Sale items are final sale and cannot be returned or exchanged.',
      },
      {
        heading: 'How to Return',
        content:
          'To initiate a return, please contact our customer service team with your order number. We will provide you with a prepaid shipping label for domestic returns. International customers are responsible for return shipping costs.',
      },
      {
        heading: 'Refund Process',
        content:
          'Once we receive your return, please allow 5-7 business days for inspection and processing. Refunds will be issued to the original payment method. Shipping costs are non-refundable unless the return is due to our error.',
      },
      {
        heading: 'Exchanges',
        content:
          'We offer free exchanges for different sizes or colors, subject to availability. To request an exchange, please contact our customer service team within 30 days of delivery.',
      },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    slug: 'faq',
    lastUpdated: 'March 2026',
    faqs: [
      {
        question: 'How do I track my order?',
        answer:
          "Once your order ships, you will receive a confirmation email with a tracking number. You can use this number to track your package on our website or the carrier's website. You can also log into your account to view order status.",
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All transactions are secured with SSL encryption.',
      },
      {
        question: 'How do I find my size?',
        answer:
          "We provide detailed size guides on each product page. Measure yourself and compare to our size chart for the best fit. If you're between sizes, we recommend sizing up for a more relaxed fit or down for a fitted look.",
      },
      {
        question: 'Can I modify or cancel my order?',
        answer:
          'Orders can be modified or cancelled within 1 hour of placement. After this window, orders enter processing and cannot be changed. Please contact customer service immediately if you need to make changes.',
      },
      {
        question: 'Do you offer gift wrapping?',
        answer:
          'Yes! We offer complimentary gift wrapping on all orders. Simply select the gift wrap option at checkout and add a personalized message. Your items will arrive beautifully packaged in our signature gift box.',
      },
      {
        question: 'How do I care for my garments?',
        answer:
          "Care instructions are provided on each product's label and product page. Generally, we recommend washing in cold water, hanging to dry, and ironing on low heat. Dry cleaning is recommended for delicate fabrics.",
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location. Import duties and taxes may apply and are the responsibility of the customer.',
      },
      {
        question: 'How can I contact customer support?',
        answer:
          'You can reach our customer support team via email at hello@wearwine.com or by phone at +1 (555) 123-4567. Our team is available Monday through Friday, 9:00 AM to 6:00 PM EST.',
      },
    ],
  },
}

export const footerData: FooterType = {
  logo: {
    url: LogoWhite.src,
    alt: 'Wear Wine Logo',
    tagline: 'Elegance & Comfort',
    description:
      'We blend classic styles with modern luxury to give you the perfect wardrobe for every occasion.',
  },
  policies: {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/policies/privacy-policy' },
      { label: 'Terms of Service', href: '/policies/terms' },
      { label: 'Shipping & Returns', href: '/policies/shipping' },
      { label: 'FAQ', href: '/policies/faq' },
    ],
  },
  socials: [
    { name: 'Facebook', href: 'https://facebook.com' },
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'WhatsApp', href: 'https://wa.me/15551234567' },
  ],
  contact: {
    title: 'Contact Us',
    email: 'hello@wearwine.com',
    phone: '+1 (555) 123-4567',
    hours: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat - Sun: Closed'],
  },
  copyright: {
    year: new Date().getFullYear().toString(),
    brand: 'Wear Wine',
    text: 'All rights reserved.',
  },
}
