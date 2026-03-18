"use client"

import { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, CalendarIcon, DollarSignIcon, ActivityIcon } from "lucide-react"

export function SectionCards() {
  const { apiFetch } = useApi()
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await apiFetch("/api/v1/analytics/summary")
      const data = await res.json()
      setAnalytics(data)
    }
    fetchAnalytics()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Subscriptions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {analytics?.active_count ?? "—"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ActivityIcon />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total active subscriptions
          </div>
          <div className="text-muted-foreground">Across all platforms</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly Spend</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {analytics ? `$${analytics.total_monthly}` : "—"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <DollarSignIcon />
              /mo
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total monthly cost
          </div>
          <div className="text-muted-foreground">All billing cycles combined</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Annual Spend</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {analytics ? `$${analytics.total_annual}` : "—"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              /yr
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Projected annual cost
          </div>
          <div className="text-muted-foreground">Based on current subscriptions</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Upcoming Renewals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {analytics?.upcoming_renewals?.length ?? "—"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <CalendarIcon />
              30 days
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Renewals coming up
          </div>
          <div className="text-muted-foreground">Within the next 30 days</div>
        </CardFooter>
      </Card>
    </div>
  )
}
