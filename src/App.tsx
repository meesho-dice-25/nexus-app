"use client"

import { useState } from "react"
import { Search, Plus, MapPin, Package, Target } from "lucide-react"
import VendorSection from "./components/VendorSection"
import CustomerSection from "./components/CustomerSection"
import CampaignSection from "./components/CampaignSection"

function App() {
  const [activeTab, setActiveTab] = useState<"customer" | "vendor" | "campaigns">("customer")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-card border-r border-border min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Package className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">Marketplace</h1>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("customer")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "customer"
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Search className="w-4 h-4" />
                Customer Portal
              </button>
              <button
                onClick={() => setActiveTab("vendor")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "vendor"
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Plus className="w-4 h-4" />
                Vendor Portal
              </button>
              <button
                onClick={() => setActiveTab("campaigns")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "campaigns"
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Target className="w-4 h-4" />
                Crowdfunding
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="border-b border-border bg-card/50">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {activeTab === "customer"
                      ? "Find Products"
                      : activeTab === "vendor"
                        ? "Manage Inventory"
                        : "Crowdfunding Campaigns"}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === "customer"
                      ? "Search for products from local vendors in your area"
                      : activeTab === "vendor"
                        ? "Add and manage your product listings"
                        : "Support local vendors or create your own funding campaign"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  Location-based marketplace
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {activeTab === "customer" ? (
              <CustomerSection />
            ) : activeTab === "vendor" ? (
              <VendorSection />
            ) : (
              <CampaignSection />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App