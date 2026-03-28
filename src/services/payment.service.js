import { getState, setState } from '../state.js';
import { PRICING_PLANS } from '../data/mock/pricingPlans.js';

export function getPlans() {
  return PRICING_PLANS;
}

export function getPlanById(id) {
  return PRICING_PLANS.find(p => p.id === id) || null;
}

/**
 * Mock payment processor.
 * Replace body with Stripe / PayMob SDK call.
 * @param {string} planId
 * @param {{ number, expiry, cvv, name }} cardData
 */
export async function processPayment(planId, cardData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!cardData.number || !cardData.expiry || !cardData.cvv) {
        reject(new Error('Invalid card data.'));
        return;
      }
      const plan = getPlanById(planId);
      const user = getState('user');
      setState('user', { ...user, subscription: plan?.name || 'Pro' });
      resolve({ success: true, plan });
    }, 1800);
  });
}
