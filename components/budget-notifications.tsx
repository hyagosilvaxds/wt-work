"use client"

import { useState, useEffect } from "react"
import { Bell, Clock, AlertTriangle, CheckCircle, Calendar, Building2, DollarSign, FileText, Check, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface BudgetNotification {
  budgetId: string
  budgetNumber: string
  budgetTitle: string
  clientName: string
  clientId: string
  dueDate: string
  expirationDate: string
  daysUntilExpiration: number
  status: "EXPIRING_SOON" | "EXPIRED"
  budgetStatus: string
  validityDays: number
  totalValue: number
  isRead: boolean
}

interface BudgetNotificationSummary {
  total: number
  expired: number
  expiringSoon: number
  unread: number
}

interface BudgetNotificationsResponse {
  notifications: BudgetNotification[]
  summary: BudgetNotificationSummary
}

export function BudgetNotifications() {
  const [notifications, setNotifications] = useState<BudgetNotification[]>([])
  const [summary, setSummary] = useState<BudgetNotificationSummary>({
    total: 0,
    expired: 0,
    expiringSoon: 0,
    unread: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const api = (await import('@/lib/api/client')).default
      const response = await api.get('/superadmin/budget-notifications')

      setNotifications(response.data.notifications)
      setSummary(response.data.summary)
    } catch (error) {
      console.error('Erro ao buscar notificações de orçamentos:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notificações de orçamentos.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (budgetId: string) => {
    try {
      const api = (await import('@/lib/api/client')).default
      await api.post('/superadmin/budget-notifications/mark-read', { budgetId })

      // Atualizar o estado local
      setNotifications(prev =>
        prev.map(notification =>
          notification.budgetId === budgetId
            ? { ...notification, isRead: true }
            : notification
        )
      )

      setSummary(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }))

      toast({
        title: "Sucesso",
        description: "Notificação marcada como lida.",
      })
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
      toast({
        title: "Erro",
        description: "Não foi possível marcar a notificação como lida.",
        variant: "destructive"
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      const api = (await import('@/lib/api/client')).default
      const unreadNotifications = notifications.filter(n => !n.isRead)

      // Marcar todas as não lidas como lidas
      for (const notification of unreadNotifications) {
        await api.post('/superadmin/budget-notifications/mark-read', { budgetId: notification.budgetId })
      }

      // Atualizar o estado local
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      )

      setSummary(prev => ({
        ...prev,
        unread: 0
      }))

      toast({
        title: "Sucesso",
        description: `${unreadNotifications.length} notificações marcadas como lidas.`,
      })
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
      toast({
        title: "Erro",
        description: "Não foi possível marcar todas as notificações como lidas.",
        variant: "destructive"
      })
    }
  }

  // Filtrar notificações baseado na aba ativa
  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case "unread":
        return !notification.isRead
      case "read":
        return notification.isRead
      default:
        return true
    }
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "EXPIRED":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "EXPIRING_SOON":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EXPIRED":
        return "bg-red-100 text-red-800 border-red-200"
      case "EXPIRING_SOON":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getBudgetStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getBudgetStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "Rascunho"
      case "pending":
        return "Pendente"
      case "approved":
        return "Aprovado"
      case "rejected":
        return "Rejeitado"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatTimeToExpiration = (expirationDate: string) => {
    const date = new Date(expirationDate)
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: ptBR
    })
  }

  const renderNotificationsList = (notificationsList: BudgetNotification[]) => {
    if (notificationsList.length === 0) {
      const emptyMessage = activeTab === "unread"
        ? "Não há notificações não lidas."
        : activeTab === "read"
        ? "Não há notificações lidas."
        : "Não há notificações no momento."

      return (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === "all" ? "Nenhuma notificação" : "Lista vazia"}
            </h3>
            <p className="text-gray-600">
              {emptyMessage}
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {notificationsList.map((notification) => (
          <Card
            key={notification.budgetId}
            className={`transition-all duration-200 ${
              !notification.isRead
                ? 'ring-2 ring-blue-200 bg-blue-50/50'
                : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(notification.status)}
                  <div className="space-y-1">
                    <CardTitle className="text-lg leading-tight">
                      {notification.budgetTitle || notification.budgetNumber}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {notification.clientName}
                    </CardDescription>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{notification.budgetNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-col">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getStatusColor(notification.status)} border`}
                    >
                      {notification.status === 'EXPIRED' ? 'Expirado' : 'Expirando'}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${getBudgetStatusColor(notification.budgetStatus)} border`}
                    >
                      {getBudgetStatusLabel(notification.budgetStatus)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.budgetId)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Marcar como lida
                      </Button>
                    )}
                    {notification.isRead && (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Lida
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Vencimento: {formatDate(notification.dueDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Expira: {formatDate(notification.expirationDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span>Valor: {formatCurrency(notification.totalValue)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span className={
                    notification.daysUntilExpiration < 0
                      ? 'text-red-600 font-medium'
                      : notification.daysUntilExpiration <= 2
                      ? 'text-yellow-600 font-medium'
                      : 'text-gray-600'
                  }>
                    {notification.daysUntilExpiration < 0
                      ? `Expirou há ${Math.abs(notification.daysUntilExpiration)} dias`
                      : `${notification.daysUntilExpiration} dias restantes`
                    }
                  </span>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                <p>Validade: {notification.validityDays} dias • {formatTimeToExpiration(notification.expirationDate)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Notificações de Orçamentos</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Notificações de Orçamentos</h2>
        </div>
        <div className="flex gap-2">
          {summary.unread > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
          <Button onClick={fetchNotifications} variant="outline" size="sm">
            Atualizar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expirados</p>
                <p className="text-2xl font-bold text-red-600">{summary.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expirando</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.expiringSoon}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Não Lidas</p>
                <p className="text-2xl font-bold text-purple-600">{summary.unread}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Todas ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Não Lidas ({summary.unread})
          </TabsTrigger>
          <TabsTrigger value="read" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Lidas ({notifications.length - summary.unread})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderNotificationsList(filteredNotifications)}
        </TabsContent>

        <TabsContent value="unread">
          {renderNotificationsList(filteredNotifications)}
        </TabsContent>

        <TabsContent value="read">
          {renderNotificationsList(filteredNotifications)}
        </TabsContent>
      </Tabs>
    </div>
  )
}