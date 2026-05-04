require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));

// ─────────────────────────────────────────────────────────────────────────────
// THE BRAIN — takes raw orders array, returns all insights
// Right now runs on mock data.
// When Swiggy approves: swap mockOrders with real MCP data. Nothing else changes.
// ─────────────────────────────────────────────────────────────────────────────

function analyseOrders(orders, name = 'Aman') {

  // ── BASIC COUNTS ──────────────────────────────────────────────────────────
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);
  const avgOrderValue = Math.round(totalSpent / totalOrders);
  const monthlyAvg = Math.round(totalSpent / 12);
  const couponsSaved = orders.reduce((sum, o) => sum + (o.discount || 0), 0);

  // ── UNIQUE RESTAURANTS & CUISINES ─────────────────────────────────────────
  const restaurantMap = {};
  orders.forEach(o => {
    if (!restaurantMap[o.restaurant]) {
      restaurantMap[o.restaurant] = { orders: 0, spent: 0, cuisine: o.cuisine };
    }
    restaurantMap[o.restaurant].orders += 1;
    restaurantMap[o.restaurant].spent += o.amount;
  });

  const totalRestaurants = Object.keys(restaurantMap).length;
  const topRestaurantName = Object.keys(restaurantMap)
    .sort((a, b) => restaurantMap[b].orders - restaurantMap[a].orders)[0];
  const topRestaurant = {
    name: topRestaurantName,
    orders: restaurantMap[topRestaurantName].orders,
    totalSpent: restaurantMap[topRestaurantName].spent,
    avgRating: 4.6
  };

  // ── CUISINE BREAKDOWN ─────────────────────────────────────────────────────
  const cuisineMap = {};
  orders.forEach(o => {
    cuisineMap[o.cuisine] = (cuisineMap[o.cuisine] || 0) + 1;
  });

  const cuisineEmojis = {
    'Biryani': '🍛', 'Pizza': '🍕', 'Burger': '🍔',
    'Healthy': '🥗', 'Chinese': '🍜', 'Desserts': '🍰',
    'South Indian': '🥘', 'North Indian': '🫕', 'Other': '🍱'
  };

  const totalCuisines = Object.keys(cuisineMap).length;
  const cuisines = Object.keys(cuisineMap)
    .sort((a, b) => cuisineMap[b] - cuisineMap[a])
    .slice(0, 6)
    .map(c => ({
      name: `${cuisineEmojis[c] || '🍱'} ${c}`,
      pct: Math.round((cuisineMap[c] / totalOrders) * 100)
    }));

  // ── TOP DISH ──────────────────────────────────────────────────────────────
  const dishMap = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      dishMap[item.name] = (dishMap[item.name] || 0) + 1;
    });
  });

  const topDishName = Object.keys(dishMap)
    .sort((a, b) => dishMap[b] - dishMap[a])[0];
  const topDishOrders = orders.filter(o => o.items.some(i => i.name === topDishName));
  const topDishAvg = topDishOrders.length > 0
    ? Math.round(topDishOrders.reduce((s, o) => s + o.amount, 0) / topDishOrders.length)
    : 0;
  const topDish = {
    name: topDishName || 'Unknown',
    count: dishMap[topDishName] || 0,
    avgPrice: topDishAvg
  };

  // ── PEAK HOUR ─────────────────────────────────────────────────────────────
  const hourMap = {};
  orders.forEach(o => {
    const h = new Date(o.timestamp).getHours();
    hourMap[h] = (hourMap[h] || 0) + 1;
  });

  const peakHourNum = Object.keys(hourMap)
    .sort((a, b) => hourMap[b] - hourMap[a])[0];

  const formatHour = h => {
    const num = parseInt(h);
    if (num === 0) return '12 AM';
    if (num < 12) return `${num} AM`;
    if (num === 12) return '12 PM';
    return `${num - 12} PM`;
  };

  const peakHour = formatHour(peakHourNum);

  // Build timeline for display (every 2 hours)
  const timeSlots = [
    {label:'12P',hours:[12,13]}, {label:'2P',hours:[14,15]},
    {label:'4P',hours:[16,17]}, {label:'6P',hours:[18,19]},
    {label:'8P',hours:[20,21]}, {label:'10P',hours:[22,23]},
    {label:'12A',hours:[0,1]},  {label:'2A',hours:[2,3]}
  ];

  const maxSlotCount = Math.max(...timeSlots.map(s =>
    s.hours.reduce((sum, h) => sum + (hourMap[h] || 0), 0)
  ));

  const peakHourData = timeSlots.map(s => {
    const count = s.hours.reduce((sum, h) => sum + (hourMap[h] || 0), 0);
    const isPeak = s.hours.includes(parseInt(peakHourNum));
    return {
      label: s.label,
      value: maxSlotCount > 0 ? Math.round((count / maxSlotCount) * 100) : 10,
      peak: isPeak
    };
  });

  // late night % 
  const lateNightOrders = orders.filter(o => {
    const h = new Date(o.timestamp).getHours();
    return h >= 21 || h <= 3;
  }).length;
  const lateNightPct = Math.round((lateNightOrders / totalOrders) * 100);

  // ── PERSONALITY ENGINE ────────────────────────────────────────────────────
  // Computes personality from 3 signals:
  // 1. Loyalty score — how concentrated orders are in top 5 restaurants
  // 2. Exploration score — how many new restaurants tried
  // 3. Late night score — how many orders after 9pm

  const top5Orders = Object.values(restaurantMap)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5)
    .reduce((sum, r) => sum + r.orders, 0);

  const loyaltyScore = top5Orders / totalOrders; // 0 to 1
  const explorationScore = totalRestaurants / totalOrders; // higher = more explorer
  const lateNightScore = lateNightOrders / totalOrders;

  let personality;

  if (loyaltyScore > 0.7 && lateNightScore < 0.2) {
    personality = {
      emoji: '🔁',
      type: 'THE LOYAL BINGER',
      desc: 'You find what you love and stick with it. Most of your orders are from the same handful of places. You\'re not boring — you just know what works.',
      tags: ['High loyalty score', 'Low exploration', 'Creature of habit']
    };
  } else if (explorationScore > 0.4) {
    personality = {
      emoji: '🗺',
      type: 'THE FOOD EXPLORER',
      desc: 'You treat Swiggy like a food passport. New restaurants, new cuisines — you\'re always trying something different. Your feed is basically a food diary.',
      tags: ['High exploration score', 'Wide cuisine range', 'Low repeat rate']
    };
  } else if (lateNightScore > 0.35) {
    personality = {
      emoji: '🌙',
      type: 'THE MIDNIGHT MUNCHER',
      desc: 'Most people order dinner. You order a second dinner. After 9 PM is when things get interesting for you — and Swiggy loves you for it.',
      tags: ['Night owl orderer', 'Peak hour: late night', 'Delivery hero\'s favourite']
    };
  } else if (avgOrderValue > 400) {
    personality = {
      emoji: '👑',
      type: 'THE PREMIUM PICKER',
      desc: 'You don\'t compromise on food. Your average order is higher than most — you pick quality over quantity every single time.',
      tags: ['High avg order value', 'Premium restaurants', 'Quality over quantity']
    };
  } else {
    personality = {
      emoji: '⚡',
      type: 'THE EFFICIENT EATER',
      desc: 'You know what you want, you order it, and you get on with your day. No fuss, good value, consistent choices. Swiggy\'s most reliable user.',
      tags: ['Consistent orderer', 'Good value focus', 'Reliable patterns']
    };
  }

  return {
    name,
    totalOrders,
    totalSpent,
    avgOrderValue,
    monthlyAvg,
    couponsSaved,
    totalRestaurants,
    totalCuisines,
    topDish,
    topRestaurant,
    peakHour,
    peakHourData,
    lateNightPct,
    cuisines,
    personality
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK ORDERS — realistic fake data that mirrors real Swiggy MCP response shape
// Replace this array with real MCP data when Swiggy approves
// ─────────────────────────────────────────────────────────────────────────────

const mockOrders = [
  // Biryani orders — most frequent
  ...Array.from({length:47}, (_,i) => ({
    id: `ord_${i}`,
    restaurant: 'Meghana Foods',
    cuisine: 'Biryani',
    amount: 270 + Math.floor(Math.random() * 60),
    discount: Math.random() > 0.6 ? 40 : 0,
    timestamp: new Date(2025, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1,
      [22,23,21,20][Math.floor(Math.random()*4)], 0).toISOString(),
    items: [{ name: 'Chicken Biryani', price: 280 }]
  })),
  // Pizza orders
  ...Array.from({length:28}, (_,i) => ({
    id: `ord_p${i}`,
    restaurant: ["Domino's", "Pizza Hut", "La Pino'z"][Math.floor(Math.random()*3)],
    cuisine: 'Pizza',
    amount: 350 + Math.floor(Math.random()*150),
    discount: Math.random() > 0.5 ? 60 : 0,
    timestamp: new Date(2025, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1,
      [19,20,21,14][Math.floor(Math.random()*4)], 0).toISOString(),
    items: [{ name: 'Margherita Pizza', price: 350 }]
  })),
  // Burger orders
  ...Array.from({length:22}, (_,i) => ({
    id: `ord_b${i}`,
    restaurant: ["McDonald's", "Burger King", "Shake Shack"][Math.floor(Math.random()*3)],
    cuisine: 'Burger',
    amount: 200 + Math.floor(Math.random()*100),
    discount: 0,
    timestamp: new Date(2025, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1,
      [13,14,20,22][Math.floor(Math.random()*4)], 0).toISOString(),
    items: [{ name: 'Chicken Burger', price: 220 }]
  })),
  // Healthy bowls
  ...Array.from({length:18}, (_,i) => ({
    id: `ord_h${i}`,
    restaurant: ['Salad Days', 'Wow Momo', 'EatFit'][Math.floor(Math.random()*3)],
    cuisine: 'Healthy',
    amount: 280 + Math.floor(Math.random()*80),
    discount: 0,
    timestamp: new Date(2025, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1,
      [12,13,14][Math.floor(Math.random()*3)], 0).toISOString(),
    items: [{ name: 'Protein Bowl', price: 290 }]
  })),
  // Chinese
  ...Array.from({length:12}, (_,i) => ({
    id: `ord_c${i}`,
    restaurant: ['Momo Station', 'China Bowl', 'Wok Express'][Math.floor(Math.random()*3)],
    cuisine: 'Chinese',
    amount: 240 + Math.floor(Math.random()*100),
    discount: 0,
    timestamp: new Date(2025, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1,
      [19,20,21][Math.floor(Math.random()*3)], 0).toISOString(),
    items: [{ name: 'Veg Fried Rice', price: 250 }]
  })),
  // South Indian
  ...Array.from({length:10}, (_,i) => ({
    id: `ord_si${i}`,
    restaurant: ['Vasudev Adigas', 'SLV', 'Brahmin Coffee Bar'][Math.floor(Math.random()*3)],
    cuisine: 'South Indian',
    amount: 150 + Math.floor(Math.random()*80),
    discount: 0,
    timestamp: new Date(2025, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1,
      [8,9,10][Math.floor(Math.random()*3)], 0).toISOString(),
    items: [{ name: 'Masala Dosa', price: 160 }]
  })),
  // Desserts
  ...Array.from({length:8}, (_,i) => ({
    id: `ord_d${i}`,
    restaurant: ['Baskin Robbins', 'Belgian Waffle', 'Keventers'][Math.floor(Math.random()*3)],
    cuisine: 'Desserts',
    amount: 180 + Math.floor(Math.random()*100),
    discount: 0,
    timestamp: new Date(2025, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1,
      [15,16,22,23][Math.floor(Math.random()*4)], 0).toISOString(),
    items: [{ name: 'Chocolate Ice Cream', price: 190 }]
  })),
];

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Main insights endpoint — runs analysis engine on orders
app.get('/api/insights', (req, res) => {
  const insights = analyseOrders(mockOrders, 'Aman');
  res.json({ success: true, data: insights });
});

app.listen(PORT, () => {
  console.log(`
  ✅ Swiggy Wrapped server running
  🧠 AI analysis engine: active
  🌐 http://localhost:${PORT}
  📦 Mock data mode — swap mockOrders for real MCP data after approval
  `);
});