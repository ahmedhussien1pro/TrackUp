import State from '../state.js';
import { StorageService } from './storage.service.js';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    recommended: false,
    features: [
      'Career assessment',
      'Basic roadmap access',
      '3 courses included',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    recommended: true,
    features: [
      'Everything in Free',
      'Full roadmap + step tracking',
      'Unlimited courses',
      '2 mentor sessions / month',
      'Priority support',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: 49,
    recommended: false,
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Team progress dashboard',
      'Unlimited mentor sessions',
      'Dedicated success manager',
    ],
  },
];

export const PaymentService = {
  getPlans() {
    return PLANS;
  },

  getPlanById(id) {
    return PLANS.find(p => p.id === id) || null;
  },

  getActivePlan() {
    return StorageService.get('activePlan') || null;
  },

  async processPayment(plan) {
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 900));

    const user = State.getState('user');
    if (user) {
      const updated = { ...user, plan: plan.id };
      State.setState('user', updated);
      StorageService.set('session', updated);
    }
    StorageService.set('activePlan', plan);

    return { success: true, plan };
  },
};
