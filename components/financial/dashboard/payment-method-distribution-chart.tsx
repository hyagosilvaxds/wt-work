"use client"

import { useEffect, useRef } from "react"

interface PaymentMethodData {
  method: string
  value: number
}

interface PaymentMethodDistributionChartProps {
  data: PaymentMethodData[]
  type: "received" | "paid"
}

export function PaymentMethodDistributionChart({ data, type }: PaymentMethodDistributionChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Limpar o conteúdo anterior
    chartRef.current.innerHTML = ""

    // Calcular o total
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Cores para os diferentes métodos de pagamento
    const colors = {
      Transferência: "#3b82f6", // blue-500
      PIX: "#8b5cf6", // violet-500
      Boleto: "#ef4444", // red-500
      "Cartão de Crédito": "#f97316", // orange-500
      Dinheiro: "#22c55e", // green-500
      Cheque: "#f59e0b", // amber-500
      Outros: "#6b7280", // gray-500
    }

    // Criar o gráfico de pizza
    const chartContainer = document.createElement("div")
    chartContainer.className = "flex flex-col md:flex-row items-center justify-center gap-6"

    // Container para o gráfico de pizza
    const pieContainer = document.createElement("div")
    pieContainer.className = "relative w-48 h-48"

    // Criar o SVG para o gráfico de pizza
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 100 100")
    svg.setAttribute("class", "w-full h-full -rotate-90")

    let cumulativePercentage = 0

    // Adicionar cada fatia ao gráfico de pizza
    data.forEach((item, index) => {
      const percentage = (item.value / total) * 100
      const startAngle = (cumulativePercentage / 100) * 360
      const endAngle = ((cumulativePercentage + percentage) / 100) * 360

      // Converter ângulos para coordenadas
      const startX = 50 + 50 * Math.cos((startAngle * Math.PI) / 180)
      const startY = 50 + 50 * Math.sin((startAngle * Math.PI) / 180)
      const endX = 50 + 50 * Math.cos((endAngle * Math.PI) / 180)
      const endY = 50 + 50 * Math.sin((endAngle * Math.PI) / 180)

      // Determinar se o arco é maior que 180 graus
      const largeArcFlag = percentage > 50 ? 1 : 0

      // Criar o caminho SVG para a fatia
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      path.setAttribute("d", `M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`)
      path.setAttribute("fill", colors[item.method as keyof typeof colors] || colors["Outros"])
      path.setAttribute("class", "hover:opacity-80 transition-opacity cursor-pointer")

      // Adicionar tooltip
      const title = document.createElementNS("http://www.w3.org/2000/svg", "title")
      title.textContent = `${item.method}: R$ ${item.value.toLocaleString("pt-BR")} (${percentage.toFixed(1)}%)`
      path.appendChild(title)

      svg.appendChild(path)

      cumulativePercentage += percentage
    })

    pieContainer.appendChild(svg)
    chartContainer.appendChild(pieContainer)

    // Container para a legenda
    const legendContainer = document.createElement("div")
    legendContainer.className = "grid grid-cols-1 gap-2"

    // Adicionar itens à legenda
    data.forEach((item) => {
      const legendItem = document.createElement("div")
      legendItem.className = "flex items-center gap-2"

      const colorBox = document.createElement("div")
      colorBox.className = "w-3 h-3 rounded-sm"
      colorBox.style.backgroundColor = colors[item.method as keyof typeof colors] || colors["Outros"]

      const methodName = document.createElement("span")
      methodName.className = "text-xs font-medium"
      methodName.textContent = item.method

      const methodValue = document.createElement("span")
      methodValue.className = "text-xs text-gray-500 ml-auto"
      methodValue.textContent = `R$ ${item.value.toLocaleString("pt-BR")}`

      const methodPercentage = document.createElement("span")
      methodPercentage.className = "text-xs text-gray-500 w-12 text-right"
      methodPercentage.textContent = `${((item.value / total) * 100).toFixed(1)}%`

      legendItem.appendChild(colorBox)
      legendItem.appendChild(methodName)
      legendItem.appendChild(methodValue)
      legendItem.appendChild(methodPercentage)

      legendContainer.appendChild(legendItem)
    })

    // Adicionar total à legenda
    const totalItem = document.createElement("div")
    totalItem.className = "flex items-center gap-2 border-t pt-2 mt-2"

    const totalLabel = document.createElement("span")
    totalLabel.className = "text-xs font-medium"
    totalLabel.textContent = "Total"

    const totalValue = document.createElement("span")
    totalValue.className = "text-xs font-medium ml-auto"
    totalValue.textContent = `R$ ${total.toLocaleString("pt-BR")}`

    const totalPercentage = document.createElement("span")
    totalPercentage.className = "text-xs font-medium w-12 text-right"
    totalPercentage.textContent = "100%"

    totalItem.appendChild(totalLabel)
    totalItem.appendChild(totalValue)
    totalItem.appendChild(totalPercentage)

    legendContainer.appendChild(totalItem)
    chartContainer.appendChild(legendContainer)

    // Adicionar ao DOM
    chartRef.current.appendChild(chartContainer)
  }, [data, type])

  return <div ref={chartRef} className="w-full h-64" />
}
