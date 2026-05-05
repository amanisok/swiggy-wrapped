# 🍕 Swiggy Wrapped

> Your personalized food delivery journey, visualized beautifully.

Swiggy Wrapped is an innovative analytics platform that transforms your Swiggy order history into engaging, personalized insights. Similar to Spotify Wrapped, it generates a comprehensive report of your eating patterns, restaurant preferences, spending habits, and personality based on your food ordering behavior.

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.2+-blue.svg)](https://expressjs.com/)

---

## ✨ Features

### 📊 Comprehensive Analytics
- **Order Metrics**: Total orders, total spent, average order value, monthly spending average
- **Savings Tracking**: Track coupon savings and discounts applied
- **Restaurant Insights**: Identify your most-loved restaurant, total restaurants visited, cuisine breakdown
- **Temporal Analysis**: Peak eating hours, late-night patterns, time-based spending trends

### 🎭 Personality Profiling
Discover your eating personality based on 5 unique archetypes:
- **🔁 The Loyal Binger** - High loyalty, low exploration (concentrated restaurant visits)
- **🗺️ The Food Explorer** - High restaurant variety and cuisine diversity
- **🌙 The Midnight Muncher** - Late-night ordering enthusiast (>35% orders after 9 PM)
- **👑 The Premium Picker** - Loves premium options (average order >₹400)
- **⚡ The Efficient Eater** - Balanced, reliable patterns across all metrics

### 🎨 Beautiful UI/UX
- **Responsive Design**: Optimized for mobile-first experience (480x720px card layout)
- **Smooth Animations**: Fade-up animations, staggered transitions, smooth progress bars
- **Dark Theme**: Premium dark theme inspired by Swiggy's brand colors
- **Interactive Cards**: Swipeable card interface with 8 unique insight visualizations
- **Timeline Visualization**: Peak hour analysis with dynamic bar charts

### 🚀 Production-Ready
- **Cold Start Optimization**: Auto-retry logic for seamless server wake-up
- **Error Handling**: Graceful fallback messages and user-friendly error states
- **Data Safety**: Null/NaN safety checks in data processing
- **Performance**: Optimized calculations and rendering

---

## 🛠️ Tech Stack

### Backend
- **Express.js** (v5.2.1) - Fast, unopinionated web framework
- **Node.js** - JavaScript runtime

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript** - No external dependencies for frontend logic

### APIs & Libraries
- **Anthropic SDK** (@anthropic-ai/sdk) - AI-powered insights (future integration)
- **Axios** - HTTP client for API requests
- **dotenv** - Environment variable management

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/swiggy-wrapped.git
cd swiggy-wrapped
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
PORT=3001
ANTHROPIC_API_KEY=your_api_key_here
```

4. **Start the server**
```bash
npm start
```
or
```bash
node server.js
```

5. **Access the application**
Open your browser and navigate to:
```
http://localhost:3001
```

---

## 📖 Usage

### Basic Setup
The application uses a mock data system by default for demonstration. To integrate with real Swiggy data:

1. Replace the `mockOrders` array in `server.js` with real order data from Swiggy's API or database
2. No changes needed in the analysis logic - the `analyseOrders()` function accepts any orders array

### Data Format
Orders should follow this structure:
```javascript
{
  restaurant: "Restaurant Name",
  cuisine: "Cuisine Type",
  amount: 250,           // Order total in rupees
  discount: 50,          // Discount/coupon savings (optional)
  orderedAt: "21:30"     // Time in HH:MM format
}
```

### Running Tests
```bash
npm test
```

---

## 📊 Data Analysis Pipeline

### Analytics Engine (`analyseOrders()`)
The core analysis function processes raw order data and generates:

#### 1. **Basic Metrics**
- Total orders count
- Total amount spent
- Average order value
- Monthly spending average
- Total coupon savings

#### 2. **Restaurant Intelligence**
- Top restaurant by frequency
- Total unique restaurants
- Spending per restaurant
- Restaurant ratings
- Cuisine breakdown by order count

#### 3. **Temporal Patterns**
- Peak ordering hours (hourly distribution)
- Late-night ordering percentage
- Time-based spending analysis

#### 4. **Personality Scoring**
Calculated using:
- **Loyalty Score**: Concentration of orders in top 5 restaurants
- **Exploration Score**: Ratio of unique restaurants to total orders
- **Late Night Score**: Percentage of orders after 9 PM
- **Order Value Score**: Average order amount positioning

---

## 🎨 Design System

### Color Palette (Swiggy Brand)
```css
Primary Orange:    #FC8019      /* Swiggy's signature color */
Orange Hover:      #FF9A45      /* Lighter shade for interactions */
Background:        #0A0A0A      /* Deep black */
Surface:           #111008      /* Card backgrounds */
Text Primary:      #FDFAF5      /* Cream white */
Text Secondary:    #8A7560      /* Muted gold */
Success Green:     #4ADE80      /* Positive insights */
Warning Red:       #F87171      /* Alert states */
```

### Typography
- **Display Font**: Bebas Neue - Bold, impactful headlines
- **Body Font**: Plus Jakarta Sans - Readable, modern body copy

---

## 📁 Project Structure

```
swiggy-wrapped/
├── server.js              # Express backend, analytics engine
├── package.json           # Dependencies and scripts
├── README.md              # This file
├── DESIGN_CHANGELOG.md    # Design and feature history
├── public/
│   └── index.html         # Frontend application
└── .env                   # Environment variables (not in repo)
```

---

## 🔄 Current Status

### ✅ Completed
- Core analytics engine with 5 personality types
- Beautiful, responsive UI with smooth animations
- Cold start optimization and retry logic
- Data processing pipeline with safety checks
- Mock data system for development

### 🔜 Upcoming Features
- Real Swiggy API integration
- Multi-user support and accounts
- Data export (PDF, image sharing)
- Advanced filters and date range selection
- Community leaderboards
- Integration with Anthropic API for AI-powered insights

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and formatting
- Test changes thoroughly with mock data
- Update documentation for new features
- Keep commits atomic and well-described

---

## 🐛 Known Limitations

- Currently uses mock data; requires Swiggy API integration for real usage
- Limited to single-user, session-based analytics
- Mobile web optimization needed for smaller screens
- No data persistence between sessions

---

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact & Support

For questions, suggestions, or collaboration opportunities:
- 📧 Email: [your-email@example.com]
- 🐙 GitHub: [@yourusername](https://github.com/yourusername)
- 🍕 Swiggy Partnership: [partnership-email@swiggy.com]

---

## 🙏 Acknowledgments

- **Swiggy** for the inspiration and brand guidelines
- **Spotify Wrapped** for the concept foundation
- **The Developer Community** for feedback and ideas

---

<div align="center">

**Made with ❤️ for food lovers everywhere**

[⬆ Back to top](#-swiggy-wrapped)

</div>
