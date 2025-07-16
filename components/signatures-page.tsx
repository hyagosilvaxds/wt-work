"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Eye, Trash2, Search, X, FileImage, User, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  getAllSignatures, 
  deleteSignature,
  SignatureData,
  SignaturesResponse
} from "@/lib/api/superadmin"
import { ModernSignatureViewModal } from "@/components/modern-signature-modals"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

export function SignaturesPage() {
  const [signatures, setSignatures] = useState<SignatureData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  // Buscar assinaturas com debounce
  const fetchSignatures = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true)
      const response: SignaturesResponse = await getAllSignatures(page, pagination.limit, search || undefined)
      setSignatures(response.signatures)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error)
      toast.error('Erro ao carregar assinaturas')
    } finally {
      setLoading(false)
    }
  }, [pagination.limit])

  // Effect para buscar assinaturas quando a página ou termo de busca mudam
  useEffect(() => {
    fetchSignatures(1, searchTerm)
  }, [searchTerm, fetchSignatures])

  // Effect para debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Limpar busca
  const clearSearch = () => {
    setSearchInput("")
    setSearchTerm("")
  }

  // Navegar para página específica
  const goToPage = (page: number) => {
    fetchSignatures(page, searchTerm)
  }

  // Atualizar lista após upload
  const handleSignatureUploaded = () => {
    fetchSignatures(pagination.page, searchTerm)
  }

  // Deletar assinatura
  const handleDelete = async (signature: SignatureData) => {
    if (window.confirm(`Tem certeza que deseja deletar a assinatura de ${signature.instructor.name}?`)) {
      try {
        await deleteSignature(signature.instructorId)
        toast.success('Assinatura deletada com sucesso!')
        
        // Verificar se precisa voltar uma página
        const targetPage = signatures.length === 1 && pagination.page > 1 
          ? pagination.page - 1 
          : pagination.page
        fetchSignatures(targetPage, searchTerm)
      } catch (error) {
        console.error('Erro ao deletar assinatura:', error)
        toast.error('Erro ao deletar assinatura')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assinaturas</h2>
          <p className="text-gray-600">
            {loading 
              ? "Carregando assinaturas..." 
              : `${pagination.total} assinatura(s) cadastrada(s)`
            }
          </p>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome do instrutor..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchInput && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {searchTerm && (
          <Badge variant="secondary" className="flex items-center space-x-2">
            <span>Busca ativa: "{searchTerm}"</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-4 w-4 p-0 ml-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signatures.map((signature) => (
              <Card key={signature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center">
                        <FileImage className="mr-2 h-5 w-5 text-blue-500" />
                        {signature.instructor.name}
                      </CardTitle>
                      {signature.instructor.email && (
                        <p className="text-sm text-gray-600 mt-1">{signature.instructor.email}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="mr-2 h-4 w-4" />
                      ID: {signature.instructorId}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-4 w-4" />
                      Criada em: {format(new Date(signature.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    
                    <div className="border rounded-lg p-2 bg-gray-50">
                      <img 
                        src={`http://localhost:4000${signature.pngPath}`} 
                        alt={`Assinatura de ${signature.instructor.name}`}
                        className="w-full h-20 object-contain"
                      />
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <ModernSignatureViewModal signature={signature} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(signature)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Anterior
              </Button>
              
              {[...Array(pagination.totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={pagination.page === i + 1 ? "default" : "outline"}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Próxima
              </Button>
            </div>
          )}

          {signatures.length === 0 && (
            <div className="text-center py-12">
              <FileImage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma assinatura encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? `Não encontramos assinaturas com o termo "${searchTerm}". Tente buscar por outro termo.`
                  : 'Não há assinaturas cadastradas ainda.'
                }
              </p>
              {searchTerm && (
                <Button onClick={clearSearch} variant="outline" className="mt-4">
                  Limpar Busca
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
