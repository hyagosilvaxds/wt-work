"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CashFlowReport } from "./cash-flow-report"

export function FinancialReportsSimple() {
  const [activeTab, setActiveTab] = useState("receivable")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="receivable" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="receivable">Contas a Receber</TabsTrigger>
          <TabsTrigger value="payable">Contas a Pagar</TabsTrigger>
          <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
        </TabsList>

        <TabsContent value="receivable">
          <div className="text-center p-8">
            <p className="text-gray-500">Relatório de Contas a Receber em desenvolvimento...</p>
          </div>
        </TabsContent>

        <TabsContent value="payable">
          <div className="text-center p-8">
            <p className="text-gray-500">Relatório de Contas a Pagar em desenvolvimento...</p>
          </div>
        </TabsContent>

        <TabsContent value="cashflow">
          <CashFlowReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
