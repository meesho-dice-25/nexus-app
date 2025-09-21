"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MapPin, Target, Calendar, Users, TrendingUp, AlertCircle } from "lucide-react"

interface Campaign {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  vendorName: string
  location: string
  distance: number
  deadline: string
  backers: number
  category: string
  imageUrl: string
  status: "active" | "funded" | "delivered" | "failed"
}

interface Location {
  latitude: number
  longitude: number
}

export default function CampaignSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchRadius, setSearchRadius] = useState(10)

  // Form state for creating campaigns
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    deadline: "",
    category: "",
  })

  const dummyCampaign: Campaign = {
    id: "camp_001",
    title: "Artisan Coffee Roastery Expansion",
    description:
      "Help us expand our local coffee roastery to serve premium, freshly roasted beans to our community. We need funding for new equipment and facility upgrades.",
    targetAmount: 15000,
    currentAmount: 8750,
    vendorName: "Mountain Peak Coffee Co.",
    location: "Downtown District",
    distance: 2.3,
    deadline: "2024-12-15",
    backers: 47,
    category: "food",
    imageUrl: "/coffee-roastery-equipment-artisan-beans.jpg",
    status: "active",
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  useEffect(() => {
    if (userLocation) {
      fetchCampaigns()
    }
  }, [userLocation, searchRadius])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setError("")
        },
        (error) => {
          if (error.code !== error.PERMISSION_DENIED) {
            console.error("Geolocation error:", error)
          }

          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError(
                "Location access was denied. Please enable location services in your browser settings to view and create campaigns in your area.",
              )
              break
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable. Please check your internet connection and try again.")
              break
            case error.TIMEOUT:
              setError("Location request timed out. Please try again.")
              break
            default:
              setError("Unable to get your location. Please enable location services and refresh the page.")
              break
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  const fetchCampaigns = async () => {
    if (!userLocation) return

    setLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

      // In a real app, this would be the actual API call:
      // const response = await fetch(`http://localhost:5000/api/campaigns/nearby`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     latitude: userLocation.latitude,
      //     longitude: userLocation.longitude,
      //     radius: searchRadius,
      //   }),
      // })

      // For now, return the dummy campaign
      setCampaigns([dummyCampaign])
    } catch (err) {
      setError("Failed to load campaigns. Please try again.")
      console.error("Error fetching campaigns:", err)
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userLocation) {
      setError("Location is required to create a campaign")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          targetAmount: Number.parseFloat(formData.targetAmount),
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create campaign")
      }

      setFormData({
        title: "",
        description: "",
        targetAmount: "",
        deadline: "",
        category: "",
      })
      setShowCreateForm(false)
      fetchCampaigns()
    } catch (err) {
      setError("Failed to create campaign. Please try again.")
      console.error("Error creating campaign:", err)
    } finally {
      setLoading(false)
    }
  }

  const backCampaign = async (campaignId: string, amount: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${campaignId}/back`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        throw new Error("Failed to back campaign")
      }

      fetchCampaigns()
    } catch (err) {
      setError("Failed to back campaign. Please try again.")
      console.error("Error backing campaign:", err)
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-blue-400"
      case "funded":
        return "text-green-400"
      case "delivered":
        return "text-emerald-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "funded":
        return "Funded - Awaiting Delivery"
      case "delivered":
        return "Delivered"
      case "failed":
        return "Failed"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Search Radius:</label>
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="bg-input border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={1}>1 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={50}>50 km</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          {showCreateForm ? "Cancel" : "Create Campaign"}
        </button>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Campaign</h3>
          <form onSubmit={createCampaign} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Campaign Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="food">Food & Beverage</option>
                  <option value="tech">Technology</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Garden</option>
                  <option value="health">Health & Beauty</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-input border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring h-24 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Target Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-destructive text-sm">{error}</span>
        </div>
      )}

      {/* Funding Rules Info */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          How Crowdfunding Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary font-semibold text-xs">1</span>
            </div>
            <div>
              <p className="font-medium">Create Campaign</p>
              <p className="text-muted-foreground">Vendors create campaigns for their products with funding goals</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary font-semibold text-xs">2</span>
            </div>
            <div>
              <p className="font-medium">50% Threshold</p>
              <p className="text-muted-foreground">Once 50% funding is reached, vendors must deliver products</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary font-semibold text-xs">3</span>
            </div>
            <div>
              <p className="font-medium">Full Payment</p>
              <p className="text-muted-foreground">After delivery confirmation, vendors receive 100% of funds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && !showCreateForm && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Campaigns Grid */}
      {!loading && campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const progressPercentage = getProgressPercentage(campaign.currentAmount, campaign.targetAmount)
            const isHalfwayFunded = progressPercentage >= 50

            return (
              <div
                key={campaign.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted relative">
                  <img
                    src={
                      campaign.imageUrl ||
                      `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(campaign.title) || "/placeholder.svg"}`
                    }
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)} bg-background/90`}
                  >
                    {getStatusText(campaign.status)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg leading-tight">{campaign.title}</h3>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {campaign.category}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{campaign.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        ${campaign.currentAmount.toLocaleString()} / ${campaign.targetAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${isHalfwayFunded ? "bg-green-500" : "bg-primary"}`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{progressPercentage.toFixed(1)}% funded</span>
                      {isHalfwayFunded && (
                        <span className="text-green-400 font-medium flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Delivery Required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {campaign.backers} backers
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {campaign.distance.toFixed(1)} km away
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        const amount = prompt("Enter backing amount ($):")
                        if (amount && !isNaN(Number(amount))) {
                          backCampaign(campaign.id, Number(amount))
                        }
                      }}
                      disabled={campaign.status !== "active"}
                      className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      Back Project
                    </button>
                    <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors text-sm">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && campaigns.length === 0 && userLocation && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
          <p className="text-muted-foreground mb-4">
            No crowdfunding campaigns found in your area. Try increasing the search radius or create the first campaign!
          </p>
        </div>
      )}
    </div>
  )
}
