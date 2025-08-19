"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Package,
  DollarSign,
  RefreshCw,
  Lightbulb,
  Star,
  Clock,
} from "lucide-react"
import { getSales, getProducts, getCustomers } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

interface AIInsight {
  type: "success" | "warning" | "danger" | "info"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  action: string
  confidence: number
}

interface SalesAnalytics {
  totalRevenue: number
  totalSales: number
  averageOrderValue: number
  topProducts: any[]
  salesTrend: any[]
  customerSegments: any[]
  monthlyGrowth: number
  weeklyGrowth: number
  dailyGrowth: number
}

interface ForecastData {
  period: string
  predicted: number
  confidence: number
  actual?: number
}

export function AIForecasting() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    generateAIRecommendations()
  }, [])

  const generateAIRecommendations = async () => {
    setLoading(true)
    try {
      const [sales, products, customers] = await Promise.all([getSales(), getProducts(), getCustomers()])

      // Analyze sales data
      const salesAnalytics = analyzeSalesData(sales, products, customers)
      setAnalytics(salesAnalytics)

      // Generate AI insights
      const aiInsights = generateInsights(salesAnalytics, sales, products)
      setInsights(aiInsights)

      // Generate forecast
      const forecastData = generateForecast(sales)
      setForecast(forecastData)

      setLastUpdated(new Date())

      toast({
        title: "AI Analysis Complete",
        description: `Generated ${aiInsights.length} insights and recommendations`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI recommendations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const analyzeSalesData = (sales: any[], products: any[], customers: any[]): SalesAnalytics => {
    const totalRevenue = sales.reduce((sum, sale) => sum + Number.parseFloat(sale.total_amount), 0)
    const totalSales = sales.length
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0

    // Calculate growth rates
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const recentSales = sales.filter((sale) => new Date(sale.sale_date) >= oneWeekAgo)
    const monthlySales = sales.filter((sale) => new Date(sale.sale_date) >= oneMonthAgo)
    const dailySales = sales.filter((sale) => new Date(sale.sale_date) >= oneDayAgo)

    const weeklyRevenue = recentSales.reduce((sum, sale) => sum + Number.parseFloat(sale.total_amount), 0)
    const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + Number.parseFloat(sale.total_amount), 0)
    const dailyRevenue = dailySales.reduce((sum, sale) => sum + Number.parseFloat(sale.total_amount), 0)

    // Calculate growth percentages (simulated for demo)
    const monthlyGrowth = monthlyRevenue > 0 ? ((weeklyRevenue * 4 - monthlyRevenue) / monthlyRevenue) * 100 : 0
    const weeklyGrowth = weeklyRevenue > 0 ? ((dailyRevenue * 7 - weeklyRevenue) / weeklyRevenue) * 100 : 0
    const dailyGrowth = Math.random() * 20 - 10 // Simulated daily growth

    // Top products analysis
    const productSales = sales.reduce((acc: any, sale) => {
      const productId = sale.product_id
      if (!acc[productId]) {
        const product = products.find((p) => p.id === productId)
        acc[productId] = {
          id: productId,
          name: product?.name || "Unknown",
          category: product?.category || "Unknown",
          totalSold: 0,
          revenue: 0,
          frequency: 0,
        }
      }
      acc[productId].totalSold += sale.quantity
      acc[productId].revenue += Number.parseFloat(sale.total_amount)
      acc[productId].frequency += 1
      return acc
    }, {})

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10)

    // Sales trend (last 7 days)
    const salesTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
      const daySales = sales.filter((sale) => {
        const saleDate = new Date(sale.sale_date)
        return saleDate.toDateString() === date.toDateString()
      })
      const dayRevenue = daySales.reduce((sum, sale) => sum + Number.parseFloat(sale.total_amount), 0)
      const dayCount = daySales.length

      return {
        day: dayName,
        revenue: dayRevenue,
        sales: dayCount,
        date: date.toISOString().split("T")[0],
      }
    })

    // Customer segments
    const customerTypes = customers.reduce((acc: any, customer) => {
      const type = customer.customer_type || "Regular"
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    const customerSegments = Object.entries(customerTypes).map(([type, count]: [string, any]) => ({
      name: type,
      value: count,
      percentage: ((count / customers.length) * 100).toFixed(1),
    }))

    return {
      totalRevenue,
      totalSales,
      averageOrderValue,
      topProducts,
      salesTrend,
      customerSegments,
      monthlyGrowth,
      weeklyGrowth,
      dailyGrowth,
    }
  }

  const generateInsights = (analytics: SalesAnalytics, sales: any[], products: any[]): AIInsight[] => {
    const insights: AIInsight[] = []

    // Revenue trend analysis
    if (analytics.monthlyGrowth > 10) {
      insights.push({
        type: "success",
        title: "Strong Revenue Growth",
        description: `Revenue has grown by ${analytics.monthlyGrowth.toFixed(1)}% this month. This indicates healthy business expansion.`,
        impact: "high",
        action: "Consider increasing inventory for top-performing products",
        confidence: 92,
      })
    } else if (analytics.monthlyGrowth < -5) {
      insights.push({
        type: "warning",
        title: "Revenue Decline Detected",
        description: `Revenue has decreased by ${Math.abs(analytics.monthlyGrowth).toFixed(1)}% this month. Immediate attention required.`,
        impact: "high",
        action: "Review pricing strategy and customer retention programs",
        confidence: 88,
      })
    }

    // Product performance analysis
    if (analytics.topProducts.length > 0) {
      const topProduct = analytics.topProducts[0]
      const topProductStock = products.find((p) => p.id === topProduct.id)

      if (topProductStock && topProductStock.stock_quantity <= topProductStock.reorder_level) {
        insights.push({
          type: "danger",
          title: "Top Product Low Stock Alert",
          description: `${topProduct.name} is your best seller but stock is critically low (${topProductStock.stock_quantity} units remaining).`,
          impact: "high",
          action: "Reorder immediately to avoid stockouts",
          confidence: 95,
        })
      }

      // Identify fast-moving products
      const fastMovers = analytics.topProducts.filter((product: any) => product.frequency > analytics.totalSales * 0.1)
      if (fastMovers.length > 0) {
        insights.push({
          type: "info",
          title: "Fast-Moving Products Identified",
          description: `${fastMovers.length} products are selling frequently. These represent ${((fastMovers.length / analytics.topProducts.length) * 100).toFixed(0)}% of your top performers.`,
          impact: "medium",
          action: "Ensure adequate stock levels for these products",
          confidence: 85,
        })
      }
    }

    // Sales pattern analysis
    const recentTrend = analytics.salesTrend.slice(-3)
    const isIncreasing = recentTrend.every((day, i) => i === 0 || day.revenue >= recentTrend[i - 1].revenue)
    const isDecreasing = recentTrend.every((day, i) => i === 0 || day.revenue <= recentTrend[i - 1].revenue)

    if (isIncreasing) {
      insights.push({
        type: "success",
        title: "Positive Sales Momentum",
        description:
          "Sales have been consistently increasing over the last 3 days. This trend suggests growing customer demand.",
        impact: "medium",
        action: "Capitalize on this momentum with targeted promotions",
        confidence: 78,
      })
    } else if (isDecreasing) {
      insights.push({
        type: "warning",
        title: "Declining Sales Pattern",
        description:
          "Sales have been decreasing for 3 consecutive days. This may indicate market saturation or competitive pressure.",
        impact: "medium",
        action: "Investigate causes and implement recovery strategies",
        confidence: 82,
      })
    }

    // Average order value analysis
    if (analytics.averageOrderValue < 5000) {
      insights.push({
        type: "info",
        title: "Low Average Order Value",
        description: `Current AOV is ₦${analytics.averageOrderValue.toLocaleString()}. There's potential to increase customer spending per transaction.`,
        impact: "medium",
        action: "Implement upselling and cross-selling strategies",
        confidence: 75,
      })
    }

    // Inventory optimization
    const lowStockProducts = products.filter((product) => product.stock_quantity <= product.reorder_level)
    if (lowStockProducts.length > 0) {
      insights.push({
        type: "warning",
        title: "Multiple Low Stock Items",
        description: `${lowStockProducts.length} products are at or below reorder levels. This could lead to stockouts and lost sales.`,
        impact: "high",
        action: "Review and update reorder quantities for affected products",
        confidence: 90,
      })
    }

    // Seasonal/weekly patterns
    const weekendSales = analytics.salesTrend.filter((day) => day.day === "Sat" || day.day === "Sun")
    const weekdaySales = analytics.salesTrend.filter((day) => day.day !== "Sat" && day.day !== "Sun")
    const avgWeekendRevenue = weekendSales.reduce((sum, day) => sum + day.revenue, 0) / weekendSales.length
    const avgWeekdayRevenue = weekdaySales.reduce((sum, day) => sum + day.revenue, 0) / weekdaySales.length

    if (avgWeekendRevenue > avgWeekdayRevenue * 1.2) {
      insights.push({
        type: "info",
        title: "Strong Weekend Performance",
        description:
          "Weekend sales are significantly higher than weekdays. This suggests strong leisure shopping patterns.",
        impact: "low",
        action: "Consider weekend-specific promotions and extended hours",
        confidence: 70,
      })
    }

    return insights.slice(0, 8) // Limit to top 8 insights
  }

  const generateForecast = (sales: any[]): ForecastData[] => {
    // Simple forecasting based on recent trends
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      const daySales = sales.filter((sale) => {
        const saleDate = new Date(sale.sale_date)
        return saleDate.toDateString() === date.toDateString()
      })
      return daySales.reduce((sum, sale) => sum + Number.parseFloat(sale.total_amount), 0)
    })

    const avgDailyRevenue = last7Days.reduce((sum, revenue) => sum + revenue, 0) / 7
    const trend = (last7Days[6] - last7Days[0]) / 6 // Simple linear trend

    // Generate next 7 days forecast
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000)
      const predicted = Math.max(0, avgDailyRevenue + trend * (i + 1) + (Math.random() - 0.5) * avgDailyRevenue * 0.1)
      const confidence = Math.max(60, 95 - i * 5) // Confidence decreases over time

      return {
        period: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        predicted: Math.round(predicted),
        confidence,
      }
    })
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "danger":
        return <TrendingDown className="h-5 w-5 text-red-600" />
      default:
        return <Lightbulb className="h-5 w-5 text-blue-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "danger":
        return "border-red-200 bg-red-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing sales data and generating AI insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">AI-Powered Sales Forecasting</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <Button onClick={generateAIRecommendations} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold">{analytics.monthlyGrowth.toFixed(1)}%</p>
                </div>
                {analytics.monthlyGrowth >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-green-600" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold">₦{analytics.averageOrderValue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Top Products</p>
                  <p className="text-2xl font-bold">{analytics.topProducts.length}</p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">AI Insights</p>
                  <p className="text-2xl font-bold">{insights.length}</p>
                </div>
                <Brain className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="forecast">Revenue Forecast</TabsTrigger>
          <TabsTrigger value="trends">Sales Trends</TabsTrigger>
          <TabsTrigger value="products">Product Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <Card key={index} className={`border-l-4 ${getInsightColor(insight.type)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              insight.impact === "high"
                                ? "destructive"
                                : insight.impact === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {insight.impact} impact
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs">{insight.confidence}%</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <div className="bg-white p-2 rounded border">
                        <p className="text-xs font-medium text-gray-800">
                          <Target className="h-3 w-3 inline mr-1" />
                          Recommended Action: {insight.action}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Revenue Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={forecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, "Predicted Revenue"]} />
                    <Area type="monotone" dataKey="predicted" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecast Confidence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {forecast.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.period}</p>
                      <p className="text-sm text-gray-600">₦{item.predicted.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={item.confidence} className="w-20" />
                      <span className="text-sm font-medium">{item.confidence}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {analytics && (
            <Card>
              <CardHeader>
                <CardTitle>7-Day Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "revenue" ? `₦${value.toLocaleString()}` : value,
                        name === "revenue" ? "Revenue" : "Sales Count",
                      ]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="sales" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.topProducts.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, "Revenue"]} />
                      <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
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
                        data={analytics.customerSegments}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {analytics.customerSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
