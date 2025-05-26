"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, TrendingUp } from "lucide-react"
import { getSalesAnalytics, getTopProducts, getInventoryStatus } from "@/lib/database"

export function ReportGenerator() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const [reportType, setReportType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const generateReport = async () => {
    if (!reportType) {
      toast({
        title: "Error",
        description: "Please select a report type.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      let data
      switch (reportType) {
        case "sales":
          if (!startDate || !endDate) {
            toast({
              title: "Error",
              description: "Please select start and end dates for sales report.",
              variant: "destructive",
            })
            return
          }
          data = await getSalesAnalytics(startDate, endDate)
          break
        case "products":
          data = await getTopProducts(20)
          break
        case "inventory":
          data = await getInventoryStatus()
          break
        default:
          throw new Error("Invalid report type")
      }

      setReportData(data)
      toast({
        title: "Success",
        description: "Report generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    if (!reportData) return

    const csvContent = convertToCSV(reportData, reportType)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${reportType}_report_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const convertToCSV = (data: any[], type: string) => {
    if (!data.length) return ""

    let headers: string[] = []
    let rows: string[][] = []

    switch (type) {
      case "sales":
        headers = ["Date", "Product", "Category", "Quantity", "Amount", "Customer Type"]
        rows = data.map((item) => [
          new Date(item.sale_date).toLocaleDateString(),
          item.products?.name || "N/A",
          item.products?.category || "N/A",
          item.quantity.toString(),
          item.total_amount.toString(),
          item.customers?.customer_type || "Walk-in",
        ])
        break
      case "products":
        headers = ["Product", "Category", "Price", "Quantity Sold", "Revenue"]
        rows = data.map((item) => [
          item.products?.name || "N/A",
          item.products?.category || "N/A",
          item.products?.price?.toString() || "0",
          item.quantity.toString(),
          item.total_amount.toString(),
        ])
        break
      case "inventory":
        headers = ["Product", "Category", "Stock", "Reorder Level", "Status"]
        rows = data.map((item) => [
          item.name,
          item.category,
          item.stock_quantity.toString(),
          item.reorder_level.toString(),
          item.stock_quantity <= item.reorder_level ? "Low Stock" : "Good",
        ])
        break
    }

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    return csvContent
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Report Generator</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Business Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="products">Product Performance</SelectItem>
                  <SelectItem value="inventory">Inventory Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === "sales" && (
              <>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </>
            )}
          </div>

          <div className="flex space-x-2">
            <Button onClick={generateReport} disabled={loading}>
              {loading ? "Generating..." : "Generate Report"}
              <TrendingUp className="ml-2 h-4 w-4" />
            </Button>
            {reportData && (
              <Button onClick={downloadReport} variant="outline">
                Download CSV
                <Download className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {reportType === "sales" && (
                      <>
                        <th className="border border-gray-300 p-2 text-left">Date</th>
                        <th className="border border-gray-300 p-2 text-left">Product</th>
                        <th className="border border-gray-300 p-2 text-left">Quantity</th>
                        <th className="border border-gray-300 p-2 text-left">Amount</th>
                      </>
                    )}
                    {reportType === "products" && (
                      <>
                        <th className="border border-gray-300 p-2 text-left">Product</th>
                        <th className="border border-gray-300 p-2 text-left">Category</th>
                        <th className="border border-gray-300 p-2 text-left">Quantity Sold</th>
                        <th className="border border-gray-300 p-2 text-left">Revenue</th>
                      </>
                    )}
                    {reportType === "inventory" && (
                      <>
                        <th className="border border-gray-300 p-2 text-left">Product</th>
                        <th className="border border-gray-300 p-2 text-left">Category</th>
                        <th className="border border-gray-300 p-2 text-left">Stock</th>
                        <th className="border border-gray-300 p-2 text-left">Status</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {reportData.slice(0, 10).map((item: any, index: number) => (
                    <tr key={index}>
                      {reportType === "sales" && (
                        <>
                          <td className="border border-gray-300 p-2">
                            {new Date(item.sale_date).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-300 p-2">{item.products?.name || "N/A"}</td>
                          <td className="border border-gray-300 p-2">{item.quantity}</td>
                          <td className="border border-gray-300 p-2">₦{item.total_amount.toLocaleString()}</td>
                        </>
                      )}
                      {reportType === "products" && (
                        <>
                          <td className="border border-gray-300 p-2">{item.products?.name || "N/A"}</td>
                          <td className="border border-gray-300 p-2">{item.products?.category || "N/A"}</td>
                          <td className="border border-gray-300 p-2">{item.quantity}</td>
                          <td className="border border-gray-300 p-2">₦{item.total_amount.toLocaleString()}</td>
                        </>
                      )}
                      {reportType === "inventory" && (
                        <>
                          <td className="border border-gray-300 p-2">{item.name}</td>
                          <td className="border border-gray-300 p-2">{item.category}</td>
                          <td className="border border-gray-300 p-2">{item.stock_quantity}</td>
                          <td className="border border-gray-300 p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                item.stock_quantity <= item.reorder_level
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.stock_quantity <= item.reorder_level ? "Low Stock" : "Good"}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {reportData.length > 10 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing first 10 of {reportData.length} records. Download CSV for complete data.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
