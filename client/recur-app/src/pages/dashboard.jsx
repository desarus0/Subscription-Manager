import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { useApi } from "@/hooks/useApi"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, LayersIcon, PlusIcon, TrendingUpIcon } from "lucide-react"

function Dashboard() {
  const { user } = useUser()
  const { apiFetch } = useApi()
  const firstName = user?.firstName || "there"

  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const res = await apiFetch("/api/v1/analytics/summary")
      const data = await res.json()
      setAnalytics(data)
    }
    fetchData()
  }, [])

  const upcoming = (analytics?.upcoming_renewals ?? [])
    .sort((a, b) => new Date(a.renewal_date) - new Date(b.renewal_date))
    .slice(0, 5)

  function daysUntil(dateStr) {
    return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">

          {/* Welcome */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Welcome back, {firstName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Monthly Spend</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {analytics ? `$${analytics.total_monthly}` : "—"}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <TrendingUpIcon />
                    /mo
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                  ${analytics?.total_annual ?? "—"} billed annually
                </div>
              </CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Active Subscriptions</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {analytics?.active_count ?? "—"}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <LayersIcon />
                    Active
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">Across all platforms</div>
              </CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Next Renewal</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {upcoming[0]
                    ? new Date(upcoming[0].renewal_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : "—"}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <CalendarIcon />
                    Soon
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                  {upcoming[0] ? `${upcoming[0].name} · $${upcoming[0].cost}` : "No upcoming renewals"}
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Upcoming renewals */}
          <Card>
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Upcoming Renewals</CardTitle>
                  <CardDescription className="mt-0.5">Next 30 days</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground px-5 py-8 text-center">
                  No renewals in the next 30 days.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {upcoming.map((sub, i) => {
                    const days = daysUntil(sub.renewal_date)
                    return (
                      <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0">
                            {sub.platform.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white leading-tight">{sub.name}</p>
                            <p className="text-xs text-muted-foreground">{sub.platform}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5">
                          <span className={`text-xs font-medium ${days <= 3 ? "text-red-400" : "text-muted-foreground"}`}>
                            {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `in ${days}d`}
                          </span>
                          <span className="text-sm font-medium text-white w-12 text-right">${sub.cost}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Dashboard
