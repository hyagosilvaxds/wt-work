"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardContentSimple() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Funcionando</CardTitle>
          <CardDescription>Teste simples do dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <p>O dashboard está funcionando corretamente!</p>
        </CardContent>
      </Card>
    </div>
  )
}
