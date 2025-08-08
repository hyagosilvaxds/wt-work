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
    const maxValue = Math.max(...data.map((item) => {
      // Para contas a receber: received + toReceive
      // Para contas a pagar: paid + toPay
      const receivableTotal = item.received + item.toReceive
      const payableTotal = item.paid + item.toPay
      return Math.max(receivableTotal, payableTotal)
    }))

    // Criar o gráfico
    const chartContainer = document.createElement("div")
    chartContainer.className = "flex items-end h-64 space-x-2"

    data.forEach((item) => {
      const monthContainer = document.createElement("div")
      monthContainer.className = "flex-1 flex flex-col items-center group"

      // Container para as barras
      const barsContainer = document.createElement("div")
      barsContainer.className = "h-56 w-full flex flex-col justify-end items-center space-y-1"

      // Barra de valores a receber (se houver dados)
      if (item.toReceive > 0) {
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
        barsContainer.appendChild(toReceiveBar)
      }

      // Barra de valores a pagar (se houver dados)
      if (item.toPay > 0) {
        const toPayBar = document.createElement("div")
        const toPayHeight = (item.toPay / maxValue) * 100
        toPayBar.className =
          "w-full max-w-16 bg-orange-100 rounded-t-md relative group-hover:bg-orange-200 transition-colors"
        toPayBar.style.height = `${toPayHeight}%`

        // Tooltip para valores a pagar
        const toPayTooltip = document.createElement("div")
        toPayTooltip.className =
          "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        toPayTooltip.textContent = `A Pagar: R$ ${item.toPay.toLocaleString("pt-BR")}`
        toPayBar.appendChild(toPayTooltip)
        barsContainer.appendChild(toPayBar)
      }

      // Barra de valores recebidos (se houver dados)
      if (item.received > 0) {
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
        barsContainer.appendChild(receivedBar)
      }

      // Barra de valores pagos (se houver dados)
      if (item.paid > 0) {
        const paidBar = document.createElement("div")
        const paidHeight = (item.paid / maxValue) * 100
        paidBar.className =
          "w-full max-w-16 bg-red-500 rounded-t-md relative group-hover:bg-red-600 transition-colors"
        paidBar.style.height = `${paidHeight}%`

        // Tooltip para valores pagos
        const paidTooltip = document.createElement("div")
        paidTooltip.className =
          "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        paidTooltip.textContent = `Pago: R$ ${item.paid.toLocaleString("pt-BR")}`
        paidBar.appendChild(paidTooltip)
        barsContainer.appendChild(paidBar)
      }
      monthContainer.appendChild(barsContainer)

      // Rótulo do mês
      const monthLabel = document.createElement("div")
      monthLabel.className = "mt-2 text-xs font-medium"
      monthLabel.textContent = item.month

      // Percentual concluído (recebido ou pago)
      const receivableTotal = item.received + item.toReceive
      const payableTotal = item.paid + item.toPay
      let percentage = 0
      
      if (receivableTotal > 0) {
        percentage = Math.round((item.received / receivableTotal) * 100)
      } else if (payableTotal > 0) {
        percentage = Math.round((item.paid / payableTotal) * 100)
      }
      
      const percentageLabel = document.createElement("div")
      percentageLabel.className = "text-xs text-gray-600"
      percentageLabel.textContent = `${percentage}%`

      monthContainer.appendChild(monthLabel)
      monthContainer.appendChild(percentageLabel)
      chartContainer.appendChild(monthContainer)
    })

    // Legenda dinâmica baseada nos dados disponíveis
    const legendContainer = document.createElement("div")
    legendContainer.className = "flex justify-center space-x-6 mt-4"

    // Verificar quais tipos de dados estão presentes
    const hasReceived = data.some(item => item.received > 0)
    const hasToReceive = data.some(item => item.toReceive > 0)
    const hasPaid = data.some(item => item.paid > 0)
    const hasToPay = data.some(item => item.toPay > 0)

    // Legenda para valores recebidos
    if (hasReceived) {
      const receivedLegend = document.createElement("div")
      receivedLegend.className = "flex items-center"

      const receivedColor = document.createElement("div")
      receivedColor.className = "w-3 h-3 bg-green-500 rounded-sm mr-2"

      const receivedText = document.createElement("span")
      receivedText.className = "text-xs text-gray-600"
      receivedText.textContent = "Valores Recebidos"

      receivedLegend.appendChild(receivedColor)
      receivedLegend.appendChild(receivedText)
      legendContainer.appendChild(receivedLegend)
    }

    // Legenda para valores a receber
    if (hasToReceive) {
      const toReceiveLegend = document.createElement("div")
      toReceiveLegend.className = "flex items-center"

      const toReceiveColor = document.createElement("div")
      toReceiveColor.className = "w-3 h-3 bg-blue-100 rounded-sm mr-2"

      const toReceiveText = document.createElement("span")
      toReceiveText.className = "text-xs text-gray-600"
      toReceiveText.textContent = "Valores a Receber"

      toReceiveLegend.appendChild(toReceiveColor)
      toReceiveLegend.appendChild(toReceiveText)
      legendContainer.appendChild(toReceiveLegend)
    }

    // Legenda para valores pagos
    if (hasPaid) {
      const paidLegend = document.createElement("div")
      paidLegend.className = "flex items-center"

      const paidColor = document.createElement("div")
      paidColor.className = "w-3 h-3 bg-red-500 rounded-sm mr-2"

      const paidText = document.createElement("span")
      paidText.className = "text-xs text-gray-600"
      paidText.textContent = "Valores Pagos"

      paidLegend.appendChild(paidColor)
      paidLegend.appendChild(paidText)
      legendContainer.appendChild(paidLegend)
    }

    // Legenda para valores a pagar
    if (hasToPay) {
      const toPayLegend = document.createElement("div")
      toPayLegend.className = "flex items-center"

      const toPayColor = document.createElement("div")
      toPayColor.className = "w-3 h-3 bg-orange-100 rounded-sm mr-2"

      const toPayText = document.createElement("span")
      toPayText.className = "text-xs text-gray-600"
      toPayText.textContent = "Valores a Pagar"

      toPayLegend.appendChild(toPayColor)
      toPayLegend.appendChild(toPayText)
      legendContainer.appendChild(toPayLegend)
    }

    // Adicionar ao DOM
    chartRef.current.appendChild(chartContainer)
    chartRef.current.appendChild(legendContainer)
  }, [data])

  return <div ref={chartRef} className="w-full h-80" />
}
