"use client"

import { useState, useEffect } from "react"
import { MapPin, Search, ShoppingCart, Package, AlertCircle } from "lucide-react"

interface Product {
  product: {
    id: string
    name: string
    description: string
    price: number
    stock: number
  }
  vendor: {
    id: string
    name: string
    description: string
    location: [number, number]
  }
}

interface Location {
  latitude: number
  longitude: number
}

const CustomerSection = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [radius, setRadius] = useState(5000)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
console.log("API_URL:", API_URL); // Debugging line to check the API URL
  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          setError("Unable to get your location. Please enable location services.")
          console.error("Geolocation error:", error)
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  const searchProducts = async () => {
    if (!searchQuery.trim() || !location) {
      setError("Please enter a search query and enable location services.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `${API_URL}/products/nearby?q=${encodeURIComponent(searchQuery)}&lat=${location.latitude}&long=${location.longitude}&radius=${radius}`,
      )

      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to search products")
        setProducts([])
      }
    } catch (err) {
      setError("Network error. Please check your connection.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const confirmOrder = async (productId: string, productName: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          userId: "customer-123", // In a real app, this would come from authentication
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Order confirmed for ${productName}! Remaining stock: ${data.product.remainingStock}`)
        // Refresh the search results
        searchProducts()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to confirm order")
      }
    } catch (err) {
      alert("Network error. Please try again.")
    }
  }

  const calculateDistance = (vendorLocation: [number, number]) => {
    if (!location) return 0

    const R = 6371 // Earth's radius in km
    const dLat = ((vendorLocation[1] - location.latitude) * Math.PI) / 180
    const dLon = ((vendorLocation[0] - location.longitude) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((location.latitude * Math.PI) / 180) *
        Math.cos((vendorLocation[1] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c).toFixed(1)
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Search Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-6">
          {/* Location Status */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                location
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              <MapPin className="w-4 h-4" />
              {location ? "Location detected" : "Location required"}
            </div>
            {!location && (
              <button onClick={getCurrentLocation} className="text-sm text-primary hover:underline">
                Enable location services
              </button>
            )}
          </div>

          {/* Search Form */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products (e.g., 'fresh apples', 'organic bread')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground"
                  onKeyPress={(e) => e.key === "Enter" && searchProducts()}
                />
              </div>
              <button
                onClick={searchProducts}
                disabled={loading || !location}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm text-muted-foreground">Radius:</label>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="px-3 py-1.5 bg-input border border-border rounded text-sm text-foreground"
              >
                <option value={1000}>1 km</option>
                <option value={5000}>5 km</option>
                <option value={10000}>10 km</option>
                <option value={20000}>20 km</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {products.length > 0 && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </h3>
          </div>
        )}

        <div className="grid gap-4">
          {products.map((item, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 hover:border-border/60 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{item.product.name}</h4>
                    <p className="text-muted-foreground mt-1">{item.product.description}</p>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-4 h-4" />
                      <span>{item.product.stock} in stock</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{calculateDistance(item.vendor.location)} km away</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Vendor: </span>
                      <span className="text-foreground font-medium">{item.vendor.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.vendor.description}</p>
                  </div>
                </div>

                <div className="text-right space-y-3 ml-6">
                  <div className="text-2xl font-bold text-success">${item.product.price.toFixed(2)}</div>
                  <button
                    onClick={() => confirmOrder(item.product.id, item.product.name)}
                    className="px-4 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 flex items-center gap-2 text-sm font-medium"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && searchQuery && !loading && !error && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or increasing the radius.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerSection
