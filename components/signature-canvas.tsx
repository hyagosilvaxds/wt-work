"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eraser, RotateCcw, Check } from "lucide-react"

interface SignatureCanvasProps {
  onSignatureChange: (hasSignature: boolean, getSignatureFile?: () => Promise<File>) => void
  disabled?: boolean
  className?: string
}

export function SignatureCanvas({ 
  onSignatureChange, 
  disabled = false, 
  className = "" 
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [isErasing, setIsErasing] = useState(false)

  // Configurar canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar canvas
    canvas.width = 600
    canvas.height = 200
    
    // Configurar contexto com fundo transparente
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    // Não definir fillStyle nem preencher fundo (mantém transparente)
    
    // Configurar estilo da linha (fixo)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
  }, [])

  // Obter posição do mouse/touch no canvas
  const getCanvasPosition = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if (e instanceof MouseEvent) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      }
    } else {
      // TouchEvent
      const touch = e.touches[0] || e.changedTouches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      }
    }
  }, [])

  // Iniciar desenho
  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    if (disabled) return
    
    e.preventDefault()
    setIsDrawing(true)
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const pos = getCanvasPosition(e)
    
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    
    if (isErasing) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = 20
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
    }
  }, [disabled, getCanvasPosition, isErasing])

  // Desenhar
  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing || disabled) return
    
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const pos = getCanvasPosition(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    
    // Marcar que há assinatura
    setHasSignature(true)
    onSignatureChange(true, canvasToFile)
  }, [isDrawing, disabled, getCanvasPosition, onSignatureChange])

  // Parar desenho
  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    
    ctx.beginPath()
  }, [])

  // Limpar canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    // Limpar completamente (fundo transparente)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    setHasSignature(false)
    onSignatureChange(false)
  }, [onSignatureChange])

  // Eventos de mouse
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseDown = (e: MouseEvent) => startDrawing(e)
    const handleMouseMove = (e: MouseEvent) => draw(e)
    const handleMouseUp = () => stopDrawing()
    const handleMouseLeave = () => stopDrawing()

    // Eventos de touch
    const handleTouchStart = (e: TouchEvent) => startDrawing(e)
    const handleTouchMove = (e: TouchEvent) => draw(e)
    const handleTouchEnd = () => stopDrawing()

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [startDrawing, draw, stopDrawing])

  // Converter canvas para Blob
  const canvasToBlob = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current
      if (!canvas) {
        resolve(new Blob())
        return
      }

      canvas.toBlob((blob) => {
        resolve(blob || new Blob())
      }, 'image/png', 1.0)
    })
  }, [])

  // Converter canvas para File
  const canvasToFile = useCallback(async (filename: string = 'signature.png'): Promise<File> => {
    const blob = await canvasToBlob()
    return new File([blob], filename, { type: 'image/png' })
  }, [canvasToBlob])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Ferramentas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Modo borracha */}
              <Button
                type="button"
                variant={isErasing ? "default" : "outline"}
                size="sm"
                onClick={() => setIsErasing(!isErasing)}
                disabled={disabled}
              >
                <Eraser className="h-4 w-4 mr-2" />
                Borracha
              </Button>
            </div>

            {/* Ações */}
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                disabled={disabled || !hasSignature}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card className={`${disabled ? 'opacity-50' : ''}`}>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Desenhe sua assinatura abaixo:
              </label>
              {hasSignature && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Assinatura criada</span>
                </div>
              )}
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <canvas
                ref={canvasRef}
                className="border rounded bg-white shadow-sm cursor-crosshair w-full h-auto"
                style={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  aspectRatio: '600/200',
                  backgroundColor: 'white' // Fundo branco visual, mas PNG será transparente
                }}
              />
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              {isErasing 
                ? "Modo borracha ativo - clique e arraste para apagar" 
                : "Clique e arraste para desenhar sua assinatura"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
