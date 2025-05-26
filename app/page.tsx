"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Star,
  Search,
  Filter,
  Building2,
  Truck,
  Calendar,
  Target,
} from "lucide-react"

// Sample data for the DSS
const salesData = [
  { month: "Jan", sales: 45000, forecast: 42000 },
  { month: "Feb", sales: 52000, forecast: 48000 },
  { month: "Mar", sales: 48000, forecast: 50000 },
  { month: "Apr", sales: 61000, forecast: 55000 },
  { month: "May", sales: 55000, forecast: 58000 },
  { month: "Jun", sales: 67000, forecast: 62000 },
]

const topProducts = [
  { name: "Rice (50kg)", sales: 1250, revenue: 875000, trend: "up", growth: 12 },
  { name: "Cooking Oil (5L)", sales: 890, revenue: 623000, trend: "up", growth: 8 },
  { name: "Sugar (1kg)", sales: 1100, revenue: 550000, trend: "down", growth: -3 },
  { name: "Bread", sales: 2100, revenue: 420000, trend: "up", growth: 15 },
  { name: "Milk (1L)", sales: 750, revenue: 375000, trend: "up", growth: 6 },
]

const customerSegments = [
  { name: "Regular Customers", value: 45, color: "#8884d8" },
  { name: "Occasional Buyers", value: 30, color: "#82ca9d" },
  { name: "New Customers", value: 15, color: "#ffc658" },
  { name: "VIP Customers", value: 10, color: "#ff7300" },
]

const suppliers = [
  { name: "Golden Harvest Ltd", products: 45, reliability: 95, cost: "Low", partnership: "Strategic" },
  { name: "Fresh Foods Nigeria", products: 32, reliability: 88, cost: "Medium", partnership: "Regular" },
  { name: "Ogun State Farms", products: 28, reliability: 92, cost: "Low", partnership: "Strategic" },
  { name: "Metro Distributors", products: 38, reliability: 85, cost: "High", partnership: "Regular" },
  { name: "Local Cooperative", products: 22, reliability: 90, cost: "Low", partnership: "Strategic" },
]

const inventoryData = [
  { category: "Grains & Cereals", stock: 85, reorder: 20, status: "Good" },
  { category: "Dairy Products", stock: 45, reorder: 30, status: "Low" },
  { category: "Beverages", stock: 92, reorder: 25, status: "Good" },
  { category: "Household Items", stock: 15, reorder: 20, status: "Critical" },
  { category: "Snacks", stock: 78, reorder: 15, status: "Good" },
]

export default function SoaringMartDSS() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Soaring Mart DSS</h1>
                  <p className="text-sm text-gray-500">Redemption City, Ogun State</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Today
              </Button>
              <Button size="sm">
                <Target className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦2,847,500</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6,890</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.2% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +15.3% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦892,300</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-600 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -2.1% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales vs Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, ""]} />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="forecast" stroke="#82ca9d" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={customerSegments}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {customerSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Analysis</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search products..." className="pl-8 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{product.revenue.toLocaleString()}</p>
                        <div className="flex items-center space-x-2">
                          {product.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-sm ${product.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                            {product.growth > 0 ? "+" : ""}
                            {product.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <h2 className="text-2xl font-bold">Customer Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Purchase Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Morning (6AM - 12PM)</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={65} className="w-24" />
                        <span className="text-sm">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Afternoon (12PM - 6PM)</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-24" />
                        <span className="text-sm">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Evening (6PM - 10PM)</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={45} className="w-24" />
                        <span className="text-sm">45%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Loyalty Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Repeat Purchase Rate</span>
                      <Badge variant="secondary">78%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Order Value</span>
                      <Badge variant="secondary">₦2,450</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Customer Lifetime Value</span>
                      <Badge variant="secondary">₦45,600</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Churn Rate</span>
                      <Badge variant="destructive">12%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <h2 className="text-2xl font-bold">Inventory Management</h2>

            <Card>
              <CardHeader>
                <CardTitle>Stock Levels by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Package className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-semibold">{item.category}</h3>
                          <p className="text-sm text-gray-500">Reorder at {item.reorder}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Progress value={item.stock} className="w-32" />
                        <span className="text-sm font-medium">{item.stock}%</span>
                        <Badge
                          variant={
                            item.status === "Critical" ? "destructive" : item.status === "Low" ? "secondary" : "default"
                          }
                        >
                          {item.status}
                        </Badge>
                        {item.status === "Critical" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers" className="space-y-6">
            <h2 className="text-2xl font-bold">Supplier Analysis</h2>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suppliers.map((supplier, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Truck className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{supplier.name}</h3>
                          <p className="text-sm text-gray-500">{supplier.products} products supplied</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Reliability</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{supplier.reliability}%</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Cost</p>
                          <Badge
                            variant={
                              supplier.cost === "Low"
                                ? "default"
                                : supplier.cost === "Medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {supplier.cost}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Partnership</p>
                          <Badge variant={supplier.partnership === "Strategic" ? "default" : "outline"}>
                            {supplier.partnership}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecasting Tab */}
          <TabsContent value="forecasting" className="space-y-6">
            <h2 className="text-2xl font-bold">Sales Forecasting</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecast (Next 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, ""]} />
                      <Area type="monotone" dataKey="forecast" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">Inventory Optimization</h4>
                      <p className="text-sm text-blue-700">
                        Increase rice stock by 20% for next month based on seasonal trends.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900">Customer Retention</h4>
                      <p className="text-sm text-green-700">
                        Launch loyalty program for customers spending above ₦5,000 monthly.
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-900">Supplier Strategy</h4>
                      <p className="text-sm text-yellow-700">
                        Consider strategic partnership with Golden Harvest Ltd for better pricing.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900">Sales Optimization</h4>
                      <p className="text-sm text-purple-700">
                        Focus marketing efforts on afternoon hours when sales peak at 85%.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
