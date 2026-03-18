"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts"
import { useApi } from "@/hooks/useApi"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const COLORS = [
  "#6366f1",
  "#22d3ee",
  "#f59e0b",
  "#ec4899",
  "#10b981",
  "#f97316",
  "#a855f7",
]

function ActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value, percent } = props
  return (
    <g>
      <text x={cx} y={cy - 14} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={600}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#aaa" fontSize={13}>
        ${value}/mo
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle" fill="#666" fontSize={12}>
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 10}
        startAngle={startAngle} endAngle={endAngle} fill={fill} stroke="none" strokeWidth={0} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 14} outerRadius={outerRadius + 18}
        startAngle={startAngle} endAngle={endAngle} fill={fill} stroke="none" strokeWidth={0} />
    </g>
  )
}

function CenterLabel({ cx, cy, total }) {
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#888" fontSize={12}>
        Total/mo
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={700}>
        ${total}
      </text>
    </g>
  )
}

export function ChartAreaInteractive() {
  const { apiFetch } = useApi()
  const [chartData, setChartData] = React.useState([])
  const [activeIndex, setActiveIndex] = React.useState(null)

  React.useEffect(() => {
    async function fetchSubscriptions() {
      const res = await apiFetch("/api/v1/subscriptions")
      const subscriptions = await res.json()

      const byCategory = subscriptions.reduce((acc, sub) => {
        const cat = sub.category ?? "Uncategorized"
        acc[cat] = (acc[cat] ?? 0) + sub.cost
        return acc
      }, {})

      setChartData(
        Object.entries(byCategory).map(([name, value]) => ({
          name,
          value: parseFloat(value.toFixed(2)),
        }))
      )
    }
    fetchSubscriptions()
  }, [])

  const total = chartData.reduce((sum, d) => sum + d.value, 0).toFixed(2)

  function handleClick(_, index) {
    setActiveIndex(prev => prev === index ? null : index)
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Spend by Category</CardTitle>
        <CardDescription>Monthly cost breakdown across subscription categories</CardDescription>
      </CardHeader>
      <CardContent className="py-6">
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center">No subscription data yet.</p>
        ) : (
          <div className="flex items-center justify-center">
            <div className="w-72 shrink-0">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart style={{ outline: 'none' }}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    activeIndex={activeIndex}
                    activeShape={ActiveShape}
                    onClick={handleClick}
                    cursor="pointer"
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={600}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  {activeIndex === null && (
                    <Pie
                      data={[{ value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={0}
                      dataKey="value"
                      label={<CenterLabel total={total} />}
                      labelLine={false}
                      isAnimationActive={false}
                    />
                  )}
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 pl-4 pr-6">
          {chartData.map((entry, index) => {
            const pct = ((entry.value / total) * 100).toFixed(1)
            const isActive = activeIndex === index
            return (
              <div
                key={entry.name}
                className={`flex items-center gap-2 text-sm cursor-pointer transition-opacity ${
                  activeIndex !== null && !isActive ? "opacity-40" : "opacity-100"
                }`}
                onClick={() => setActiveIndex(prev => prev === index ? null : index)}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: COLORS[index % COLORS.length] }}
                />
                <span className={`font-medium ${isActive ? "text-white" : "text-foreground"}`}>
                  {entry.name}
                </span>
                <span className="text-muted-foreground">${entry.value}</span>
                <span className="text-muted-foreground/60 text-xs">{pct}%</span>
              </div>
            )
          })}
        </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
