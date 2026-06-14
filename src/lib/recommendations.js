import { supabase } from './supabase';

const FALLBACK_MARKET_DATA = {
  'netflix': { name: 'Netflix', standardPrice: 15.49, category: 'TV & Streaming', competitors: ['Hulu', 'Disney+', 'Max'] },
  'spotify': { name: 'Spotify', standardPrice: 10.99, category: 'Music', competitors: ['Apple Music', 'YouTube Premium', 'Amazon Music'] },
  'amazon prime': { name: 'Amazon Prime', standardPrice: 14.99, category: 'Utilities', competitors: ['Walmart+'] },
  'youtube premium': { name: 'YouTube Premium', standardPrice: 13.99, category: 'Music', competitors: ['Spotify', 'Apple Music'] },
  'apple music': { name: 'Apple Music', standardPrice: 10.99, category: 'Music', competitors: ['Spotify', 'YouTube Premium'] },
  'disney+': { name: 'Disney+', standardPrice: 7.99, category: 'TV & Streaming', competitors: ['Netflix', 'Hulu'] },
  'chatgpt plus': { name: 'ChatGPT Plus', standardPrice: 20.00, category: 'Software & AI', competitors: ['Claude Pro', 'Gemini Advanced'] },
  'playstation plus': { name: 'PlayStation Plus', standardPrice: 9.99, category: 'Gaming', competitors: ['Xbox Game Pass'] },
  'xbox game pass': { name: 'Xbox Game Pass', standardPrice: 9.99, category: 'Gaming', competitors: ['PlayStation Plus'] },
  'hulu': { name: 'Hulu', standardPrice: 7.99, category: 'TV & Streaming' },
  'max': { name: 'Max', standardPrice: 9.99, category: 'TV & Streaming' },
  'claude pro': { name: 'Claude Pro', standardPrice: 20.00, category: 'Software & AI' },
  'gemini advanced': { name: 'Gemini Advanced', standardPrice: 19.99, category: 'Software & AI' },
  'walmart+': { name: 'Walmart+', standardPrice: 12.95, category: 'Utilities' },
  'amazon music': { name: 'Amazon Music', standardPrice: 9.99, category: 'Music' }
};

export const fetchMarketPrices = async () => {
  try {
    const { data, error } = await supabase.from('market_prices').select('*');
    if (error) {
      console.warn('Could not fetch live market prices, using fallback.');
      return FALLBACK_MARKET_DATA;
    }
    
    if (!data || data.length === 0) return FALLBACK_MARKET_DATA;

    const marketDataObj = {};
    data.forEach(item => {
      // Capitalize first letters for display name if it's strictly lowercase in DB, though we can just use the item name
      const displayName = item.service_name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      marketDataObj[item.service_name.toLowerCase()] = {
        name: displayName,
        standardPrice: parseFloat(item.standard_price),
        category: item.category,
        competitors: item.competitors || []
      };
    });
    return marketDataObj;
  } catch (err) {
    console.error(err);
    return FALLBACK_MARKET_DATA;
  }
};

export const getMarketPrice = (name, marketDataParam) => {
  const marketData = marketDataParam || FALLBACK_MARKET_DATA;
  const key = name.toLowerCase().trim();
  return marketData[key]?.standardPrice || null;
};

export const generateInsights = (subscriptions, marketDataParam) => {
  const marketData = marketDataParam || FALLBACK_MARKET_DATA;
  const insights = [];
  const activeNames = subscriptions.map(s => s.name.toLowerCase().trim());

  subscriptions.forEach(sub => {
    const key = sub.name.toLowerCase().trim();
    const marketInfo = marketData[key];
    const monthlyPrice = sub.billingCycle.toLowerCase() === 'yearly' ? sub.price / 12 : sub.price;

    // 1. Check if user is overpaying compared to standard market price
    if (marketInfo && marketInfo.standardPrice) {
      if (monthlyPrice > marketInfo.standardPrice + 1) { // 1 dollar buffer
        insights.push({
          type: 'OVERPAYING',
          title: `Overpaying for ${sub.name}`,
          description: `You are paying $${monthlyPrice.toFixed(2)}/mo. The live market price is $${marketInfo.standardPrice.toFixed(2)}/mo. Consider checking your plan tier.`,
          severity: 'high',
          icon: 'trending_down',
          color: 'red',
          savings: monthlyPrice - marketInfo.standardPrice
        });
      }
    }

    // 2. Check for cheaper competitors
    if (marketInfo && marketInfo.competitors) {
      const cheaperCompetitors = marketInfo.competitors.filter(comp => {
        const compPrice = getMarketPrice(comp, marketData);
        return compPrice && compPrice < monthlyPrice;
      });

      if (cheaperCompetitors.length > 0) {
        const bestComp = cheaperCompetitors[0];
        const bestCompPrice = getMarketPrice(bestComp, marketData);
        const savings = monthlyPrice - bestCompPrice;
        
        insights.push({
          type: 'COMPETITOR',
          title: `Cheaper Alternative to ${sub.name}`,
          description: `Switch to ${marketData[bestComp.toLowerCase()]?.name || bestComp} for $${bestCompPrice.toFixed(2)}/mo and save $${savings.toFixed(2)} every month!`,
          severity: 'medium',
          icon: 'swap_horiz',
          color: 'blue',
          savings: savings
        });
      }
    }

    // 3. Annual savings recommendation
    if (sub.billingCycle.toLowerCase() === 'monthly') {
      const estimatedAnnualPrice = (sub.price * 12) * 0.85; // Assume 15% discount for annual
      const estimatedSavings = (sub.price * 12) - estimatedAnnualPrice;
      if (sub.price > 10) {
        insights.push({
          type: 'ANNUAL_SAVINGS',
          title: `Switch ${sub.name} to Yearly`,
          description: `You pay $${sub.price}/mo. Switching to an annual plan could save you ~$${estimatedSavings.toFixed(2)} per year.`,
          severity: 'low',
          icon: 'calendar_month',
          color: 'green',
          savings: estimatedSavings / 12
        });
      }
    }
  });

  // 4. Overlap specific logic
  if (activeNames.includes('spotify') && activeNames.includes('youtube premium')) {
    const spotifySub = subscriptions.find(s => s.name.toLowerCase().trim() === 'spotify');
    const spotifyPrice = spotifySub ? (spotifySub.billingCycle.toLowerCase() === 'yearly' ? spotifySub.price / 12 : spotifySub.price) : 10.99;
    
    insights.push({
      type: 'OVERLAP',
      title: 'Redundant Music Services',
      description: 'You have both Spotify and YouTube Premium (which includes YT Music). Consider canceling Spotify to save money.',
      severity: 'high',
      icon: 'content_copy',
      color: 'red',
      savings: spotifyPrice
    });
  }

  // Sort by severity (high -> medium -> low)
  const severityValue = { 'high': 3, 'medium': 2, 'low': 1 };
  insights.sort((a, b) => severityValue[b.severity] - severityValue[a.severity]);

  return insights.slice(0, 5);
};

const SPECIFIC_INSIGHTS = {
  'netflix': {
    good: "Opinion: Netflix is the king of original content, and you're paying the standard rate. Recommendation: It's a great service, but consider 'pausing' it for a month if you find yourself watching more YouTube or other platforms.",
    overpaying: "Opinion: You're on a premium Netflix tier. Recommendation: Unless you specifically need 4K resolution or 4 simultaneous screens, downgrade to the standard tier to save money."
  },
  'spotify': {
    good: "Opinion: Spotify is the gold standard for music discovery and podcasts. Recommendation: At $10.99/mo it's solid, but if you're a student, make sure to claim your 50% student discount!"
  },
  'apple music': {
    good: "Opinion: Apple Music offers high-res lossless audio at no extra cost. Recommendation: Since you are in the Apple ecosystem, this is the perfect choice over Spotify. Keep it active!"
  },
  'youtube premium': {
    good: "Opinion: YouTube Premium gives you ad-free videos AND a full music streaming app. Recommendation: This is one of the highest value subscriptions on the market. Definitely keep it."
  },
  'disney+': {
    good: "Opinion: Disney+ is essential for Marvel, Star Wars, and family content. Recommendation: If you only watch it for specific new show releases, consider subscribing for just 1 month at a time."
  },
  'amazon prime': {
    good: "Opinion: Prime bundles fast shipping with Prime Video. Recommendation: If you order from Amazon at least twice a month, the shipping savings easily cover this cost. Great value."
  },
  'playstation plus': {
    good: "Opinion: PS Plus is required for online multiplayer and gives free monthly games. Recommendation: If you don't play online much, drop to the 'Essential' tier to save."
  },
  'xbox game pass': {
    good: "Opinion: Game Pass is often called the 'Netflix of gaming'. Recommendation: With day-one releases included, this is arguably the best value in all of gaming. Highly recommended."
  },
  'chatgpt plus': {
    good: "Opinion: ChatGPT Plus gives you access to GPT-4 and advanced data analysis. Recommendation: If you use it for work or coding, $20/mo is a massive productivity booster. Worth every penny."
  }
};

export const getInsightForSubscription = (sub, allSubscriptions, marketDataParam) => {
  const marketData = marketDataParam || FALLBACK_MARKET_DATA;
  const activeNames = allSubscriptions.map(s => s.name.toLowerCase().trim());
  const key = sub.name.toLowerCase().trim();
  const marketInfo = marketData[key];
  const monthlyPrice = sub.billingCycle.toLowerCase() === 'yearly' ? sub.price / 12 : sub.price;
  const customInsight = SPECIFIC_INSIGHTS[key];

  if (key === 'spotify' && activeNames.includes('youtube premium')) {
    return { text: "Opinion: You are paying for both Spotify and YouTube Premium. Since YouTube Premium includes YouTube Music at no extra cost, you are essentially paying twice for music streaming. Recommendation: Cancel Spotify to save money.", type: 'warning' };
  }
  if (key === 'netflix' && activeNames.includes('disney+')) {
    return { text: "Opinion: You are holding multiple premium TV streaming subscriptions simultaneously. Recommendation: Consider 'subscription hopping'—pause Netflix while watching Disney+, and vice versa, to cut your streaming bill in half.", type: 'warning' };
  }
  if (key === 'disney+' && activeNames.includes('netflix')) {
    return { text: "Opinion: You are holding multiple premium TV streaming subscriptions simultaneously. Recommendation: Consider 'subscription hopping'—pause Disney+ while watching Netflix, and vice versa, to cut your streaming bill in half.", type: 'warning' };
  }

  if (!marketInfo) {
    return { text: `Opinion: You are tracking a custom subscription for $${monthlyPrice.toFixed(2)}/mo. Recommendation: Regularly evaluate if you are getting enough value from this service to justify the cost.`, type: 'neutral' };
  }

  if (marketInfo.standardPrice && monthlyPrice > marketInfo.standardPrice + 1) {
    return { text: customInsight?.overpaying || `Opinion: You are paying $${monthlyPrice.toFixed(2)}/mo, which is higher than the standard market price of $${marketInfo.standardPrice.toFixed(2)}/mo. Recommendation: Check your account settings. You might be on an expensive Family or 4K tier that you don't actually need.`, type: 'alert' };
  }

  if (marketInfo.competitors) {
    const cheaperCompetitors = marketInfo.competitors.filter(comp => {
      const compPrice = getMarketPrice(comp, marketData);
      return compPrice && compPrice < monthlyPrice;
    });

    if (cheaperCompetitors.length > 0) {
      const bestComp = cheaperCompetitors[0];
      const bestCompPrice = getMarketPrice(bestComp, marketData);
      const savings = monthlyPrice - bestCompPrice;
      const compName = marketData[bestComp.toLowerCase()]?.name || bestComp;
      return { text: `Opinion: You are paying a premium for ${marketInfo.name}. Recommendation: Switch to ${compName} for only $${bestCompPrice.toFixed(2)}/mo. This simple change will save you $${savings.toFixed(2)} every month while keeping you in the same category.`, type: 'suggestion' };
    }
  }

  if (sub.billingCycle.toLowerCase() === 'monthly' && sub.price > 10) {
    return { text: `Opinion: You are currently paying month-to-month, which is the most expensive way to subscribe. Recommendation: Upgrade to a yearly billing cycle to immediately lock in a ~15-20% discount.`, type: 'suggestion' };
  }

  return { text: customInsight?.good || `Opinion: You are paying the optimal market rate ($${monthlyPrice.toFixed(2)}/mo) for ${marketInfo.name}. Recommendation: Keep this subscription active as long as you use it regularly. No immediate action required.`, type: 'good' };
};
