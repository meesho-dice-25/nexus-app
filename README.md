# 🛒 Marketplace Frontend

A professional, geolocation-enabled marketplace platform built with React, Vite, and Tailwind CSS. This application provides separate portals for vendors to list products and customers to discover and purchase items based on their location.

## ✨ Features

### 🏪 Vendor Portal
- **Product Management**: Add products with name, description, price, and stock quantity
- **Geolocation Integration**: Automatic location detection for vendor positioning
- **Real-time Validation**: Form validation with error handling and success feedback
- **Professional UI**: Dark theme with modern card-based layouts

### 🛍️ Customer Portal
- **Smart Search**: Search products by name with geolocation-based filtering
- **Location-Based Discovery**: Find products within customizable radius (1km - 20km)
- **Distance Calculation**: See exact distance to each vendor
- **One-Click Ordering**: Instant order confirmation with stock updates
- **Product Details**: Comprehensive product cards with pricing and availability

### 🎨 Design Features
- **Professional Dark Theme**: Vercel-inspired design system
- **Responsive Layout**: Mobile-first design with desktop enhancements
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessibility**: ARIA labels and keyboard navigation support
- **Modern Typography**: Clean, readable font hierarchy

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server running on `http://localhost:5000`

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd marketplace-frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   \`\`\`
   http://localhost:5173
   \`\`\`

### Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## 🔧 Configuration

### Environment Setup
Ensure your backend API is running on `http://localhost:5000` with the following endpoints:

- `POST /api/products` - Add new products
- `GET /api/products/nearby` - Find products by location
- `POST /api/orders/confirm` - Confirm orders

### Geolocation Permissions
The app requires browser geolocation permissions for:
- Vendor location detection
- Customer proximity search
- Distance calculations

## 📁 Project Structure

\`\`\`
marketplace-frontend/
├── src/
│   ├── components/
│   │   ├── CustomerSection.tsx    # Customer portal component
│   │   └── VendorSection.tsx      # Vendor portal component
│   ├── App.tsx                    # Main application component
│   ├── App.css                    # Component-specific styles
│   └── index.css                  # Global styles and design tokens
├── app/
│   ├── page.tsx                   # Next.js page wrapper
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Tailwind configuration
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
\`\`\`

## 🛠️ Technologies Used

### Frontend Framework
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Next.js 15** - React framework for production

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Custom Design System** - Professional dark theme
- **Responsive Design** - Mobile-first approach

### APIs & Integration
- **Geolocation API** - Browser location services
- **Fetch API** - HTTP client for backend communication
- **REST API** - RESTful backend integration

## 🔌 API Integration

### Backend Endpoints

#### Add Product
\`\`\`javascript
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product Description",
  "price": 29.99,
  "stock": 100,
  "latitude": 40.7128,
  "longitude": -74.0060
}
\`\`\`

#### Find Nearby Products
\`\`\`javascript
GET /api/products/nearby?lat=40.7128&lng=-74.0060&radius=5&search=coffee
\`\`\`

#### Confirm Order
\`\`\`javascript
POST /api/orders/confirm
Content-Type: application/json

{
  "productId": "product-id",
  "quantity": 1
}
\`\`\`

## 🎯 Usage Guide

### For Vendors
1. Click on the **"Vendor Portal"** tab
2. Allow location access when prompted
3. Fill in product details (name, description, price, stock)
4. Click **"Add Product"** to list your item
5. View success confirmation

### For Customers
1. Stay on the **"Customer Portal"** tab (default)
2. Allow location access when prompted
3. Enter search terms in the search bar
4. Adjust search radius using the slider
5. Browse available products with distance information
6. Click **"Order Now"** to purchase items

## 🔒 Security Features

- **Input Validation**: Client-side form validation
- **Error Handling**: Comprehensive error management
- **Location Privacy**: Geolocation used only for distance calculations
- **API Security**: Proper HTTP methods and content types

## 🚀 Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Efficient Rendering**: React optimization patterns
- **Minimal Bundle Size**: Tree-shaking and code splitting
- **Fast Development**: Vite's lightning-fast HMR

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check that your backend API is running on `http://localhost:5000`
2. Ensure geolocation permissions are granted
3. Verify all dependencies are installed correctly
4. Check browser console for error messages

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Order history and tracking
- [ ] Payment integration
- [ ] Product categories and filters
- [ ] Vendor analytics dashboard
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Advanced search filters

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
