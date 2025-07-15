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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { id: "students", label: "Alunos", icon: Users, badge: null },
  { id: "trainings", label: "Treinamentos", icon: BookOpen, badge: null },
  
  { id: "instructors", label: "Instrutores", icon: UserCheck, badge: null },
  { id: "clients", label: "Clientes", icon: Building2, badge: null },
  { id: "groups", label: "Turmas", icon: UsersRound, badge: null },

  { id: "certificates", label: "Certificados", icon: Award, badge: null },
  { id: "financial", label: "Financeiro", icon: DollarSign, badge: null },
  { id: "reports", label: "Relatórios", icon: BarChart3, badge: null },
  { id: "settings", label: "Configurações", icon: Settings, badge: null },
]

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

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

          {/* Search */}
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  Admin
                </p>
                <p className="text-xs text-gray-500">admin@wtwork.com</p>
                <div className="flex items-center mt-1">
                  
                  
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl justify-start"
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
