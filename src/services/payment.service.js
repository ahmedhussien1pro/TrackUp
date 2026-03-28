import State from '../state.js';
import { StorageService } from './storage.service.js';
import { MOCK_PRICING_PLANS } from '../data/mock/pricingPlans.js';

export const PaymentService = {
  getPlans() {
    return MOCK_PRICING_PLANS;
  },

  getPlanById(id) {
    return MOCK_PRICING_PLANS.find(p => p.id === id) || null;
  },

  // Replace with Stripe / PayMob SDK call
  async processPayment(plan) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = State.getState('user');
        if (user) {
          const updated = { ...user, plan: plan.id };
          State.setState('user', updated);
          StorageService.set('session', updated);
        }
        State.setState('activePlan', plan);
        StorageService.set('activePlan', plan);
        resolve({ success: true, plan });
      }, 1500);
    });
  },

  getActivePlan() {
    return State.getState('activePlan') || StorageService.get('activePlan') || this.getPlanById('free');
  },

  isPro() {
    const plan = this.getActivePlan();
    return plan?.id === 'pro' || plan?.id === 'team';
  },
};
