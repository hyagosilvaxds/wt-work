"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Building,
  CreditCard,
  Users,
  Save,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  FileText,
  Image,
  Globe
} from "lucide-react"

interface CompanyInfo {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website: string
  cnpj: string
  logo?: string
}

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  agency: string
  accountType: 'corrente' | 'poupanca'
  holder: string
  document: string
}

interface Equipment {
  id: string
  name: string
  description: string
  standardPrice: number
  category: string
}

interface StandardText {
  id: string
  title: string
  content: string
  type: 'terms' | 'conditions' | 'notes'
}

interface CoverPage {
  id: string
  name: string
  title: string
  subtitle?: string
  logoUrl?: string
  backgroundUrl?: string
  headerText?: string
  footerText?: string
  isDefault: boolean
}

interface GlobalSettings {
  defaultValidityDays: number
  maxDiscountPercent: number
  defaultPaymentTerms: string
  autoApprovalLimit: number
  requireApprovalAbove: number
  emailNotifications: boolean
  smsNotifications: boolean
  defaultCurrency: string
  taxRate: number
}

export function BudgetSettingsPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "Work Treinamentos",
    address: "Rua dos Treinamentos, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    phone: "(11) 3456-7890",
    email: "contato@worktreinamentos.com",
    website: "www.worktreinamentos.com",
    cnpj: "12.345.678/0001-90"
  })

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "Banco do Brasil",
      accountNumber: "12345-6",
      agency: "1234",
      accountType: "corrente",
      holder: "Work Treinamentos Ltda",
      document: "12.345.678/0001-90"
    },
    {
      id: "2",
      bankName: "Itaú",
      accountNumber: "98765-4",
      agency: "5678",
      accountType: "corrente",
      holder: "Work Treinamentos Ltda",
      document: "12.345.678/0001-90"
    }
  ])

  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: "1",
      name: "Cinto de Segurança",
      description: "Cinto de segurança tipo paraquedista",
      standardPrice: 150,
      category: "EPI"
    },
    {
      id: "2",
      name: "Capacete de Proteção",
      description: "Capacete classe A com jugular",
      standardPrice: 45,
      category: "EPI"
    },
    {
      id: "3",
      name: "Luvas de Segurança",
      description: "Luvas de vaqueta cano curto",
      standardPrice: 25,
      category: "EPI"
    }
  ])

  const [standardTexts, setStandardTexts] = useState<StandardText[]>([
    {
      id: "1",
      title: "Termos e Condições Gerais",
      content: "Este orçamento é válido por 30 dias a partir da data de emissão. Os valores apresentados incluem todos os materiais e certificações necessárias.",
      type: "terms"
    },
    {
      id: "2",
      title: "Condições de Pagamento",
      content: "Pagamento à vista: 5% de desconto. Parcelado: entrada de 50% + 2x sem juros. Aceitos: PIX, transferência bancária, cartão de crédito.",
      type: "conditions"
    },
    {
      id: "3",
      title: "Observações Padrão",
      content: "Todos os treinamentos seguem as normas regulamentadoras vigentes. Certificados válidos em todo território nacional.",
      type: "notes"
    }
  ])

  const [coverPages, setCoverPages] = useState<CoverPage[]>([
    {
      id: "1",
      name: "Padrão",
      title: "Work Treinamentos",
      subtitle: "Excelência em Capacitação Profissional",
      headerText: "Orçamento Personalizado",
      footerText: "Obrigado pela confiança!",
      isDefault: true
    },
    {
      id: "2",
      name: "Empresarial",
      title: "Work Treinamentos",
      subtitle: "Soluções Corporativas",
      headerText: "Proposta Comercial",
      footerText: "Juntos construímos o futuro",
      isDefault: false
    }
  ])

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    defaultValidityDays: 30,
    maxDiscountPercent: 15,
    defaultPaymentTerms: "À vista com 5% de desconto ou parcelado em até 3x sem juros",
    autoApprovalLimit: 5000,
    requireApprovalAbove: 10000,
    emailNotifications: true,
    smsNotifications: false,
    defaultCurrency: "BRL",
    taxRate: 0
  })

  const [isEditing, setIsEditing] = useState({
    company: false,
    banks: false,
    equipment: false,
    texts: false,
    coverPages: false,
    globalSettings: false
  })

  const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }))
  }

  const addBankAccount = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: "",
      accountNumber: "",
      agency: "",
      accountType: "corrente",
      holder: companyInfo.name,
      document: companyInfo.cnpj
    }
    setBankAccounts(prev => [...prev, newAccount])
    setIsEditing(prev => ({ ...prev, banks: true }))
  }

  const updateBankAccount = (id: string, field: keyof BankAccount, value: string) => {
    setBankAccounts(prev =>
      prev.map(account =>
        account.id === id ? { ...account, [field]: value } : account
      )
    )
  }

  const removeBankAccount = (id: string) => {
    setBankAccounts(prev => prev.filter(account => account.id !== id))
  }

  const addEquipment = () => {
    const newEquipment: Equipment = {
      id: Date.now().toString(),
      name: "",
      description: "",
      standardPrice: 0,
      category: "EPI"
    }
    setEquipment(prev => [...prev, newEquipment])
    setIsEditing(prev => ({ ...prev, equipment: true }))
  }

  const updateEquipment = (id: string, field: keyof Equipment, value: string | number) => {
    setEquipment(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const removeEquipment = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id))
  }

  const addStandardText = () => {
    const newText: StandardText = {
      id: Date.now().toString(),
      title: "",
      content: "",
      type: "notes"
    }
    setStandardTexts(prev => [...prev, newText])
    setIsEditing(prev => ({ ...prev, texts: true }))
  }

  const updateStandardText = (id: string, field: keyof StandardText, value: string) => {
    setStandardTexts(prev =>
      prev.map(text =>
        text.id === id ? { ...text, [field]: value } : text
      )
    )
  }

  const removeStandardText = (id: string) => {
    setStandardTexts(prev => prev.filter(text => text.id !== id))
  }

  const addCoverPage = () => {
    const newCoverPage: CoverPage = {
      id: Date.now().toString(),
      name: "",
      title: "",
      subtitle: "",
      headerText: "",
      footerText: "",
      isDefault: false
    }
    setCoverPages(prev => [...prev, newCoverPage])
    setIsEditing(prev => ({ ...prev, coverPages: true }))
  }

  const updateCoverPage = (id: string, field: keyof CoverPage, value: string | boolean) => {
    setCoverPages(prev =>
      prev.map(page =>
        page.id === id ? { ...page, [field]: value } : page
      )
    )
  }

  const removeCoverPage = (id: string) => {
    setCoverPages(prev => prev.filter(page => page.id !== id))
  }

  const setAsDefaultCoverPage = (id: string) => {
    setCoverPages(prev =>
      prev.map(page => ({
        ...page,
        isDefault: page.id === id
      }))
    )
  }

  const updateGlobalSetting = (field: keyof GlobalSettings, value: string | number | boolean) => {
    setGlobalSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log('Salvando configurações...', {
      companyInfo,
      bankAccounts,
      equipment,
      standardTexts,
      coverPages,
      globalSettings
    })

    setIsEditing({
      company: false,
      banks: false,
      equipment: false,
      texts: false,
      coverPages: false,
      globalSettings: false
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações de Orçamentos</h1>
          <p className="text-gray-600">Configure dados padrão para todos os orçamentos</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Contas
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Equipamentos
          </TabsTrigger>
          <TabsTrigger value="texts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Textos
          </TabsTrigger>
          <TabsTrigger value="covers" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Cover Pages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          {/* Informações da Empresa */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <CardTitle>Informações da Empresa</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(prev => ({ ...prev, company: !prev.company }))}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditing.company ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
              <CardDescription>
                Dados que aparecerão em todos os orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={companyInfo.name}
                    onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={companyInfo.cnpj}
                    onChange={(e) => handleCompanyInfoChange('cnpj', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={companyInfo.address}
                    onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={companyInfo.city}
                    onChange={(e) => handleCompanyInfoChange('city', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={companyInfo.state}
                    onChange={(e) => handleCompanyInfoChange('state', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={companyInfo.zipCode}
                    onChange={(e) => handleCompanyInfoChange('zipCode', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={companyInfo.phone}
                    onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companyInfo.website}
                    onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          {/* Contas Bancárias */}
          <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <CardTitle>Informações da Empresa</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(prev => ({ ...prev, company: !prev.company }))}
            >
              <Edit className="h-4 w-4 mr-1" />
              {isEditing.company ? 'Cancelar' : 'Editar'}
            </Button>
          </div>
          <CardDescription>
            Dados que aparecerão em todos os orçamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={companyInfo.name}
                onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                disabled={!isEditing.company}
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={companyInfo.cnpj}
                onChange={(e) => handleCompanyInfoChange('cnpj', e.target.value)}
                disabled={!isEditing.company}
              />
            </div>
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={companyInfo.address}
                onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                disabled={!isEditing.company}
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={companyInfo.city}
                onChange={(e) => handleCompanyInfoChange('city', e.target.value)}
                disabled={!isEditing.company}
              />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={companyInfo.state}
                onChange={(e) => handleCompanyInfoChange('state', e.target.value)}
                disabled={!isEditing.company}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={companyInfo.zipCode}
                onChange={(e) => handleCompanyInfoChange('zipCode', e.target.value)}
                disabled={!isEditing.company}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={companyInfo.phone}
                onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                disabled={!isEditing.company}
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={companyInfo.email}
                onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                disabled={!isEditing.company}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyInfo.website}
                onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                disabled={!isEditing.company}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contas Bancárias */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Contas Bancárias</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(prev => ({ ...prev, banks: !prev.banks }))}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing.banks ? 'Cancelar' : 'Editar'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={addBankAccount}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Conta
              </Button>
            </div>
          </div>
          <CardDescription>
            Contas bancárias para recebimento de pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bankAccounts.map((account) => (
            <div key={account.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{account.bankName || 'Nova Conta Bancária'}</h4>
                {isEditing.banks && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBankAccount(account.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Banco</Label>
                  <Input
                    value={account.bankName}
                    onChange={(e) => updateBankAccount(account.id, 'bankName', e.target.value)}
                    disabled={!isEditing.banks}
                    placeholder="Nome do banco"
                  />
                </div>
                <div>
                  <Label>Agência</Label>
                  <Input
                    value={account.agency}
                    onChange={(e) => updateBankAccount(account.id, 'agency', e.target.value)}
                    disabled={!isEditing.banks}
                    placeholder="0000"
                  />
                </div>
                <div>
                  <Label>Conta</Label>
                  <Input
                    value={account.accountNumber}
                    onChange={(e) => updateBankAccount(account.id, 'accountNumber', e.target.value)}
                    disabled={!isEditing.banks}
                    placeholder="12345-6"
                  />
                </div>
                <div>
                  <Label>Titular</Label>
                  <Input
                    value={account.holder}
                    onChange={(e) => updateBankAccount(account.id, 'holder', e.target.value)}
                    disabled={!isEditing.banks}
                    placeholder="Nome do titular"
                  />
                </div>
                <div>
                  <Label>Documento</Label>
                  <Input
                    value={account.document}
                    onChange={(e) => updateBankAccount(account.id, 'document', e.target.value)}
                    disabled={!isEditing.banks}
                    placeholder="CPF/CNPJ"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Equipamentos Padrão */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Equipamentos Padrão</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(prev => ({ ...prev, equipment: !prev.equipment }))}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing.equipment ? 'Cancelar' : 'Editar'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={addEquipment}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Equipamento
              </Button>
            </div>
          </div>
          <CardDescription>
            Lista de equipamentos e preços padrão para orçamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {equipment.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{item.name || 'Novo Equipamento'}</h4>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
                {isEditing.equipment && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEquipment(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateEquipment(item.id, 'name', e.target.value)}
                    disabled={!isEditing.equipment}
                    placeholder="Nome do equipamento"
                  />
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Input
                    value={item.category}
                    onChange={(e) => updateEquipment(item.id, 'category', e.target.value)}
                    disabled={!isEditing.equipment}
                    placeholder="EPI, Ferramentas, etc."
                  />
                </div>
                <div>
                  <Label>Preço Padrão</Label>
                  <Input
                    type="number"
                    value={item.standardPrice}
                    onChange={(e) => updateEquipment(item.id, 'standardPrice', Number(e.target.value))}
                    disabled={!isEditing.equipment}
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-4">
                  <Label>Descrição</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateEquipment(item.id, 'description', e.target.value)}
                    disabled={!isEditing.equipment}
                    placeholder="Descrição detalhada do equipamento"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Textos Padrão */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Textos Padrão</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(prev => ({ ...prev, texts: !prev.texts }))}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing.texts ? 'Cancelar' : 'Editar'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={addStandardText}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Texto
              </Button>
            </div>
          </div>
          <CardDescription>
            Textos padrão para termos, condições e observações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {standardTexts.map((text) => (
            <div key={text.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{text.title || 'Novo Texto'}</h4>
                  <Badge variant="outline">{text.type}</Badge>
                </div>
                {isEditing.texts && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStandardText(text.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={text.title}
                    onChange={(e) => updateStandardText(text.id, 'title', e.target.value)}
                    disabled={!isEditing.texts}
                    placeholder="Título do texto"
                  />
                </div>
                <div>
                  <Label>Conteúdo</Label>
                  <Textarea
                    value={text.content}
                    onChange={(e) => updateStandardText(text.id, 'content', e.target.value)}
                    disabled={!isEditing.texts}
                    placeholder="Conteúdo do texto..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}