"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Mail, Phone, BookOpen, Star, User, MapPin, Calendar, FileText, Search, X, Edit, Trash2, Eye, Users, FileImage } from "lucide-react"
import { InstructorCreateModal } from "@/components/instructor-create-modal"
import { InstructorEditModal } from "@/components/instructor-edit-modal"
import { InstructorDeleteModal } from "@/components/instructor-delete-modal"
import { InstructorDetailsModal } from "@/components/instructor-details-modal"
import { InstructorExcelExportModal } from "@/components/instructor-excel-export-modal"
import { InstructorExcelImportModal } from "@/components/instructor-excel-import-modal"
import { SignaturesPage } from "@/components/signatures-page"
import { ModernSignatureUploadModal } from "@/components/modern-signature-upload-modal"
import { getInstructors } from "@/lib/api/superadmin"

interface Instructor {
  id: string
  userId: string | null
  isActive: boolean
  name: string
  corporateName: string | null
  personType: "FISICA" | "JURIDICA"
  cpf: string | null
  cnpj: string | null
  municipalRegistration: string | null
  stateRegistration: string | null
  zipCode: string | null
  address: string | null
  addressNumber: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  landlineAreaCode: string | null
  landlineNumber: string | null
  mobileAreaCode: string | null
  mobileNumber: string | null
  email: string | null
  education: string | null
  registrationNumber: string | null
  observations: string | null
  createdAt: string
  updatedAt: string
  user: any
  classes: any[]
}

interface InstructorsResponse {
  instructors: Instructor[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function InstructorsPage() {
  const [activeTab, setActiveTab] = useState("instructors")
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("")
  const [selectedInstructorName, setSelectedInstructorName] = useState<string>("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })
  const [signatureUploadKey, setSignatureUploadKey] = useState(0)

  // Buscar instrutores com debounce
  const fetchInstructors = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true)
      const response: InstructorsResponse = await getInstructors(page, pagination.limit, search || undefined)
      setInstructors(response.instructors)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Erro ao buscar instrutores:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.limit])

  // Effect para buscar instrutores quando a página ou termo de busca mudam
  useEffect(() => {
    fetchInstructors(1, searchTerm)
  }, [searchTerm, fetchInstructors])

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
      const response: InstructorsResponse = await getInstructors(page, pagination.limit, searchTerm || undefined)
      setInstructors(response.instructors)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Erro ao navegar para página:', error)
    } finally {
      setLoading(false)
    }
  }

  // Atualizar lista após criar instrutor
  const handleInstructorCreated = () => {
    fetchInstructors(1, searchTerm)
  }

  // Abrir modal de edição
  const handleEdit = (instructorId: string) => {
    setSelectedInstructorId(instructorId)
    setEditModalOpen(true)
  }

  // Abrir modal de detalhes
  const handleViewDetails = (instructorId: string) => {
    setSelectedInstructorId(instructorId)
    setDetailsModalOpen(true)
  }

  // Abrir modal de exclusão
  const handleDelete = (instructorId: string, instructorName: string) => {
    setSelectedInstructorId(instructorId)
    setSelectedInstructorName(instructorName)
    setDeleteModalOpen(true)
  }

  // Atualizar lista após editar ou deletar instrutor
  const handleInstructorUpdated = () => {
    fetchInstructors(pagination.page, searchTerm)
  }

  const handleInstructorDeleted = () => {
    const targetPage = instructors.length === 1 && pagination.page > 1 
      ? pagination.page - 1 
      : pagination.page
    fetchInstructors(targetPage, searchTerm)
  }

  // Atualizar lista após upload de assinatura
  const handleSignatureUploaded = () => {
    setSignatureUploadKey(prev => prev + 1)
  }

  // Formatar telefone
  const formatPhone = (areaCode: string | null, number: string | null) => {
    if (!areaCode || !number) return null
    return `(${areaCode}) ${number}`
  }

  // Formatar endereço
  const formatAddress = (instructor: Instructor) => {
    const parts = []
    if (instructor.address) parts.push(instructor.address)
    if (instructor.addressNumber) parts.push(instructor.addressNumber)
    if (instructor.neighborhood) parts.push(instructor.neighborhood)
    if (instructor.city) parts.push(instructor.city)
    if (instructor.state) parts.push(instructor.state)
    return parts.length > 0 ? parts.join(', ') : null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instrutores</h1>
          <p className="text-gray-600">Gerencie instrutores</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="instructors" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Instrutores
          </TabsTrigger>
         
          <TabsTrigger value="signatures" className="flex items-center">
            <FileImage className="w-4 h-4 mr-2" />
            Assinaturas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instructors" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                {loading 
                  ? "Carregando instrutores..." 
                  : `${pagination.total} instrutor(es) cadastrado(s)`
                }
              </p>
            </div>
            <div className="flex space-x-2">
              <InstructorExcelImportModal onImportCompleted={handleInstructorCreated} />
              <InstructorExcelExportModal />
              <InstructorCreateModal onInstructorCreated={handleInstructorCreated} />
            </div>
          </div>

          {/* Barra de Busca Melhorada */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email, CPF, CNPJ ou empresa..."
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
                {instructors.map((instructor) => (
                  <Card key={instructor.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                            {instructor.name}
                          </CardTitle>
                          {instructor.corporateName && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-1 font-medium">
                              {instructor.corporateName}
                            </p>
                          )}
                          <div className="flex items-center space-x-2">
                            <Badge 
                              className={`${instructor.isActive 
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                                : "bg-red-500 hover:bg-red-600 text-white"
                              } font-medium shadow-sm`}
                            >
                              {instructor.isActive ? "Ativo" : "Inativo"}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-gray-300 bg-white font-medium">
                              {instructor.personType === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3 mb-4">
                        {instructor.email && (
                          <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                            <div className="bg-blue-100 p-1 rounded-full mr-3">
                              <Mail className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className="truncate font-medium">{instructor.email}</span>
                          </div>
                        )}
                        
                        {formatPhone(instructor.mobileAreaCode, instructor.mobileNumber) && (
                          <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                            <div className="bg-green-100 p-1 rounded-full mr-3">
                              <Phone className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="font-medium">
                              {formatPhone(instructor.mobileAreaCode, instructor.mobileNumber)}
                            </span>
                          </div>
                        )}
                        
                        {formatAddress(instructor) && (
                          <div className="flex items-start text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                            <div className="bg-purple-100 p-1 rounded-full mr-3 mt-0.5">
                              <MapPin className="h-3 w-3 text-purple-600" />
                            </div>
                            <span className="line-clamp-2 font-medium">{formatAddress(instructor)}</span>
                          </div>
                        )}
                        
                        {instructor.education && (
                          <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                            <div className="bg-orange-100 p-1 rounded-full mr-3">
                              <BookOpen className="h-3 w-3 text-orange-600" />
                            </div>
                            <span className="truncate font-medium">{instructor.education}</span>
                          </div>
                        )}
                        
                        {instructor.classes && instructor.classes.length > 0 && (
                          <div className="flex items-center text-sm text-gray-700 bg-amber-50 p-2 rounded-lg">
                            <div className="bg-amber-100 p-1 rounded-full mr-3">
                              <Star className="h-3 w-3 text-amber-600" />
                            </div>
                            <span className="font-medium">
                              {instructor.classes.length} turma{instructor.classes.length > 1 ? 's' : ''} ativa{instructor.classes.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Botões de Ação */}
                      <div className="border-t pt-4 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(instructor.id)}
                            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 font-medium"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(instructor.id)}
                            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 font-medium"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(instructor.id, instructor.name)}
                          className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 font-medium"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Deletar Instrutor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Paginação Melhorada */}
              {pagination.totalPages > 1 && (
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    {/* Informações da Paginação */}
                    <div className="text-sm text-gray-600">
                      Mostrando {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} até{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} instrutores
                    </div>
                    
                    {/* Controles de Paginação */}
                    <div className="flex items-center space-x-2">
                      {/* Botão Primeira Página */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(1)}
                        disabled={pagination.page === 1}
                        className="hidden sm:flex"
                      >
                        Primeira
                      </Button>
                      
                      {/* Botão Anterior */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        ← Anterior
                      </Button>
                      
                      {/* Números das Páginas */}
                      <div className="flex items-center space-x-1">
                        {(() => {
                          const pages = []
                          const startPage = Math.max(1, pagination.page - 2)
                          const endPage = Math.min(pagination.totalPages, pagination.page + 2)
                          
                          // Primeira página se não estiver no range
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
                          
                          // Páginas no range
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
                          
                          // Última página se não estiver no range
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
                      
                      {/* Botão Próxima */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Próxima →
                      </Button>
                      
                      {/* Botão Última Página */}
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

              {/* Estado vazio melhorado */}
              {instructors.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <User className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {searchTerm ? 'Nenhum instrutor encontrado' : 'Nenhum instrutor cadastrado'}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchTerm 
                      ? `Não encontramos instrutores com o termo "${searchTerm}". Tente buscar com outros termos ou verifique a ortografia.`
                      : 'Comece criando seu primeiro instrutor. Você pode adicionar informações pessoais, de contato e documentos.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    {searchTerm ? (
                      <>
                        <Button onClick={clearSearch} variant="outline" className="flex items-center">
                          <X className="h-4 w-4 mr-2" />
                          Limpar Busca
                        </Button>
                        <InstructorCreateModal onInstructorCreated={handleInstructorCreated} />
                      </>
                    ) : (
                      <InstructorCreateModal onInstructorCreated={handleInstructorCreated} />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="signatures" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Gerencie as assinaturas dos instrutores</p>
            </div>
            <ModernSignatureUploadModal onSignatureUploaded={handleSignatureUploaded} />
          </div>
          
          <SignaturesPage key={signatureUploadKey} />
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <InstructorDetailsModal
        instructorId={selectedInstructorId}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
      
      <InstructorEditModal
        instructorId={selectedInstructorId}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onInstructorUpdated={handleInstructorUpdated}
      />
      
      <InstructorDeleteModal
        instructorId={selectedInstructorId}
        instructorName={selectedInstructorName}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onInstructorDeleted={handleInstructorDeleted}
      />
    </div>
  )
}
