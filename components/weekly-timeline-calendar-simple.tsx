"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function WeeklyTimelineCalendarSimple() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Calendário Semanal</CardTitle>
        <CardDescription>Versão simplificada do calendário</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 text-center">
          <p>Calendário temporariamente simplificado para debug</p>
        </div>
      </CardContent>
    </Card>
  )
}
