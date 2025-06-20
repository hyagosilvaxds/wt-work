"use client"

import { useEffect, useRef } from "react"

interface MonthlyData {
  month: string
  received: number
  paid: number
  toReceive: number
  toPay: number
}

interface MonthlyComparisonChartProps {
  data: MonthlyData[]
}

export function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Limpar o conteúdo anterior
    chartRef.current.innerHTML = ""

    // Encontrar o valor máximo para dimensionar o gráfico
    const maxValue = Math.max(...data.map((item) => Math.max(item.received, item.paid)))

    // Criar o gráfico
    const chartContainer = document.createElement("div")
    chartContainer.className = "flex items-end h-64 space-x-2"

    data.forEach((item) => {
      const monthContainer = document.createElement("div")
      monthContainer.className = "flex-1 flex flex-col items-center group"

      // Container para as barras
      const barsContainer = document.createElement("div")
      barsContainer.className = "h-56 w-full flex justify-center space-x-1"

      // Barra de valores recebidos
      const receivedBar = document.createElement("div")
      const receivedHeight = (item.received / maxValue) * 100
      receivedBar.className = "w-6 bg-green-500 rounded-t-md relative group-hover:bg-green-600 transition-colors"
      receivedBar.style.height = `${receivedHeight}%`

      // Tooltip para valores recebidos
      const receivedTooltip = document.createElement("div")
      receivedTooltip.className =
        "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
      receivedTooltip.textContent = `Recebido: R$ ${item.received.toLocaleString("pt-BR")}`
      receivedBar.appendChild(receivedTooltip)

      // Barra de valores pagos
      const paidBar = document.createElement("div")
      const paidHeight = (item.paid / maxValue) * 100
      paidBar.className = "w-6 bg-red-500 rounded-t-md relative group-hover:bg-red-600 transition-colors"
      paidBar.style.height = `${paidHeight}%`

      // Tooltip para valores pagos
      const paidTooltip = document.createElement("div")
      paidTooltip.className =
        "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
      paidTooltip.textContent = `Pago: R$ ${item.paid.toLocaleString("pt-BR")}`
      paidBar.appendChild(paidTooltip)

      barsContainer.appendChild(receivedBar)
      barsContainer.appendChild(paidBar)
      monthContainer.appendChild(barsContainer)

      // Rótulo do mês
      const monthLabel = document.createElement("div")
      monthLabel.className = "mt-2 text-xs font-medium"
      monthLabel.textContent = item.month

      // Saldo (diferença entre recebido e pago)
      const balance = item.received - item.paid
      const balanceLabel = document.createElement("div")
      balanceLabel.className = `text-xs ${balance >= 0 ? "text-green-600" : "text-red-600"}`
      balanceLabel.textContent = `${balance >= 0 ? "+" : ""}${balance.toLocaleString("pt-BR")}`

      monthContainer.appendChild(monthLabel)
      monthContainer.appendChild(balanceLabel)
      chartContainer.appendChild(monthContainer)
    })

    // Legenda
    const legendContainer = document.createElement("div")
    legendContainer.className = "flex justify-center space-x-6 mt-4"

    // Legenda para valores recebidos
    const receivedLegend = document.createElement("div")
    receivedLegend.className = "flex items-center"

    const receivedColor = document.createElement("div")
    receivedColor.className = "w-3 h-3 bg-green-500 rounded-sm mr-2"

    const receivedText = document.createElement("span")
    receivedText.className = "text-xs text-gray-600"
    receivedText.textContent = "Valores Recebidos"

    receivedLegend.appendChild(receivedColor)
    receivedLegend.appendChild(receivedText)

    // Legenda para valores pagos
    const paidLegend = document.createElement("div")
    paidLegend.className = "flex items-center"

    const paidColor = document.createElement("div")
    paidColor.className = "w-3 h-3 bg-red-500 rounded-sm mr-2"

    const paidText = document.createElement("span")
    paidText.className = "text-xs text-gray-600"
    paidText.textContent = "Valores Pagos"

    paidLegend.appendChild(paidColor)
    paidLegend.appendChild(paidText)

    legendContainer.appendChild(receivedLegend)
    legendContainer.appendChild(paidLegend)

    // Adicionar ao DOM
    chartRef.current.appendChild(chartContainer)
    chartRef.current.appendChild(legendContainer)
  }, [data])

  return <div ref={chartRef} className="w-full h-80" />
}
