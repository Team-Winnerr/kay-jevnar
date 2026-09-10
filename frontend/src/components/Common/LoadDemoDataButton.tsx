import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Database, Sparkles } from "lucide-react"

import { LoadingButton } from "@/components/ui/loading-button"
import { Skeleton } from "@/components/ui/skeleton"
import useCustomToast from "@/hooks/useCustomToast"

export interface LoadDemoDataButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  showSkeletonWhileLoading?: boolean
}

interface SeedApiResponse {
  success: boolean
  message: string
  created_users: number
  updated_users: number
  created_items: number
  updated_items: number
  total_users: number
  total_items: number
}

export function LoadDemoDataButton({
  variant = "outline",
  size = "sm",
  className = "",
  showSkeletonWhileLoading = true,
}: LoadDemoDataButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const queryClient = useQueryClient()

  const handleSeed = async () => {
    setIsLoading(true)

    try {
      const token = localStorage.getItem("access_token")
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const apiUrl = `${import.meta.env.VITE_API_URL ?? ""}/api/v1/dev/seed`
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
      })

      // Strict resilience check: never assume 200 OK
      if (!response.ok) {
        let errorMessage = `Seeding failed with HTTP ${response.status} (${response.statusText})`
        try {
          const errorBody = await response.json()
          if (errorBody?.detail) {
            errorMessage =
              typeof errorBody.detail === "string"
                ? errorBody.detail
                : JSON.stringify(errorBody.detail)
          }
        } catch {
          // If non-JSON response, retain status message
        }
        throw new Error(errorMessage)
      }

      let data: SeedApiResponse
      try {
        data = (await response.json()) as SeedApiResponse
      } catch {
        throw new Error("Invalid JSON received from dev seed endpoint.")
      }

      if (!data || typeof data !== "object" || !data.success) {
        throw new Error(
          data?.message ?? "Database seeding did not complete successfully.",
        )
      }

      showSuccessToast(
        `Demo data loaded! Users: ${data.total_users}, Items: ${data.total_items} (${data.created_users} new users, ${data.created_items} new items).`,
      )

      // Refresh queries across items and admin users views
      await queryClient.invalidateQueries()
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while communicating with the seed service."
      showErrorToast(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isLoading && showSkeletonWhileLoading ? (
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32 animate-pulse rounded-md" />
        </div>
      ) : (
        <LoadingButton
          variant={variant}
          size={size}
          loading={isLoading}
          onClick={handleSeed}
          className={`font-medium border-primary/20 hover:border-primary/40 text-xs sm:text-sm ${className}`}
          title="Seed SQLModel database with realistic demo users, items, and diverse test states"
        >
          <Database className="h-3.5 w-3.5 text-primary" />
          <span>Load Demo Data</span>
          <Sparkles className="h-3 w-3 text-amber-500" />
        </LoadingButton>
      )}
    </div>
  )
}

export default LoadDemoDataButton
