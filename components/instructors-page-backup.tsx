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
import { SignaturesPage } from "@/components/signatures-page"
import { SignatureUploadFromInstructorModal, InstructorWithoutUserModal } from "@/components/signature-upload-modal"
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
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("")
  const [selectedInstructorName, setSelectedInstructorName] = useState<string>("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10, // Alterado de 12 para 10
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
    }, 500) // 500ms de debounce

    return () => clearTimeout(timer)
  }, [searchInput])

  // Limpar busca
  const clearSearch = () => {
    setSearchInput("")
    setSearchTerm("")
  }

  // Navegar para página específica
  const goToPage = (page: number) => {
    fetchInstructors(page, searchTerm)
  }

  // Atualizar lista após criar instrutor
  const handleInstructorCreated = () => {
    // Recarregar a lista mantendo a busca atual mas voltando para a página 1
    fetchInstructors(1, searchTerm)
  }

  // Abrir modal de edição
  const handleEdit = (instructorId: string) => {
    setSelectedInstructorId(instructorId)
    setEditModalOpen(true)
  }

  // Abrir modal de exclusão
  const handleDelete = (instructorId: string, instructorName: string) => {
    setSelectedInstructorId(instructorId)
    setSelectedInstructorName(instructorName)
    setDeleteModalOpen(true)
  }

  // Atualizar lista após editar ou deletar instrutor
  const handleInstructorUpdated = () => {
    // Recarregar a lista mantendo a busca atual e página atual
    fetchInstructors(pagination.page, searchTerm)
  }

  const handleInstructorDeleted = () => {
    // Recarregar a lista, voltando para página 1 se necessário
    const targetPage = instructors.length === 1 && pagination.page > 1 
      ? pagination.page - 1 
      : pagination.page
    fetchInstructors(targetPage, searchTerm)
  }

  // Atualizar lista após upload de assinatura
  const handleSignatureUploaded = () => {
    setSignatureUploadKey(prev => prev + 1)
  }

  // Atualizar lista após conectar usuário
  const handleUserLinked = () => {
    fetchInstructors(pagination.page, searchTerm)
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
          <p className="text-gray-600">Gerencie instrutores e suas assinaturas</p>
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
              <InstructorWithoutUserModal onUserLinked={handleUserLinked} />
              <InstructorCreateModal onInstructorCreated={handleInstructorCreated} />
            </div>
          </div>

          {/* Barra de Busca */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email, CPF ou CNPJ..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{/* Conteúdo dos instrutores vai aqui */}</div>
            </>
          )}
        </TabsContent>
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
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{instructor.name}</CardTitle>
                      {instructor.corporateName && (
                        <p className="text-sm text-gray-600 mt-1">{instructor.corporateName}</p>
                      )}
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge className={instructor.isActive ? "bg-green-500" : "bg-red-500"}>
                          {instructor.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {instructor.personType === 'FISICA' ? 'PF' : 'PJ'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {instructor.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="mr-2 h-4 w-4" />
                        {instructor.email}
                      </div>
                    )}
                    
                    {formatPhone(instructor.mobileAreaCode, instructor.mobileNumber) && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="mr-2 h-4 w-4" />
                        {formatPhone(instructor.mobileAreaCode, instructor.mobileNumber)}
                      </div>
                    )}

                    {formatPhone(instructor.landlineAreaCode, instructor.landlineNumber) && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="mr-2 h-4 w-4" />
                        {formatPhone(instructor.landlineAreaCode, instructor.landlineNumber)} (Fixo)
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {instructor.classes.length} aula(s) ministrada(s)
                    </div>

                    {formatAddress(instructor) && (
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="mr-2 h-4 w-4 mt-0.5" />
                        <span className="line-clamp-2">{formatAddress(instructor)}</span>
                      </div>
                    )}

                    {instructor.education && (
                      <div className="flex items-start text-sm text-gray-600">
                        <FileText className="mr-2 h-4 w-4 mt-0.5" />
                        <span className="line-clamp-2">{instructor.education}</span>
                      </div>
                    )}

                    {instructor.registrationNumber && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Registro:</span> {instructor.registrationNumber}
                      </div>
                    )}

                    {instructor.cpf && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">CPF:</span> {instructor.cpf}
                      </div>
                    )}

                    {instructor.cnpj && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">CNPJ:</span> {instructor.cnpj}
                      </div>
                    )}

                    <div className="flex gap-2 pt-3">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-1 border border-black text-black bg-transparent hover:bg-gray-100 hover:text-black transition-colors"
                        onClick={() => handleEdit(instructor.id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editar</span>
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-1 border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        onClick={() => handleDelete(instructor.id, instructor.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Excluir</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-6">
              <div className="flex items-center justify-center space-x-1">
                {/* Botão Anterior */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1 || loading}
                  onClick={() => goToPage(pagination.page - 1)}
                  className="mr-2"
                >
                  Anterior
                </Button>
                
                {/* Numeração das páginas */}
                <div className="flex items-center space-x-1">
                  {/* Primeira página */}
                  {pagination.page > 3 && (
                    <>
                      <Button
                        variant={1 === pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(1)}
                        disabled={loading}
                        className="w-10 h-10"
                      >
                        1
                      </Button>
                      {pagination.page > 4 && (
                        <span className="text-gray-500 px-2">...</span>
                      )}
                    </>
                  )}
                  
                  {/* Páginas ao redor da atual */}
                  {(() => {
                    const start = Math.max(1, pagination.page - 2)
                    const end = Math.min(pagination.totalPages, pagination.page + 2)
                    const pages = []
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={i === pagination.page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(i)}
                          disabled={loading}
                          className={`w-10 h-10 ${i === pagination.page ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
                        >
                          {i}
                        </Button>
                      )
                    }
                    return pages
                  })()}
                  
                  {/* Última página */}
                  {pagination.page < pagination.totalPages - 2 && (
                    <>
                      {pagination.page < pagination.totalPages - 3 && (
                        <span className="text-gray-500 px-2">...</span>
                      )}
                      <Button
                        variant={pagination.totalPages === pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pagination.totalPages)}
                        disabled={loading}
                        className={`w-10 h-10 ${pagination.totalPages === pagination.page ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
                      >
                        {pagination.totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Botão Próxima */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages || loading}
                  onClick={() => goToPage(pagination.page + 1)}
                  className="ml-2"
                >
                  Próxima
                </Button>
              </div>
              
              {/* Informações da paginação */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="text-sm text-gray-600">
                  Página {pagination.page} de {pagination.totalPages}
                </div>
                <div className="text-sm text-gray-600">
                  {pagination.total} resultado{pagination.total !== 1 ? 's' : ''} • {pagination.limit} por página
                </div>
                
                {/* Navegação rápida */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Ir para:</span>
                  <select
                    value={pagination.page}
                    onChange={(e) => goToPage(Number(e.target.value))}
                    disabled={loading}
                    className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                  >
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                      <option key={pageNum} value={pageNum}>
                        Página {pageNum}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Estado vazio */}
          {instructors.length === 0 && !loading && (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum instrutor encontrado para a busca' : 'Nenhum instrutor encontrado'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `Não encontramos instrutores com o termo "${searchTerm}". Tente buscar por outro termo.`
                  : 'Comece adicionando um novo instrutor à sua empresa.'
                }
              </p>
              {searchTerm ? (
                <Button onClick={clearSearch} variant="outline">
                  Limpar Busca
                </Button>
              ) : (
                <InstructorCreateModal onInstructorCreated={handleInstructorCreated} />
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="signatures" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Gerencie as assinaturas dos instrutores</p>
            </div>
            <SignatureUploadFromInstructorModal onSignatureUploaded={handleSignatureUploaded} />
          </div>
          
          <SignaturesPage key={signatureUploadKey} />
        </TabsContent>
      </Tabs>

      {/* Modais */}
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
