"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Car, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Filter,
  Users,
  Calendar,
  Fuel,
  Hash
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAllVehicles, getVehiclesByCategory, getVehicleByLicensePlate, type Vehicle } from "@/lib/api/superadmin"
import { VehicleCreateModal } from "@/components/vehicle-create-modal"
import { VehicleEditModal } from "@/components/vehicle-edit-modal"
import { VehicleDetailsModal } from "@/components/vehicle-details-modal"
import { VehicleDeleteModal } from "@/components/vehicle-delete-modal"

const CATEGORIES = [
  { value: 'A', label: 'A - Motocicletas' },
  { value: 'B', label: 'B - Automóveis' },
  { value: 'C', label: 'C - Caminhões' },
  { value: 'D', label: 'D - Ônibus' },
  { value: 'E', label: 'E - Carreta' }
] as const

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' }
] as const

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 12

  // Estados dos modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const { toast } = useToast()

  // Cargar veículos
  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const data = await getAllVehicles()
      setVehicles(data)
      setFilteredVehicles(data)
    } catch (error) {
      console.error('Erro ao carregar veículos:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar veículos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  // Filtrar veículos
  useEffect(() => {
    let filtered = vehicles

    // Filtro por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter(vehicle => vehicle.category === selectedCategory)
    }

    // Filtro por status
    if (selectedStatus !== "all") {
      const isActive = selectedStatus === "active"
      filtered = filtered.filter(vehicle => vehicle.isActive === isActive)
    }

    // Filtro por busca
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(vehicle => 
        vehicle.brand.toLowerCase().includes(search) ||
        vehicle.model.toLowerCase().includes(search) ||
        vehicle.licensePlate.toLowerCase().includes(search) ||
        vehicle.color.toLowerCase().includes(search) ||
        vehicle.instructor?.name.toLowerCase().includes(search)
      )
    }

    setFilteredVehicles(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
    setCurrentPage(1)
  }, [vehicles, searchTerm, selectedCategory, selectedStatus])

  // Busca por placa específica
  const handleLicensePlateSearch = async () => {
    if (!searchTerm.trim()) {
      fetchVehicles()
      return
    }

    try {
      setLoading(true)
      const vehicle = await getVehicleByLicensePlate(searchTerm.trim())
      setFilteredVehicles([vehicle])
      setTotalPages(1)
      setCurrentPage(1)
    } catch (error) {
      // Se não encontrar por placa, usar busca normal
      console.log('Veículo não encontrado por placa, usando busca normal')
    } finally {
      setLoading(false)
    }
  }

  // Paginação
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Handlers dos modals
  const handleCreateVehicle = () => {
    setCreateModalOpen(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setEditModalOpen(true)
  }

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setDetailsModalOpen(true)
  }

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setDeleteModalOpen(true)
  }

  const handleVehicleCreated = () => {
    fetchVehicles()
    setCreateModalOpen(false)
    toast({
      title: "Sucesso",
      description: "Veículo cadastrado com sucesso",
    })
  }

  const handleVehicleUpdated = () => {
    fetchVehicles()
    setEditModalOpen(false)
    setSelectedVehicle(null)
    toast({
      title: "Sucesso",
      description: "Veículo atualizado com sucesso",
    })
  }

  const handleVehicleDeleted = () => {
    fetchVehicles()
    setDeleteModalOpen(false)
    setSelectedVehicle(null)
    toast({
      title: "Sucesso",
      description: "Veículo excluído com sucesso",
    })
  }

  // Função para formatar placa
  const formatLicensePlate = (plate: string) => {
    // Remove caracteres não alfanuméricos
    const clean = plate.replace(/[^A-Z0-9]/g, '')
    
    // Formato antigo: ABC1234 -> ABC-1234
    if (clean.length === 7 && /^[A-Z]{3}[0-9]{4}$/.test(clean)) {
      return `${clean.slice(0, 3)}-${clean.slice(3)}`
    }
    
    // Formato Mercosul: ABC1D23 -> ABC1D23 (sem alteração)
    if (clean.length === 7 && /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(clean)) {
      return clean
    }
    
    return plate
  }

  // Função para obter cor do badge da categoria
  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'A': 'bg-red-100 text-red-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-green-100 text-green-800',
      'D': 'bg-purple-100 text-purple-800',
      'E': 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Veículos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os veículos dos instrutores da autoescola
          </p>
        </div>
        <Button onClick={handleCreateVehicle} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Veículo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Veículos</p>
                <p className="text-2xl font-bold">{vehicles.length}</p>
              </div>
              <Car className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Veículos Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {vehicles.filter(v => v.isActive).length}
                </p>
              </div>
              <ToggleRight className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Veículos Inativos</p>
                <p className="text-2xl font-bold text-red-600">
                  {vehicles.filter(v => !v.isActive).length}
                </p>
              </div>
              <ToggleLeft className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Instrutores com Veículos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(vehicles.map(v => v.instructorId)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por marca, modelo, placa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleLicensePlateSearch}
                  title="Buscar por placa específica"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Resultados</label>
              <div className="flex items-center h-10 px-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">
                  {filteredVehicles.length} veículo(s) encontrado(s)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Veículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vehicle.brand} {vehicle.model}</CardTitle>
                  <p className="text-gray-600 text-sm">{vehicle.year}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryBadgeColor(vehicle.category)}>
                    {vehicle.category}
                  </Badge>
                  <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                    {vehicle.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="font-mono font-medium">{formatLicensePlate(vehicle.licensePlate)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded-full border-2`} style={{ backgroundColor: vehicle.color.toLowerCase() }} />
                  <span>{vehicle.color}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Fuel className="h-4 w-4 text-gray-500" />
                  <span>{vehicle.fuelType}</span>
                </div>
                
                {vehicle.instructor && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{vehicle.instructor.name}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(vehicle)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditVehicle(vehicle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteVehicle(vehicle)}
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
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredVehicles.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum veículo encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== "all" || selectedStatus !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Cadastre o primeiro veículo da autoescola"
              }
            </p>
            {!searchTerm && selectedCategory === "all" && selectedStatus === "all" && (
              <Button onClick={handleCreateVehicle}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Veículo
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <VehicleCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onVehicleCreated={handleVehicleCreated}
      />

      {selectedVehicle && (
        <>
          <VehicleEditModal
            vehicle={selectedVehicle}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            onVehicleUpdated={handleVehicleUpdated}
          />

          <VehicleDetailsModal
            vehicleId={selectedVehicle.id}
            open={detailsModalOpen}
            onOpenChange={setDetailsModalOpen}
          />

          <VehicleDeleteModal
            vehicle={selectedVehicle}
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onVehicleDeleted={handleVehicleDeleted}
          />
        </>
      )}
    </div>
  )
}
