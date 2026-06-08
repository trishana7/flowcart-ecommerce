import { NextResponse } from 'next/server';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const MOCK_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is FlowCart\'s shipping policy?',
    answer: 'We offer complimentary express shipping on all orders over $150. For orders below $150, a flat shipping rate of $9.99 applies. Standard shipping takes 3-5 business days, while overnight delivery is available at checkout for domestic orders.'
  },
  {
    id: 'faq-2',
    question: 'How do I initiate a return or exchange?',
    answer: 'We want you to be completely satisfied with your purchase. Returns and exchanges are accepted within 30 days of delivery. Items must be unworn, in original packaging, and with tags attached. Return shipping is free using our pre-printed return labels.'
  },
  {
    id: 'faq-3',
    question: 'Are FlowCart products covered by a warranty?',
    answer: 'Yes, all premium accessories and gear items are covered by our limited 2-year manufacturer warranty. This covers any production defects in materials or craftsmanship. Contact our client support team with your order number to start a warranty claim.'
  },
  {
    id: 'faq-4',
    question: 'What sustainability initiatives does FlowCart support?',
    answer: 'Sustainability is at the core of our design process. 100% of our apparel utilizes organic, fair-trade certified cotton or recycled synthetic fibers. Our shipping packaging is made from compostable or recyclable post-consumer materials, and we offset all carbon emissions generated during transit.'
  },
  {
    id: 'faq-5',
    question: 'Can I change or cancel my order after it has been placed?',
    answer: 'Because we strive to process and dispatch orders as quickly as possible, orders can only be changed or cancelled within 45 minutes of purchase. Please contact our client support hotline or email support@flowcart.com immediately.'
  }
];

export async function GET() {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return NextResponse.json(MOCK_FAQS);
}
