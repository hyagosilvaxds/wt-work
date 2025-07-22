"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface TestModalProps {
  onImportCompleted?: () => void
}

export function TestImportModal({ onImportCompleted }: TestModalProps) {
  const [open, setOpen] = useState(false)

  console.log('TestImportModal - open:', open)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
          <Upload className="h-4 w-4 mr-2" />
          Teste Modal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal de Teste</DialogTitle>
          <DialogDescription>
            Este é um modal simples para testar se o problema está na implementação básica.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <p>Se você está vendo isso, o modal está funcionando!</p>
          <Button onClick={() => setOpen(false)} className="mt-4">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
