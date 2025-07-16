"use client"

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  UserCheck,
  Building2,
  UsersRound,
  Award,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Settings,
  LogOut,
  Star,
  DoorOpen,
  DollarSign,
  ClipboardList,
  Play,
  Download,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

// Menu baseado em permissões
const getMenuItems = (hasPermission: (permission: string) => boolean, isClient: boolean, isInstructor: boolean) => {
  const items = []
  
  // Dashboard - sempre visível para usuários autenticados
  if (hasPermission('VIEW_DASHBOARD')) {
    items.push({ id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null })
  }
  
  // Para clientes, mostrar apenas "Minhas Turmas"
  if (isClient) {
    items.push({ id: "my-classes", label: "Minhas Turmas", icon: UsersRound, badge: null })
    items.push({ id: "certificates", label: "Certificados", icon: Award, badge: null })
    // Removido: Configurações não devem estar disponíveis para clientes
    // items.push({ id: "settings", label: "Configurações", icon: Settings, badge: null })
    return items
  }
  
  // Menu para outros tipos de usuários
  // Alunos
  if (hasPermission('VIEW_STUDENTS')) {
    items.push({ id: "students", label: "Alunos", icon: Users, badge: null })
  }
  
  // Instrutores/Usuários - OCULTO para instrutores
  if ((hasPermission('VIEW_USERS') || hasPermission('MANAGE_USERS')) && !isInstructor) {
    items.push({ id: "instructors", label: "Instrutores", icon: UserCheck, badge: null })
  }
  
  // Treinamentos
  if (hasPermission('VIEW_TRAININGS') || hasPermission('VIEW_OWN_TRAININGS')) {
    items.push({ id: "trainings", label: "Treinamentos", icon: BookOpen, badge: null })
  }
  
  // Turmas/Aulas
  if (hasPermission('VIEW_CLASSES') || hasPermission('VIEW_OWN_CLASSES')) {
    items.push({ id: "classes", label: "Turmas", icon: UsersRound, badge: null })
  }
  
  // Clientes - OCULTO para instrutores
  if (hasPermission('VIEW_USERS') && !isInstructor) {
    items.push({ id: "clients", label: "Clientes", icon: Building2, badge: null })
  }
  
  // Certificados
  if (hasPermission('VIEW_CERTIFICATES') || hasPermission('VIEW_OWN_CERTIFICATES')) {
    items.push({ id: "certificates", label: "Certificados", icon: Award, badge: null })
  }
  
  // Gerador de Certificados (temporário para demonstração)
  // Gerador de certificados removido do menu - integrado na tela de certificados
  
  // Financeiro - TEMPORARIAMENTE OCULTO
  // if (hasPermission('VIEW_FINANCIAL') || hasPermission('VIEW_ACCOUNTS_RECEIVABLE') || hasPermission('VIEW_ACCOUNTS_PAYABLE') || hasPermission('VIEW_CASH_FLOW')) {
  //   items.push({ id: "financial", label: "Financeiro", icon: DollarSign, badge: null })
  // }
  
  // Relatórios - TEMPORARIAMENTE OCULTO
  // if (hasPermission('VIEW_REPORTS') || hasPermission('VIEW_FINANCIAL_REPORTS') || hasPermission('VIEW_ANALYTICS')) {
  //   items.push({ id: "reports", label: "Relatórios", icon: BarChart3, badge: null })
  // }
  
  // Configurações/Roles - OCULTO para instrutores
  if ((hasPermission('VIEW_ROLES') || hasPermission('MANAGE_USERS') || hasPermission('EDIT_PROFILE')) && !isInstructor) {
    items.push({ id: "settings", label: "Configurações", icon: Settings, badge: null })
  }
  
  return items
}

export function AdaptiveSidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, permissions, logout, hasPermission, isClient, isInstructor } = useAuth()

  const menuItems = getMenuItems(hasPermission, isClient, isInstructor)

  // Obter informações do usuário para exibição
  const getUserInfo = () => {
    if (user) {
      return {
        name: user.name || 'Usuário',
        email: user.email || 'email@exemplo.com',
        avatar: user.name ? user.name.charAt(0).toUpperCase() : 'U',
        roleDisplay: user.role?.name || user.roleId || 'Usuário',
        permissionsCount: permissions.length
      }
    }
    return {
      name: 'Visitante',
      email: 'visitante@exemplo.com',
      avatar: 'V',
      roleDisplay: 'Visitante',
      permissionsCount: 0
    }
  }

  const userInfo = getUserInfo()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 shadow-xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className="flex items-center justify-center h-20 bg-[#78BA00] z-50"
            style={{ backgroundColor: '#78BA00' }}
          >
            <img src="/logoWT.png" alt="wt Work Treinamentos" className="h-12 w-auto" />
          </div>

          {/* Search - disponível para todos */}
          <div className="px-6 pt-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 group transition-all duration-200 rounded-xl h-12 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg transform scale-105 hover:text-white"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsOpen(false)
                  }}
                >
                  <Icon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className={`ml-auto text-xs px-2 py-1 ${
                        activeTab === item.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {activeTab === item.id && <ChevronRight className="ml-2 h-4 w-4 opacity-70" />}
                </Button>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-600">
                  {userInfo.avatar}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {userInfo.name}
                </p>
                <p className="text-xs text-gray-500">{userInfo.email}</p>
                <p className="text-xs text-gray-400 mt-1">{userInfo.roleDisplay}</p>
                {userInfo.permissionsCount > 0 && (
                  <p className="text-xs text-blue-500 mt-1">
                    {userInfo.permissionsCount} permissões
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1">
                
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl justify-start"
              onClick={logout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
