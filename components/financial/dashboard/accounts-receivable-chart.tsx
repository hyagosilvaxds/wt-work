"use client"

import { useEffect, useRef } from "react"

interface MonthlyData {
  month: string
  received: number
  paid: number
  toReceive: number
  toPay: number
}

interface AccountsReceivableChartProps {
  data: MonthlyData[]
}

export function AccountsReceivableChart({ data }: AccountsReceivableChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Limpar o conteúdo anterior
    chartRef.current.innerHTML = ""

    // Encontrar o valor máximo para dimensionar o gráfico
    const maxValue = Math.max(...data.map((item) => item.received + item.toReceive))

    // Criar o gráfico
    const chartContainer = document.createElement("div")
    chartContainer.className = "flex items-end h-64 space-x-2"

    data.forEach((item) => {
      const monthContainer = document.createElement("div")
      monthContainer.className = "flex-1 flex flex-col items-center group"

      // Container para as barras
      const barsContainer = document.createElement("div")
      barsContainer.className = "h-56 w-full flex flex-col justify-end items-center space-y-1"

      // Barra de valores a receber
      const toReceiveBar = document.createElement("div")
      const toReceiveHeight = (item.toReceive / maxValue) * 100
      toReceiveBar.className =
        "w-full max-w-16 bg-blue-100 rounded-t-md relative group-hover:bg-blue-200 transition-colors"
      toReceiveBar.style.height = `${toReceiveHeight}%`

      // Tooltip para valores a receber
      const toReceiveTooltip = document.createElement("div")
      toReceiveTooltip.className =
        "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
      toReceiveTooltip.textContent = `A Receber: R$ ${item.toReceive.toLocaleString("pt-BR")}`
      toReceiveBar.appendChild(toReceiveTooltip)

      // Barra de valores recebidos
      const receivedBar = document.createElement("div")
      const receivedHeight = (item.received / maxValue) * 100
      receivedBar.className =
        "w-full max-w-16 bg-green-500 rounded-t-md relative group-hover:bg-green-600 transition-colors"
      receivedBar.style.height = `${receivedHeight}%`

      // Tooltip para valores recebidos
      const receivedTooltip = document.createElement("div")
      receivedTooltip.className =
        "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
      receivedTooltip.textContent = `Recebido: R$ ${item.received.toLocaleString("pt-BR")}`
      receivedBar.appendChild(receivedTooltip)

      barsContainer.appendChild(toReceiveBar)
      barsContainer.appendChild(receivedBar)
      monthContainer.appendChild(barsContainer)

      // Rótulo do mês
      const monthLabel = document.createElement("div")
      monthLabel.className = "mt-2 text-xs font-medium"
      monthLabel.textContent = item.month

      // Percentual recebido
      const total = item.received + item.toReceive
      const percentage = Math.round((item.received / total) * 100)
      const percentageLabel = document.createElement("div")
      percentageLabel.className = "text-xs text-gray-600"
      percentageLabel.textContent = `${percentage}%`

      monthContainer.appendChild(monthLabel)
      monthContainer.appendChild(percentageLabel)
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

    // Legenda para valores a receber
    const toReceiveLegend = document.createElement("div")
    toReceiveLegend.className = "flex items-center"

    const toReceiveColor = document.createElement("div")
    toReceiveColor.className = "w-3 h-3 bg-blue-100 rounded-sm mr-2"

    const toReceiveText = document.createElement("span")
    toReceiveText.className = "text-xs text-gray-600"
    toReceiveText.textContent = "Valores a Receber"

    toReceiveLegend.appendChild(toReceiveColor)
    toReceiveLegend.appendChild(toReceiveText)

    legendContainer.appendChild(receivedLegend)
    legendContainer.appendChild(toReceiveLegend)

    // Adicionar ao DOM
    chartRef.current.appendChild(chartContainer)
    chartRef.current.appendChild(legendContainer)
  }, [data])

  return <div ref={chartRef} className="w-full h-80" />
}
