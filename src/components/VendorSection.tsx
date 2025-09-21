"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MapPin, Plus, Package, DollarSign, AlertCircle, CheckCircle } from "lucide-react"

interface Location {
  latitude: number
  longitude: number
}

interface ProductForm {
  name: string
  description: string
  price: string
  stock: string
}

const VendorSection = () => {
  const [location, setLocation] = useState<Location | null>(null)
  const [vendorId, setVendorId] = useState("68cfecac15ec98344fee5c1d")
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    stock: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productForm.name.trim() || !productForm.description.trim() || !productForm.price || !productForm.stock) {
      setError("Please fill in all fields.")
      return
    }

    const price = Number.parseFloat(productForm.price)
    const stock = Number.parseInt(productForm.stock)

    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price.")
      return
    }

    if (isNaN(stock) || stock < 0) {
      setError("Please enter a valid stock quantity.")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`${API_URL}/vendors/${vendorId}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productForm.name.trim(),
          description: productForm.description.trim(),
          price,
          stock,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(`Product "${data.name}" added successfully!`)
        setProductForm({
          name: "",
          description: "",
          price: "",
          stock: "",
        })
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to add product")
      }
    } catch (err) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Vendor Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Vendor Dashboard</h3>
            <p className="text-muted-foreground text-sm mt-1">ID: {vendorId}</p>
            <div className="flex items-center gap-2 mt-3">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  location
                    ? "bg-success/10 text-success border border-success/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                <MapPin className="w-4 h-4" />
                {location ? "Location active" : "Location required"}
              </div>
              {!location && (
                <button onClick={getCurrentLocation} className="text-sm text-primary hover:underline">
                  Enable location
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
          <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
          <p className="text-success">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Add Product Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Add New Product</h3>
          <p className="text-muted-foreground text-sm mt-1">List products for customers to discover</p>
        </div>

        <form onSubmit={addProduct} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={productForm.name}
                onChange={handleInputChange}
                placeholder="e.g., Fresh Organic Apples"
                className="w-full px-4 py-3 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={productForm.description}
                onChange={handleInputChange}
                placeholder="Describe your product quality, origin, and features"
                rows={3}
                className="w-full px-4 py-3 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                  Price ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={productForm.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-foreground mb-2">
                  Stock Quantity
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={productForm.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !location}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            {loading ? "Adding Product..." : "Add Product"}
          </button>

          {!location && (
            <p className="text-sm text-muted-foreground text-center">Location services required to list products</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default VendorSection
