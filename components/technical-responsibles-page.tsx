"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Mail, Phone, User, Search, X, Edit, Trash2, Eye, Users, FileImage, Shield, Briefcase, CreditCard, FileText } from "lucide-react"
import { TechnicalResponsibleCreateModal } from "@/components/technical-responsible-create-modal"
import { TechnicalResponsibleEditModal } from "@/components/technical-responsible-edit-modal"
import { TechnicalResponsibleDeleteModal } from "@/components/technical-responsible-delete-modal"
import { TechnicalResponsibleDetailsModal } from "@/components/technical-responsible-details-modal"
import { TechnicalResponsibleSignatureUploadModal } from "@/components/technical-responsible-signature-upload-modal"
import { getTechnicalResponsibles, type TechnicalResponsible, type TechnicalResponsibleResponse } from "@/lib/api/superadmin"

export function TechnicalResponsiblesPage() {
  const [technicalResponsibles, setTechnicalResponsibles] = useState<TechnicalResponsible[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [signatureUploadModalOpen, setSignatureUploadModalOpen] = useState(false)
  const [selectedTechnicalResponsibleId, setSelectedTechnicalResponsibleId] = useState<string>("")
  const [selectedTechnicalResponsibleName, setSelectedTechnicalResponsibleName] = useState<string>("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  // Buscar responsáveis técnicos com debounce
  const fetchTechnicalResponsibles = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true)
      const response: TechnicalResponsibleResponse = await getTechnicalResponsibles(page, pagination.limit, search || undefined)
      setTechnicalResponsibles(response.technicalResponsibles)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Erro ao buscar responsáveis técnicos:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.limit])

  // Effect para buscar responsáveis técnicos quando a página ou termo de busca mudam
  useEffect(() => {
    fetchTechnicalResponsibles(1, searchTerm)
  }, [searchTerm, fetchTechnicalResponsibles])

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
  const goToPage = async (page: number) => {
    if (page < 1 || page > pagination.totalPages || page === pagination.page) {
      return
    }
    
    try {
      setLoading(true)
      const response: TechnicalResponsibleResponse = await getTechnicalResponsibles(page, pagination.limit, searchTerm || undefined)
      setTechnicalResponsibles(response.technicalResponsibles)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Erro ao navegar para página:', error)
    } finally {
      setLoading(false)
    }
  }

  // Atualizar lista após criar responsável técnico
  const handleTechnicalResponsibleCreated = () => {
    fetchTechnicalResponsibles(1, searchTerm)
  }

  // Abrir modal de edição
  const handleEdit = (technicalResponsibleId: string) => {
    setSelectedTechnicalResponsibleId(technicalResponsibleId)
    setEditModalOpen(true)
  }

  // Abrir modal de detalhes
  const handleViewDetails = (technicalResponsibleId: string) => {
    setSelectedTechnicalResponsibleId(technicalResponsibleId)
    setDetailsModalOpen(true)
  }

  // Abrir modal de exclusão
  const handleDelete = (technicalResponsibleId: string, technicalResponsibleName: string) => {
    setSelectedTechnicalResponsibleId(technicalResponsibleId)
    setSelectedTechnicalResponsibleName(technicalResponsibleName)
    setDeleteModalOpen(true)
  }

  // Abrir modal de upload de assinatura
  const handleSignatureUpload = (technicalResponsibleId: string) => {
    setSelectedTechnicalResponsibleId(technicalResponsibleId)
    setSignatureUploadModalOpen(true)
  }

  // Atualizar lista após editar ou deletar responsável técnico
  const handleTechnicalResponsibleUpdated = () => {
    fetchTechnicalResponsibles(pagination.page, searchTerm)
  }

  const handleTechnicalResponsibleDeleted = () => {
    const targetPage = technicalResponsibles.length === 1 && pagination.page > 1 
      ? pagination.page - 1 
      : pagination.page
    fetchTechnicalResponsibles(targetPage, searchTerm)
  }

  // Formatar CPF
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Responsáveis Técnicos</h1>
          <p className="text-gray-600">Gerencie responsáveis técnicos e suas assinaturas</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            {loading 
              ? "Carregando responsáveis técnicos..." 
              : `${pagination.total} responsável(is) técnico(s) cadastrado(s)`
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <TechnicalResponsibleCreateModal onTechnicalResponsibleCreated={handleTechnicalResponsibleCreated} />
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, email, CPF ou profissão..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {searchInput && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {searchTerm && (
            <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
                Buscando: "{searchTerm}"
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="ml-2 h-6 w-6 p-0 hover:bg-blue-200 text-blue-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {technicalResponsibles.map((technicalResponsible) => (
              <Card key={technicalResponsible.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                        {technicalResponsible.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1 font-medium">
                        {technicalResponsible.profession}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={`${technicalResponsible.isActive 
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                            : "bg-red-500 hover:bg-red-600 text-white"
                          } font-medium shadow-sm`}
                        >
                          {technicalResponsible.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        {technicalResponsible.signaturePath && (
                          <Badge variant="outline" className="text-xs border-green-300 bg-green-50 text-green-700 font-medium">
                            Com Assinatura
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-4">
                    {technicalResponsible.email && (
                      <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                        <div className="bg-blue-100 p-1 rounded-full mr-3">
                          <Mail className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="truncate font-medium">{technicalResponsible.email}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                      <div className="bg-purple-100 p-1 rounded-full mr-3">
                        <CreditCard className="h-3 w-3 text-purple-600" />
                      </div>
                      <span className="font-medium">CPF: {formatCPF(technicalResponsible.cpf)}</span>
                    </div>
                    
                    {technicalResponsible.professionalRegistry && (
                      <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                        <div className="bg-orange-100 p-1 rounded-full mr-3">
                          <Shield className="h-3 w-3 text-orange-600" />
                        </div>
                        <span className="truncate font-medium">{technicalResponsible.professionalRegistry}</span>
                      </div>
                    )}
                    
                    {technicalResponsible.mobilePhone && (
                      <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                        <div className="bg-green-100 p-1 rounded-full mr-3">
                          <Phone className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="font-medium">{technicalResponsible.mobilePhone}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(technicalResponsible.id)}
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 font-medium"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(technicalResponsible.id)}
                        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 font-medium"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSignatureUpload(technicalResponsible.id)}
                        className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300 font-medium"
                      >
                        <FileImage className="h-4 w-4 mr-1" />
                        Assinatura
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(technicalResponsible.id, technicalResponsible.name)}
                        className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 font-medium"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Deletar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  Mostrando {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} até{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} responsáveis técnicos
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(1)}
                    disabled={pagination.page === 1}
                    className="hidden sm:flex"
                  >
                    Primeira
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    ← Anterior
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {(() => {
                      const pages = []
                      const startPage = Math.max(1, pagination.page - 2)
                      const endPage = Math.min(pagination.totalPages, pagination.page + 2)
                      
                      if (startPage > 1) {
                        pages.push(
                          <Button
                            key={1}
                            variant={1 === pagination.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(1)}
                            className="w-10 h-10 p-0"
                          >
                            1
                          </Button>
                        )
                        if (startPage > 2) {
                          pages.push(<span key="ellipsis1" className="px-2 text-gray-400">...</span>)
                        }
                      }
                      
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={i === pagination.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(i)}
                            className="w-10 h-10 p-0"
                          >
                            {i}
                          </Button>
                        )
                      }
                      
                      if (endPage < pagination.totalPages) {
                        if (endPage < pagination.totalPages - 1) {
                          pages.push(<span key="ellipsis2" className="px-2 text-gray-400">...</span>)
                        }
                        pages.push(
                          <Button
                            key={pagination.totalPages}
                            variant={pagination.totalPages === pagination.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pagination.totalPages)}
                            className="w-10 h-10 p-0"
                          >
                            {pagination.totalPages}
                          </Button>
                        )
                      }
                      
                      return pages
                    })()}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Próxima →
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.totalPages)}
                    disabled={pagination.page === pagination.totalPages}
                    className="hidden sm:flex"
                  >
                    Última
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Estado vazio */}
          {technicalResponsibles.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {searchTerm ? 'Nenhum responsável técnico encontrado' : 'Nenhum responsável técnico cadastrado'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? `Não encontramos responsáveis técnicos com o termo "${searchTerm}". Tente buscar com outros termos ou verifique a ortografia.`
                  : 'Comece criando seu primeiro responsável técnico. Você pode adicionar engenheiros, médicos do trabalho e outros profissionais qualificados.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                {searchTerm ? (
                  <>
                    <Button onClick={clearSearch} variant="outline" className="flex items-center">
                      <X className="h-4 w-4 mr-2" />
                      Limpar Busca
                    </Button>
                    <TechnicalResponsibleCreateModal onTechnicalResponsibleCreated={handleTechnicalResponsibleCreated} />
                  </>
                ) : (
                  <TechnicalResponsibleCreateModal onTechnicalResponsibleCreated={handleTechnicalResponsibleCreated} />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modais */}
      <TechnicalResponsibleDetailsModal
        technicalResponsibleId={selectedTechnicalResponsibleId}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
      
      <TechnicalResponsibleEditModal
        technicalResponsibleId={selectedTechnicalResponsibleId}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onTechnicalResponsibleUpdated={handleTechnicalResponsibleUpdated}
      />
      
      <TechnicalResponsibleDeleteModal
        technicalResponsibleId={selectedTechnicalResponsibleId}
        technicalResponsibleName={selectedTechnicalResponsibleName}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onTechnicalResponsibleDeleted={handleTechnicalResponsibleDeleted}
      />

      <TechnicalResponsibleSignatureUploadModal
        technicalResponsibleId={selectedTechnicalResponsibleId}
        open={signatureUploadModalOpen}
        onOpenChange={setSignatureUploadModalOpen}
        onSignatureUploaded={handleTechnicalResponsibleUpdated}
      />
    </div>
  )
}
