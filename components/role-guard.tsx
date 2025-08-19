"use client"

import type React from "react"

import { useAuth } from "./auth/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole: "admin" | "manager" | "staff"
  fallback?: React.ReactNode
}

export function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user) return null

  const userRole = user.user_metadata?.role || "staff"
  const roleHierarchy = { staff: 1, manager: 2, admin: 3 }

  const hasPermission = roleHierarchy[userRole] >= roleHierarchy[requiredRole]

  if (!hasPermission) {
    return (
      fallback || (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Access restricted to {requiredRole} and above</span>
            <Badge variant="outline" className="text-xs">
              Your role: {userRole}
            </Badge>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
