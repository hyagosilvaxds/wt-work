"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Globe,
  Upload,
  X,
  Loader2
} from "lucide-react"
import {
  createCoverPage,
  listCoverPages,
  getCoverPageById,
  updateCoverPage,
  deleteCoverPage,
  uploadCoverFile,
  CoverPageResponse,
  CoverPageType,
  getCompanyData,
  createCompanyData,
  updateCompanyData,
  CompanyDataResponse,
  CreateCompanyDataPayload,
  createGlobalEmail,
  getGlobalEmail,
  updateGlobalEmail,
  GlobalEmailResponse,
  CreateGlobalEmailPayload,
  createBankData,
  getBankData,
  updateBankData,
  BankDataResponse,
  CreateBankDataPayload,
  createPaymentCondition,
  listPaymentConditions,
  getPaymentConditionById,
  updatePaymentCondition,
  deletePaymentCondition,
  PaymentConditionResponse,
  CreatePaymentConditionPayload,
  uploadSystemPhoto,
  getSystemPhotoById,
  updateSystemPhoto,
  deleteSystemPhoto,
  createSystemDescription,
  listSystemDescriptions,
  getSystemDescriptionById,
  updateSystemDescription,
  SystemDescriptionResponse,
  CreateSystemDescriptionPayload,
  SystemPhotoResponse,
  uploadCertificate,
  listCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
  CertificateResponse,
  CreateCertificatePayload,
  createEquipment,
  listEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  uploadEquipmentPhoto,
  getEquipmentPhotoById,
  updateEquipmentPhoto,
  deleteEquipmentPhoto,
  EquipmentResponse,
  CreateEquipmentPayload,
  EquipmentPhotoResponse,
  createIncludedItem,
  listIncludedItems,
  getIncludedItemById,
  updateIncludedItem,
  deleteIncludedItem,
  CreateIncludedItemPayload,
  IncludedItemGlobal,
  uploadIncludedItemPhoto,
  getIncludedItemPhotoById,
  updateIncludedItemPhoto,
  deleteIncludedItemPhoto,
  IncludedItemPhotoResponse
} from "@/lib/api/budgets"

interface CompanyInfo {
  id?: string
  companyName: string
  tradeName?: string
  phone1?: string
  phone2?: string
  cnpj: string
  address?: string
  municipalRegistration?: string
  email2?: string
  stateRegistration?: string
  zipCode?: string
  city?: string
  state?: string
}

interface GlobalEmail {
  id?: string
  email: string
  description?: string
}

interface BankData {
  id?: string
  bank1Name: string
  bank1Agency: string
  bank1Account: string
  bank1Beneficiary: string
  bank2Name?: string
  bank2Agency?: string
  bank2Account?: string
  bank2Beneficiary?: string
  pixKey?: string
  pixType?: string
}

interface PaymentCondition {
  id?: string
  name: string
  description: string
  terms?: string
}

interface SystemDescription {
  id?: string
  title: string
  description: string
  features?: string
  benefits?: string
  photos?: {
    id: string
    caption?: string
    filePath?: string
    fileName?: string
  }[]
}

interface Certificate {
  id?: string
  name: string
  description: string
  issuer?: string
  validUntil?: string
  filePath?: string
  fileName?: string
  fileSize?: number
}

interface Equipment {
  id?: string
  name: string
  description?: string
  specifications?: string
  photos?: {
    id: string
    caption?: string
    filePath?: string
    fileName?: string
  }[]
}

interface IncludedItem {
  id?: string
  description: string
  details?: string
  photos?: {
    id: string
    caption?: string
    filePath?: string
    fileName?: string
  }[]
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
  description?: string
  type: CoverPageType
  filePath?: string
  fileName?: string
  fileSize?: number
  isDefault?: boolean
  isActive?: boolean
  uploadedBy?: string
  createdAt?: string
  updatedAt?: string
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
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: "",
    tradeName: "",
    phone1: "",
    phone2: "",
    cnpj: "",
    address: "",
    municipalRegistration: "",
    email2: "",
    stateRegistration: "",
    zipCode: "",
    city: "",
    state: ""
  })

  const [equipment, setEquipment] = useState<Equipment[]>([])

  const [includedItems, setIncludedItems] = useState<IncludedItem[]>([])
  const [includedItemEdits, setIncludedItemEdits] = useState<Record<string, { description: string; details: string; saving?: boolean }>>({})

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

  const [coverPages, setCoverPages] = useState<CoverPage[]>([])
  const [loadingCoverPages, setLoadingCoverPages] = useState(false)

  // Global email state
  const [globalEmail, setGlobalEmail] = useState<GlobalEmail>({
    email: "",
    description: ""
  })

  // Bank data state
  const [bankData, setBankData] = useState<BankData>({
    bank1Name: "",
    bank1Agency: "",
    bank1Account: "",
    bank1Beneficiary: "",
    bank2Name: "",
    bank2Agency: "",
    bank2Account: "",
    bank2Beneficiary: "",
    pixKey: "",
    pixType: ""
  })

  // Payment condition state
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition>({
    name: "",
    description: "",
    terms: ""
  })

  // System description state
  const [systemDescription, setSystemDescription] = useState<SystemDescription>({
    title: "",
    description: "",
    features: "",
    benefits: "",
    photos: []
  })

  // Certificates state
  const [certificates, setCertificates] = useState<Certificate[]>([])

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
    email: false,
    banks: false,
    payments: false,
    system: false,
    certificates: false,
    equipment: false,
    includedItems: false,
    texts: false,
    coverPages: false,
    globalSettings: false
  })

  // Controlled tab state so we can programmatically switch to the settings tab
  const [currentTab, setCurrentTab] = useState<string>("company")

  // Cover page modal states
  const [isCreateCoverPageModalOpen, setIsCreateCoverPageModalOpen] = useState(false)
  const [newCoverPageData, setNewCoverPageData] = useState({
    name: "",
    description: "",
    type: "COVER" as "COVER" | "BACK_COVER",
    isDefault: false,
    isActive: true,
  file: null as File | null
  })
  const [isSubmittingCoverPage, setIsSubmittingCoverPage] = useState(false)
  
  // Available cover pages for selection
  const [availableCoverPages, setAvailableCoverPages] = useState<CoverPageResponse[]>([])
  const [loadingAvailableCoverPages, setLoadingAvailableCoverPages] = useState(false)

  // Certificate modal states
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false)
  const [certificateFormData, setCertificateFormData] = useState({
    name: "",
    description: "",
    issuer: "",
    validUntil: "",
    file: null as File | null
  })
  const [isSubmittingCertificate, setIsSubmittingCertificate] = useState(false)

  // Equipment modal states
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false)
  const [equipmentFormData, setEquipmentFormData] = useState({
    name: "",
    description: "",
    specifications: ""
  })
  const [isSubmittingEquipment, setIsSubmittingEquipment] = useState(false)

  // Included items modal states
  const [isIncludedItemModalOpen, setIsIncludedItemModalOpen] = useState(false)
  const [includedItemFormData, setIncludedItemFormData] = useState({
    description: "",
    details: ""
  })
  const [isSubmittingIncludedItem, setIsSubmittingIncludedItem] = useState(false)

  // Load cover pages from API
  const loadCoverPages = async () => {
    try {
      setLoadingCoverPages(true)
      console.log('[BudgetSettingsPage] Loading cover pages...')
      const coverPagesData = await listCoverPages()
      console.log('[BudgetSettingsPage] Loaded cover pages:', coverPagesData)
      setCoverPages(coverPagesData)
    } catch (err) {
      console.error('[BudgetSettingsPage] Error loading cover pages:', err)
    } finally {
      setLoadingCoverPages(false)
    }
  }

  // Load available cover pages for modal selection
  const loadAvailableCoverPages = async () => {
    try {
      setLoadingAvailableCoverPages(true)
      console.log('[BudgetSettingsPage] Loading available cover pages for selection...')
      const availablePages = await listCoverPages({ isActive: true })
      console.log('[BudgetSettingsPage] Loaded available cover pages:', availablePages)
      setAvailableCoverPages(availablePages)
    } catch (err) {
      console.error('[BudgetSettingsPage] Error loading available cover pages:', err)
    } finally {
      setLoadingAvailableCoverPages(false)
    }
  }

  // Load cover pages on component mount
  useEffect(() => {
    loadCoverPages()
  }, [])

  // Load company data on component mount
  useEffect(() => {
    loadCompanyData()
    loadGlobalEmail()
    loadBankData()
    loadPaymentConditions()
    loadSystemDescriptions()
    loadCertificates()
    loadEquipment()
    loadIncludedItems()
  }, [])

  // Load available cover pages when modal opens
  useEffect(() => {
    if (isCreateCoverPageModalOpen) {
      loadAvailableCoverPages()
    }
  }, [isCreateCoverPageModalOpen])

  const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleGlobalEmailChange = (field: keyof GlobalEmail, value: string) => {
    setGlobalEmail(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentConditionChange = (field: keyof PaymentCondition, value: string) => {
    setPaymentCondition(prev => ({ ...prev, [field]: value }))
  }

  const handleBankDataChange = (field: keyof BankData, value: string) => {
    setBankData(prev => ({ ...prev, [field]: value }))
  }

  const handleSystemDescriptionChange = (field: keyof SystemDescription, value: string) => {
    setSystemDescription(prev => ({ ...prev, [field]: value }))
  }

  // Funções da API de dados da empresa
  const loadCompanyData = async () => {
    try {
      console.log('[BudgetSettingsPage] Loading company data...')
      const response = await getCompanyData()
      console.log('[BudgetSettingsPage] Loaded company data:', response)
      
      setCompanyInfo({
        id: response.id,
        companyName: response.companyName || "",
        tradeName: response.tradeName || "",
        phone1: response.phone1 || "",
        phone2: response.phone2 || "",
        cnpj: response.cnpj || "",
        address: response.address || "",
        municipalRegistration: response.municipalRegistration || "",
        email2: response.email2 || "",
        stateRegistration: response.stateRegistration || "",
        zipCode: response.zipCode || "",
        city: response.city || "",
        state: response.state || ""
      })
    } catch (error) {
      console.error('[BudgetSettingsPage] Error loading company data:', error)
      // Keep empty state if no data exists yet
    }
  }

  // Funções da API de email global
  const loadGlobalEmail = async () => {
    try {
      console.log('[BudgetSettingsPage] Loading global email...')
      const response = await getGlobalEmail()
      console.log('[BudgetSettingsPage] Loaded global email:', response)
      
      setGlobalEmail({
        id: response.id,
        email: response.email || "",
        description: response.description || ""
      })
    } catch (error) {
      console.error('[BudgetSettingsPage] Error loading global email:', error)
      // Keep empty state if no data exists yet
    }
  }

  // Funções da API de dados bancários globais
  const loadBankData = async () => {
    try {
      console.log('[BudgetSettingsPage] Loading bank data...')
      const response = await getBankData()
      console.log('[BudgetSettingsPage] Loaded bank data:', response)
      
      setBankData({
        id: response.id,
        bank1Name: response.bank1Name || "",
        bank1Agency: response.bank1Agency || "",
        bank1Account: response.bank1Account || "",
        bank1Beneficiary: response.bank1Beneficiary || "",
        bank2Name: response.bank2Name || "",
        bank2Agency: response.bank2Agency || "",
        bank2Account: response.bank2Account || "",
        bank2Beneficiary: response.bank2Beneficiary || "",
        pixKey: response.pixKey || "",
        pixType: response.pixType || ""
      })
    } catch (error) {
      console.error('[BudgetSettingsPage] Error loading bank data:', error)
      // Keep empty state if no data exists yet
    }
  }

  // Funções da API de condições de pagamento
  const loadPaymentConditions = async () => {
    try {
      console.log('[BudgetSettingsPage] Loading payment conditions...')
      const response = await listPaymentConditions()
      console.log('[BudgetSettingsPage] Loaded payment conditions:', response)
      
      // Como só permitimos uma condição de pagamento, pegamos a primeira
      if (response && response.length > 0) {
        const condition = response[0]
        setPaymentCondition({
          id: condition.id,
          name: condition.name || "",
          description: condition.description || "",
          terms: condition.terms || ""
        })
      }
    } catch (error) {
      console.error('[BudgetSettingsPage] Error loading payment conditions:', error)
      // Keep empty state if no data exists yet
    }
  }

  const saveCompanyData = async () => {
    try {
      console.log('[BudgetSettingsPage] Saving company data...')
      
      const payload: CreateCompanyDataPayload = {
        companyName: companyInfo.companyName,
        tradeName: companyInfo.tradeName,
        phone1: companyInfo.phone1,
        phone2: companyInfo.phone2,
        cnpj: companyInfo.cnpj,
        address: companyInfo.address,
        municipalRegistration: companyInfo.municipalRegistration,
        email2: companyInfo.email2,
        stateRegistration: companyInfo.stateRegistration,
        zipCode: companyInfo.zipCode,
        city: companyInfo.city,
        state: companyInfo.state
      }

      if (companyInfo.id) {
        // Update existing data
        const response = await updateCompanyData(companyInfo.id, payload)
        console.log('[BudgetSettingsPage] Updated company data:', response)
      } else {
        // Create new data
        const response = await createCompanyData(payload)
        console.log('[BudgetSettingsPage] Created company data:', response)
        setCompanyInfo(prev => ({ ...prev, id: response.id }))
      }
      
      setIsEditing(prev => ({ ...prev, company: false }))
      alert('Dados da empresa salvos com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error saving company data:', error)
      alert('Erro ao salvar dados da empresa. Tente novamente.')
    }
  }

  const saveGlobalEmail = async () => {
    try {
      console.log('[BudgetSettingsPage] Saving global email...')
      
      const payload: CreateGlobalEmailPayload = {
        email: globalEmail.email,
        description: globalEmail.description
      }

      if (globalEmail.id) {
        // Update existing email
        const response = await updateGlobalEmail(globalEmail.id, payload)
        console.log('[BudgetSettingsPage] Updated global email:', response)
      } else {
        // Create new email
        const response = await createGlobalEmail(payload)
        console.log('[BudgetSettingsPage] Created global email:', response)
        setGlobalEmail(prev => ({ ...prev, id: response.id }))
      }
      
      setIsEditing(prev => ({ ...prev, email: false }))
      alert('Email principal salvo com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error saving global email:', error)
      alert('Erro ao salvar email principal. Tente novamente.')
    }
  }

  const saveBankData = async () => {
    try {
      console.log('[BudgetSettingsPage] Saving bank data...')
      
      const payload: CreateBankDataPayload = {
        bank1Name: bankData.bank1Name,
        bank1Agency: bankData.bank1Agency,
        bank1Account: bankData.bank1Account,
        bank1Beneficiary: bankData.bank1Beneficiary,
        bank2Name: bankData.bank2Name,
        bank2Agency: bankData.bank2Agency,
        bank2Account: bankData.bank2Account,
        bank2Beneficiary: bankData.bank2Beneficiary,
        pixKey: bankData.pixKey,
        pixType: bankData.pixType
      }

      if (bankData.id) {
        // Update existing data
        const response = await updateBankData(bankData.id, payload)
        console.log('[BudgetSettingsPage] Updated bank data:', response)
      } else {
        // Create new data
        const response = await createBankData(payload)
        console.log('[BudgetSettingsPage] Created bank data:', response)
        setBankData(prev => ({ ...prev, id: response.id }))
      }
      
      setIsEditing(prev => ({ ...prev, banks: false }))
      alert('Dados bancários salvos com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error saving bank data:', error)
      alert('Erro ao salvar dados bancários. Tente novamente.')
    }
  }

  const savePaymentCondition = async () => {
    try {
      console.log('[BudgetSettingsPage] Saving payment condition...')
      
      const payload: CreatePaymentConditionPayload = {
        name: paymentCondition.name,
        description: paymentCondition.description,
        terms: paymentCondition.terms
      }

      if (paymentCondition.id) {
        // Update existing condition
        const response = await updatePaymentCondition(paymentCondition.id, payload)
        console.log('[BudgetSettingsPage] Updated payment condition:', response)
      } else {
        // Create new condition
        const response = await createPaymentCondition(payload)
        console.log('[BudgetSettingsPage] Created payment condition:', response)
        setPaymentCondition(prev => ({ ...prev, id: response.id }))
      }
      
      setIsEditing(prev => ({ ...prev, payments: false }))
      alert('Condição de pagamento salva com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error saving payment condition:', error)
      alert('Erro ao salvar condição de pagamento. Tente novamente.')
    }
  }

  // System description functions
  const loadSystemDescriptions = async () => {
    try {
      console.log('[BudgetSettingsPage] Loading system descriptions...')
      const response = await listSystemDescriptions()
      console.log('[BudgetSettingsPage] Loaded system descriptions:', response)
      
      if (response && response.length > 0) {
        const firstDescription = response[0]
        setSystemDescription({
          id: firstDescription.id,
          title: firstDescription.title || "",
          description: firstDescription.description || "",
          features: firstDescription.features || "",
          benefits: firstDescription.benefits || "",
          photos: firstDescription.photos || []
        })
      }
    } catch (error) {
      console.error('[BudgetSettingsPage] Error loading system descriptions:', error)
    }
  }

  const saveSystemDescription = async () => {
    try {
      console.log('[BudgetSettingsPage] Saving system description...')
      
      const payload: CreateSystemDescriptionPayload = {
        title: systemDescription.title,
        description: systemDescription.description,
        features: systemDescription.features,
        benefits: systemDescription.benefits
      }

      if (systemDescription.id) {
        // Update existing description
        const response = await updateSystemDescription(systemDescription.id, payload)
        console.log('[BudgetSettingsPage] Updated system description:', response)
      } else {
        // Create new description
        const response = await createSystemDescription(payload)
        console.log('[BudgetSettingsPage] Created system description:', response)
        setSystemDescription(prev => ({ ...prev, id: response.id }))
      }
      
      setIsEditing(prev => ({ ...prev, system: false }))
      alert('Descrição do sistema salva com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error saving system description:', error)
      alert('Erro ao salvar descrição do sistema. Tente novamente.')
    }
  }

  const handleSystemPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !systemDescription.id) {
      alert('Selecione um arquivo e salve a descrição do sistema primeiro.')
      return
    }

    try {
  console.log('[BudgetSettingsPage] Uploading system photo...', { systemDescriptionId: systemDescription.id, fileName: file.name, fileSize: file.size, fileType: file.type })
  const formData = new FormData()
  // API expects field name 'photo' for system description images
  formData.append('photo', file)
  formData.append('caption', 'Foto do sistema')

      const response = await uploadSystemPhoto(systemDescription.id, formData)
      console.log('[BudgetSettingsPage] Uploaded system photo:', response)

      // Reload system descriptions to get updated photos
      await loadSystemDescriptions()
      alert('Foto enviada com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error uploading system photo:', error)
      alert('Erro ao enviar foto. Tente novamente.')
    }
  }

  const handleDeleteSystemPhoto = async (photoId: string) => {
    try {
      console.log('[BudgetSettingsPage] Deleting system photo...')
      await deleteSystemPhoto(photoId)
      
      // Reload system descriptions to get updated photos
      await loadSystemDescriptions()
      alert('Foto excluída com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error deleting system photo:', error)
      alert('Erro ao excluir foto. Tente novamente.')
    }
  }

  // Certificate functions
  const loadCertificates = async () => {
    try {
      console.log('[BudgetSettingsPage] Loading certificates...')
      const response = await listCertificates()
      console.log('[BudgetSettingsPage] Loaded certificates:', response)
      
      setCertificates(response.map(cert => ({
        id: cert.id,
        name: cert.name,
        description: cert.description || "",
        issuer: cert.issuer,
        validUntil: cert.validUntil,
        filePath: cert.filePath,
        fileName: cert.fileName,
        fileSize: cert.fileSize
      })))
    } catch (error) {
      console.error('[BudgetSettingsPage] Error loading certificates:', error)
    }
  }

  const handleCertificateUpload = async () => {
    setIsCertificateModalOpen(true)
  }

  const handleCertificateFormSubmit = async () => {
    if (!certificateFormData.file || !certificateFormData.name || !certificateFormData.description || 
        !certificateFormData.issuer || !certificateFormData.validUntil) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsSubmittingCertificate(true)
    
    try {
      const formData = new FormData()
      formData.append('certificate', certificateFormData.file)
      formData.append('name', certificateFormData.name)
      formData.append('description', certificateFormData.description)
      formData.append('issuer', certificateFormData.issuer)
      formData.append('validUntil', certificateFormData.validUntil)

      console.log("Uploading certificate with data:")
      console.log("Name:", certificateFormData.name)
      console.log("Description:", certificateFormData.description)
      console.log("Issuer:", certificateFormData.issuer)
      console.log("Valid Until:", certificateFormData.validUntil)
      console.log("File:", certificateFormData.file.name)
      console.log("FormData contents:")
      for (let [key, value] of formData.entries()) {
        console.log(key, value)
      }

      const result = await uploadCertificate(formData)
      console.log("Upload certificate endpoint response:", result)
      
      loadCertificates()
      
      // Reset form
      setCertificateFormData({
        name: "",
        description: "",
        issuer: "",
        validUntil: "",
        file: null
      })
      setIsCertificateModalOpen(false)
      
      alert("Certificado enviado com sucesso!")
    } catch (error) {
      console.error("Erro ao enviar certificado:", error)
      alert("Erro ao enviar certificado")
    } finally {
      setIsSubmittingCertificate(false)
    }
  }

  const handleDeleteCertificate = async (certificateId: string) => {
    if (!confirm('Tem certeza que deseja excluir este certificado?')) {
      return
    }

    try {
      console.log('[BudgetSettingsPage] Deleting certificate...')
      await deleteCertificate(certificateId)
      
      // Reload certificates
      await loadCertificates()
      alert('Certificado excluído com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error deleting certificate:', error)
      alert('Erro ao excluir certificado. Tente novamente.')
    }
  }

  const updateCertificateField = async (id: string, field: keyof Certificate, value: string) => {
    try {
      console.log('[BudgetSettingsPage] Updating certificate field:', id, field, value)
      
      const payload: any = {}
      payload[field] = value
      
      await updateCertificate(id, payload)
      console.log('[BudgetSettingsPage] Updated certificate field successfully')
      
      // Update local state
      setCertificates(prev =>
        prev.map(cert =>
          cert.id === id ? { ...cert, [field]: value } : cert
        )
      )
    } catch (err) {
      console.error('[BudgetSettingsPage] Error updating certificate field:', err)
      alert('Erro ao atualizar certificado. Tente novamente.')
    }
  }

  // Equipment functions
  const loadEquipment = async () => {
    try {
      console.log('[BudgetSettingsPage] Loading equipment...')
      const response = await listEquipments()
      console.log('[BudgetSettingsPage] Loaded equipment:', response)
      
      setEquipment(response.map(equip => ({
        id: equip.id,
        name: equip.name,
        description: equip.description || "",
        specifications: equip.specifications,
        photos: equip.photos || []
      })))
    } catch (error) {
      console.error('[BudgetSettingsPage] Error loading equipment:', error)
    }
  }

  const handleCreateEquipment = async () => {
    setIsEquipmentModalOpen(true)
  }

  const handleEquipmentFormSubmit = async () => {
    if (!equipmentFormData.name || !equipmentFormData.description) {
      alert("Por favor, preencha pelo menos o nome e a descrição")
      return
    }

    setIsSubmittingEquipment(true)
    
    try {
      console.log('[BudgetSettingsPage] Creating equipment with data:')
      console.log('Name:', equipmentFormData.name)
      console.log('Description:', equipmentFormData.description)
      console.log('Specifications:', equipmentFormData.specifications)

      const payload: CreateEquipmentPayload = {
        name: equipmentFormData.name,
        description: equipmentFormData.description,
        specifications: equipmentFormData.specifications
      }

      const response = await createEquipment(payload)
      console.log('[BudgetSettingsPage] Created equipment:', response)

      // Reload equipment
      await loadEquipment()
      
      // Reset form
      setEquipmentFormData({
        name: "",
        description: "",
        specifications: ""
      })
      setIsEquipmentModalOpen(false)
      
      alert('Equipamento criado com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error creating equipment:', error)
      alert('Erro ao criar equipamento.')
    } finally {
      setIsSubmittingEquipment(false)
    }
  }

  const handleDeleteEquipment = async (equipmentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este equipamento?')) {
      return
    }

    try {
      console.log('[BudgetSettingsPage] Deleting equipment...')
      await deleteEquipment(equipmentId)
      
      // Reload equipment
      await loadEquipment()
      alert('Equipamento excluído com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error deleting equipment:', error)
      alert('Erro ao excluir equipamento. Tente novamente.')
    }
  }

  const updateEquipmentField = async (id: string, field: keyof Equipment, value: string) => {
    try {
      console.log('[BudgetSettingsPage] Updating equipment field:', id, field, value)
      
      const payload: any = {}
      payload[field] = value
      
      await updateEquipment(id, payload)
      console.log('[BudgetSettingsPage] Updated equipment field successfully')
      
      // Update local state
      setEquipment(prev =>
        prev.map(equip =>
          equip.id === id ? { ...equip, [field]: value } : equip
        )
      )
    } catch (err) {
      console.error('[BudgetSettingsPage] Error updating equipment field:', err)
      alert('Erro ao atualizar equipamento. Tente novamente.')
    }
  }

  const handleEquipmentPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>, equipmentId: string) => {
    const file = event.target.files?.[0]
    if (!file) {
      alert('Selecione um arquivo.')
      return
    }

    try {
      console.log('[BudgetSettingsPage] Uploading equipment photo...', { equipmentId, fileName: file.name, fileSize: file.size, fileType: file.type })
      const formData = new FormData()
      formData.append('photo', file)
      formData.append('caption', 'Foto do equipamento')

      const response = await uploadEquipmentPhoto(equipmentId, formData)
      console.log('[BudgetSettingsPage] Uploaded equipment photo:', response)

      // Reload equipment to get updated photos
      await loadEquipment()
      alert('Foto enviada com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error uploading equipment photo:', error)
      alert('Erro ao enviar foto. Tente novamente.')
    }
  }

  const handleDeleteEquipmentPhoto = async (photoId: string) => {
    try {
      console.log('[BudgetSettingsPage] Deleting equipment photo...')
      await deleteEquipmentPhoto(photoId)
      
      // Reload equipment to get updated photos
      await loadEquipment()
      alert('Foto excluída com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error deleting equipment photo:', error)
      alert('Erro ao excluir foto. Tente novamente.')
    }
  }

  // Included items functions
  const loadIncludedItems = async () => {
    try {
      console.log('[BudgetSettingsPage] Loading included items...')
      const response = await listIncludedItems()
      console.log('[BudgetSettingsPage] Loaded included items:', response)
      
      setIncludedItems(response.map(item => ({
        id: item.id,
        description: item.description || "",
        details: item.details || "",
        photos: item.photos || []
      })))
      // Initialize local edit buffer for each included item
      const edits: Record<string, { description: string; details: string }> = {}
      for (const it of response) {
        if (it.id) edits[it.id] = { description: it.description || '', details: it.details || '' }
      }
      setIncludedItemEdits(edits)
    } catch (error) {
      console.error('[BudgetSettingsPage] Error loading included items:', error)
    }
  }

  const handleCreateIncludedItem = async () => {
    setIsIncludedItemModalOpen(true)
  }

  const handleIncludedItemFormSubmit = async () => {
    if (!includedItemFormData.description) {
      alert("Por favor, preencha pelo menos a descrição")
      return
    }

    setIsSubmittingIncludedItem(true)
    
    try {
      console.log('[BudgetSettingsPage] Creating included item with data:')
      console.log('Description:', includedItemFormData.description)
      console.log('Details:', includedItemFormData.details)

      const payload: CreateIncludedItemPayload = {
        description: includedItemFormData.description,
        details: includedItemFormData.details
      }

      const response = await createIncludedItem(payload)
      console.log('[BudgetSettingsPage] Created included item:', response)

      // Reload included items
      await loadIncludedItems()
      
      // Reset form
      setIncludedItemFormData({
        description: "",
        details: ""
      })
      setIsIncludedItemModalOpen(false)
      
      alert('Item incluso criado com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error creating included item:', error)
      alert('Erro ao criar item incluso.')
    } finally {
      setIsSubmittingIncludedItem(false)
    }
  }

  const handleDeleteIncludedItem = async (itemId: string) => {
    if (!confirm('Tem certeza que deseja excluir este item incluso?')) {
      return
    }

    try {
      console.log('[BudgetSettingsPage] Deleting included item...')
      await deleteIncludedItem(itemId)
      
      // Reload included items
      await loadIncludedItems()
      alert('Item incluso excluído com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error deleting included item:', error)
      alert('Erro ao excluir item incluso. Tente novamente.')
    }
  }

  const handleSaveIncludedItem = async (itemId: string) => {
    const edits = includedItemEdits[itemId]
    if (!edits) return
    try {
      setIncludedItemEdits(prev => ({ ...prev, [itemId]: { ...prev[itemId], saving: true } }))
      await updateIncludedItem(itemId, { description: edits.description, details: edits.details })
      // Refresh list
      await loadIncludedItems()
      setIsEditing(prev => ({ ...prev, includedItems: false }))
      alert('Item incluso atualizado com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error saving included item:', error)
      alert('Erro ao salvar item incluso. Tente novamente.')
    } finally {
      setIncludedItemEdits(prev => ({ ...prev, [itemId]: { ...prev[itemId], saving: false } }))
    }
  }

  const updateIncludedItemField = async (id: string, field: keyof IncludedItem, value: string) => {
    try {
      console.log('[BudgetSettingsPage] Updating included item field:', id, field, value)
      
      const payload: any = {}
      payload[field] = value
      
      await updateIncludedItem(id, payload)
      console.log('[BudgetSettingsPage] Updated included item field successfully')
      
      // Update local state
      setIncludedItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      )
    } catch (err) {
      console.error('[BudgetSettingsPage] Error updating included item field:', err)
      alert('Erro ao atualizar item incluso. Tente novamente.')
    }
  }

  const handleIncludedItemPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = event.target.files?.[0]
    if (!file) {
      alert('Selecione um arquivo.')
      return
    }

    try {
      console.log('[BudgetSettingsPage] Uploading included item photo...', { itemId, fileName: file.name, fileSize: file.size, fileType: file.type })
      const formData = new FormData()
      formData.append('photo', file)
      formData.append('caption', 'Foto do item incluso')

      // Log FormData entries for debugging (key and value). Files will appear as File objects.
      for (const [key, value] of Array.from(formData.entries())) {
        console.log('[BudgetSettingsPage] IncludedItem FormData entry:', key, value)
      }

      const response = await uploadIncludedItemPhoto(itemId, formData)
      console.log('[BudgetSettingsPage] Uploaded included item photo:', response)

      // Reload included items to get updated photos
      await loadIncludedItems()
      alert('Foto enviada com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error uploading included item photo:', error)
      alert('Erro ao enviar foto. Tente novamente.')
    }
  }

  const handleDeleteIncludedItemPhoto = async (photoId: string) => {
    try {
      console.log('[BudgetSettingsPage] Deleting included item photo...')
      await deleteIncludedItemPhoto(photoId)
      
      // Reload included items to get updated photos
      await loadIncludedItems()
      alert('Foto excluída com sucesso!')
    } catch (error) {
      console.error('[BudgetSettingsPage] Error deleting included item photo:', error)
      alert('Erro ao excluir foto. Tente novamente.')
    }
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
    // Reset form data
    setNewCoverPageData({
      name: "",
      description: "",
      type: "COVER",
      isDefault: false,
      isActive: true,
  file: null
    })
    setIsCreateCoverPageModalOpen(true)
  }

  const handleCreateCoverPage = async () => {
    if (!newCoverPageData.name.trim()) {
      alert('Por favor, insira um nome para a cover page')
      return
    }

    try {
      setIsSubmittingCoverPage(true)
      console.log('[BudgetSettingsPage] Creating new cover page...', newCoverPageData)
      
      // Create FormData for multipart upload
      const formData = new FormData()
      formData.append('name', newCoverPageData.name)
      formData.append('description', newCoverPageData.description || '')
      formData.append('type', newCoverPageData.type)
      formData.append('isDefault', String(newCoverPageData.isDefault))
      formData.append('isActive', String(newCoverPageData.isActive))
      
      // Add file if selected
      if (newCoverPageData.file) {
        formData.append('file', newCoverPageData.file)
      }
      
      const newCoverPage = await createCoverPage(formData)
      console.log('[BudgetSettingsPage] Created cover page:', newCoverPage)
      
      // Refresh the list
      await loadCoverPages()
      setIsEditing(prev => ({ ...prev, coverPages: true }))
      
      // Close modal and reset form
      setIsCreateCoverPageModalOpen(false)
      setNewCoverPageData({
        name: "",
        description: "",
        type: "COVER",
        isDefault: false,
        isActive: true,
  file: null
      })
    } catch (err) {
      console.error('[BudgetSettingsPage] Error creating cover page:', err)
      alert('Erro ao criar cover page. Tente novamente.')
    } finally {
      setIsSubmittingCoverPage(false)
    }
  }

  const updateCoverPageField = async (id: string, field: keyof CoverPage, value: string | boolean) => {
    try {
      console.log('[BudgetSettingsPage] Updating cover page field:', id, field, value)
      
      // Create payload based on field
      const payload: any = {}
      payload[field] = value
      
      await updateCoverPage(id, payload)
      console.log('[BudgetSettingsPage] Updated cover page field successfully')
      
      // Update local state
      setCoverPages(prev =>
        prev.map(page =>
          page.id === id ? { ...page, [field]: value } : page
        )
      )
    } catch (err) {
      console.error('[BudgetSettingsPage] Error updating cover page field:', err)
    }
  }

  const removeCoverPage = async (id: string) => {
    try {
      console.log('[BudgetSettingsPage] Deleting cover page:', id)
      await deleteCoverPage(id)
      console.log('[BudgetSettingsPage] Deleted cover page successfully')
      
      // Update local state
      setCoverPages(prev => prev.filter(page => page.id !== id))
    } catch (err) {
      console.error('[BudgetSettingsPage] Error deleting cover page:', err)
    }
  }

  const setAsDefaultCoverPage = async (id: string) => {
    try {
      console.log('[BudgetSettingsPage] Setting cover page as default:', id)
      
      // First, set all cover pages as non-default
      const updatePromises = coverPages.map(page => {
        if (page.isDefault) {
          return updateCoverPage(page.id, { isDefault: false })
        }
        return Promise.resolve()
      })
      
      await Promise.all(updatePromises)
      
      // Then set the selected one as default
      await updateCoverPage(id, { isDefault: true })
      
      console.log('[BudgetSettingsPage] Set cover page as default successfully')
      
      // Update local state
      setCoverPages(prev =>
        prev.map(page => ({
          ...page,
          isDefault: page.id === id
        }))
      )
    } catch (err) {
      console.error('[BudgetSettingsPage] Error setting cover page as default:', err)
    }
  }

  const uploadCoverPageFile = async (coverPageId: string, file: File) => {
    try {
      console.log('[BudgetSettingsPage] Uploading file for cover page:', coverPageId, file.name)
      
      const formData = new FormData()
      formData.append('file', file)
      
      await uploadCoverFile(coverPageId, formData)
      console.log('[BudgetSettingsPage] File uploaded successfully')
      
      // Refresh the list to get updated file info
      await loadCoverPages()
    } catch (err) {
      console.error('[BudgetSettingsPage] Error uploading file:', err)
    }
  }

  const updateGlobalSetting = (field: keyof GlobalSettings, value: string | number | boolean) => {
    setGlobalSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log('Salvando configurações...', {
      companyInfo,
      bankData,
      paymentCondition,
      systemDescription,
      certificates,
      equipment,
      includedItems,
      standardTexts,
      coverPages,
      globalSettings
    })

    setIsEditing({
      company: false,
      email: false,
      banks: false,
      payments: false,
      system: false,
      certificates: false,
      equipment: false,
      includedItems: false,
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
          
        </div>
        <div className="flex items-center gap-2">
          
        </div>
      </div>

      {/* Tabs */}
  <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v)} className="space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className="grid w-full grid-cols-10 min-w-[1200px]">
            <TabsTrigger value="company" className="flex items-center gap-2 text-xs sm:text-sm">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Empresa</span>
            </TabsTrigger>
            
            <TabsTrigger value="accounts" className="flex items-center gap-2 text-xs sm:text-sm">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Contas</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2 text-xs sm:text-sm">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Pagamentos</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2 text-xs sm:text-sm">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Sistema</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2 text-xs sm:text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Certificados</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2 text-xs sm:text-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Equipamentos</span>
            </TabsTrigger>
            <TabsTrigger value="included-items" className="flex items-center gap-2 text-xs sm:text-sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Itens Inclusos</span>
            </TabsTrigger>
            
            <TabsTrigger value="covers" className="flex items-center gap-2 text-xs sm:text-sm">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Cover Pages</span>
            </TabsTrigger>
          </TabsList>
        </div>

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
                    value={companyInfo.companyName}
                    onChange={(e) => handleCompanyInfoChange('companyName', e.target.value)}
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
                  <Label htmlFor="phone1">Telefone Principal</Label>
                  <Input
                    id="phone1"
                    value={companyInfo.phone1}
                    onChange={(e) => handleCompanyInfoChange('phone1', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="phone2">Telefone Secundário</Label>
                  <Input
                    id="phone2"
                    value={companyInfo.phone2}
                    onChange={(e) => handleCompanyInfoChange('phone2', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="email2">E-mail</Label>
                  <Input
                    id="email2"
                    type="email"
                    value={companyInfo.email2}
                    onChange={(e) => handleCompanyInfoChange('email2', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="tradeName">Nome Fantasia</Label>
                  <Input
                    id="tradeName"
                    value={companyInfo.tradeName}
                    onChange={(e) => handleCompanyInfoChange('tradeName', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="municipalRegistration">Inscrição Municipal</Label>
                  <Input
                    id="municipalRegistration"
                    value={companyInfo.municipalRegistration}
                    onChange={(e) => handleCompanyInfoChange('municipalRegistration', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
                <div>
                  <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
                  <Input
                    id="stateRegistration"
                    value={companyInfo.stateRegistration}
                    onChange={(e) => handleCompanyInfoChange('stateRegistration', e.target.value)}
                    disabled={!isEditing.company}
                  />
                </div>
              </div>
              {isEditing.company && (
                <div className="flex justify-end pt-4">
                  <Button onClick={saveCompanyData} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Dados da Empresa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Principal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <CardTitle>Email Principal</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(prev => ({ ...prev, email: !prev.email }))}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditing.email ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
              <CardDescription>
                Email que aparecerá nos orçamentos e comunicações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="globalEmail">E-mail Principal</Label>
                  <Input
                    id="globalEmail"
                    type="email"
                    value={globalEmail.email}
                    onChange={(e) => handleGlobalEmailChange('email', e.target.value)}
                    disabled={!isEditing.email}
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div>
                  <Label htmlFor="emailDescription">Descrição (opcional)</Label>
                  <Input
                    id="emailDescription"
                    value={globalEmail.description}
                    onChange={(e) => handleGlobalEmailChange('description', e.target.value)}
                    disabled={!isEditing.email}
                    placeholder="Ex: E-mail comercial principal"
                  />
                </div>
              </div>
              {isEditing.email && (
                <div className="flex justify-end pt-4">
                  <Button onClick={saveGlobalEmail} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Email Principal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Configurações Globais */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <CardTitle>Configurações Globais</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(prev => ({ ...prev, globalSettings: !prev.globalSettings }))}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditing.globalSettings ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
              <CardDescription>
                Configurações que se aplicam a todos os orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validityDays">Validade Padrão (dias)</Label>
                  <Input
                    id="validityDays"
                    type="number"
                    value={globalSettings.defaultValidityDays}
                    onChange={(e) => updateGlobalSetting('defaultValidityDays', Number(e.target.value))}
                    disabled={!isEditing.globalSettings}
                  />
                </div>
                <div>
                  <Label htmlFor="maxDiscount">Desconto Máximo (%)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    value={globalSettings.maxDiscountPercent}
                    onChange={(e) => updateGlobalSetting('maxDiscountPercent', Number(e.target.value))}
                    disabled={!isEditing.globalSettings}
                  />
                </div>
                <div>
                  <Label htmlFor="autoApproval">Limite Aprovação Automática (R$)</Label>
                  <Input
                    id="autoApproval"
                    type="number"
                    value={globalSettings.autoApprovalLimit}
                    onChange={(e) => updateGlobalSetting('autoApprovalLimit', Number(e.target.value))}
                    disabled={!isEditing.globalSettings}
                  />
                </div>
                <div>
                  <Label htmlFor="requireApproval">Requer Aprovação Acima de (R$)</Label>
                  <Input
                    id="requireApproval"
                    type="number"
                    value={globalSettings.requireApprovalAbove}
                    onChange={(e) => updateGlobalSetting('requireApprovalAbove', Number(e.target.value))}
                    disabled={!isEditing.globalSettings}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Moeda Padrão</Label>
                  <Input
                    id="currency"
                    value={globalSettings.defaultCurrency}
                    onChange={(e) => updateGlobalSetting('defaultCurrency', e.target.value)}
                    disabled={!isEditing.globalSettings}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Taxa de Imposto (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={globalSettings.taxRate}
                    onChange={(e) => updateGlobalSetting('taxRate', Number(e.target.value))}
                    disabled={!isEditing.globalSettings}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="paymentTerms">Condições de Pagamento Padrão</Label>
                  <Textarea
                    id="paymentTerms"
                    value={globalSettings.defaultPaymentTerms}
                    onChange={(e) => updateGlobalSetting('defaultPaymentTerms', e.target.value)}
                    disabled={!isEditing.globalSettings}
                    placeholder="Ex: À vista com 5% de desconto..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          {/* Dados Bancários Globais */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <CardTitle>Dados Bancários</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(prev => ({ ...prev, banks: !prev.banks }))}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditing.banks ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
              <CardDescription>
                Dados bancários que aparecerão nos orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Banco Principal */}
              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-medium text-lg flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Banco Principal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bank1Name">Nome do Banco</Label>
                    <Input
                      id="bank1Name"
                      value={bankData.bank1Name}
                      onChange={(e) => handleBankDataChange('bank1Name', e.target.value)}
                      disabled={!isEditing.banks}
                      placeholder="Ex: Banco do Brasil"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank1Agency">Agência</Label>
                    <Input
                      id="bank1Agency"
                      value={bankData.bank1Agency}
                      onChange={(e) => handleBankDataChange('bank1Agency', e.target.value)}
                      disabled={!isEditing.banks}
                      placeholder="Ex: 1234-5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank1Account">Conta</Label>
                    <Input
                      id="bank1Account"
                      value={bankData.bank1Account}
                      onChange={(e) => handleBankDataChange('bank1Account', e.target.value)}
                      disabled={!isEditing.banks}
                      placeholder="Ex: 12345-6"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank1Beneficiary">Beneficiário</Label>
                    <Input
                      id="bank1Beneficiary"
                      value={bankData.bank1Beneficiary}
                      onChange={(e) => handleBankDataChange('bank1Beneficiary', e.target.value)}
                      disabled={!isEditing.banks}
                      placeholder="Nome do titular da conta"
                    />
                  </div>
                </div>
              </div>

              {/* Banco Secundário (Opcional) */}
              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-medium text-lg flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Banco Secundário (Opcional)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bank2Name">Nome do Banco</Label>
                    <Input
                      id="bank2Name"
                      value={bankData.bank2Name}
                      onChange={(e) => handleBankDataChange('bank2Name', e.target.value)}
                      disabled={!isEditing.banks}
                      placeholder="Ex: Itaú"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank2Agency">Agência</Label>
                    <Input
                      id="bank2Agency"
                      value={bankData.bank2Agency}
                      onChange={(e) => handleBankDataChange('bank2Agency', e.target.value)}
                      disabled={!isEditing.banks}
                      placeholder="Ex: 5678-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank2Account">Conta</Label>
                    <Input
                      id="bank2Account"
                      value={bankData.bank2Account}
                      onChange={(e) => handleBankDataChange('bank2Account', e.target.value)}
                      disabled={!isEditing.banks}
                      placeholder="Ex: 98765-4"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank2Beneficiary">Beneficiário</Label>
                    <Input
                      id="bank2Beneficiary"
                      value={bankData.bank2Beneficiary}
                      onChange={(e) => handleBankDataChange('bank2Beneficiary', e.target.value)}
                      disabled={!isEditing.banks}
                      placeholder="Nome do titular da conta"
                    />
                  </div>
                </div>
              </div>

              {/* PIX */}
              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-medium text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  PIX
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pixType">Tipo da Chave PIX</Label>
                    <Select 
                      value={bankData.pixType} 
                      onValueChange={(value) => handleBankDataChange('pixType', value)}
                      disabled={!isEditing.banks}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CPF">CPF</SelectItem>
                        <SelectItem value="CNPJ">CNPJ</SelectItem>
                        <SelectItem value="EMAIL">E-mail</SelectItem>
                        <SelectItem value="TELEFONE">Telefone</SelectItem>
                        <SelectItem value="ALEATORIA">Chave Aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pixKey">Chave PIX</Label>
                    <Input
                      id="pixKey"
                      value={bankData.pixKey}
                      onChange={(e) => handleBankDataChange('pixKey', e.target.value)}
                      disabled={!isEditing.banks}
                      placeholder="Digite a chave PIX"
                    />
                  </div>
                </div>
              </div>

              {isEditing.banks && (
                <div className="flex justify-end pt-4">
                  <Button onClick={saveBankData} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Dados Bancários
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Condição de Pagamento</h2>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="payment-name" className="text-sm font-medium">
                    Nome
                  </label>
                  <Input
                    id="payment-name"
                    placeholder="Ex: 30 dias"
                    value={paymentCondition.name}
                    onChange={(e) => setPaymentCondition(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing.payments}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="payment-description" className="text-sm font-medium">
                    Descrição
                  </label>
                  <Textarea
                    id="payment-description"
                    placeholder="Descrição da condição de pagamento"
                    value={paymentCondition.description}
                    onChange={(e) => setPaymentCondition(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!isEditing.payments}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="payment-terms" className="text-sm font-medium">
                    Condições
                  </label>
                  <Textarea
                    id="payment-terms"
                    placeholder="Termos e condições detalhados"
                    value={paymentCondition.terms}
                    onChange={(e) => setPaymentCondition(prev => ({ ...prev, terms: e.target.value }))}
                    disabled={!isEditing.payments}
                    rows={4}
                  />
                </div>
                <div className="flex justify-end">
                  {!isEditing.payments ? (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, payments: true }))}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setIsEditing(prev => ({ ...prev, payments: false }))
                          // Reset to original value if needed
                          loadPaymentConditions()
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => savePaymentCondition()}
                        size="sm"
                        disabled={!paymentCondition.name.trim()}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Descrição do Sistema</h2>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="system-title" className="text-sm font-medium">
                    Título
                  </label>
                  <Input
                    id="system-title"
                    placeholder="Ex: Sistema de Treinamentos Work"
                    value={systemDescription.title}
                    onChange={(e) => handleSystemDescriptionChange('title', e.target.value)}
                    disabled={!isEditing.system}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="system-description" className="text-sm font-medium">
                    Descrição
                  </label>
                  <Textarea
                    id="system-description"
                    placeholder="Descrição detalhada do sistema"
                    value={systemDescription.description}
                    onChange={(e) => handleSystemDescriptionChange('description', e.target.value)}
                    disabled={!isEditing.system}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="system-features" className="text-sm font-medium">
                    Características
                  </label>
                  <Textarea
                    id="system-features"
                    placeholder="Principais características e funcionalidades"
                    value={systemDescription.features}
                    onChange={(e) => handleSystemDescriptionChange('features', e.target.value)}
                    disabled={!isEditing.system}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="system-benefits" className="text-sm font-medium">
                    Benefícios
                  </label>
                  <Textarea
                    id="system-benefits"
                    placeholder="Principais benefícios e vantagens"
                    value={systemDescription.benefits}
                    onChange={(e) => handleSystemDescriptionChange('benefits', e.target.value)}
                    disabled={!isEditing.system}
                    rows={3}
                  />
                </div>

                {/* Photos section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Fotos do Sistema</h3>
                    {systemDescription.id && (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSystemPhotoUpload}
                          className="hidden"
                          id="system-photo-upload"
                        />
                        <Button
                          onClick={() => document.getElementById('system-photo-upload')?.click()}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Enviar Foto
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {systemDescription.photos && systemDescription.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {systemDescription.photos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            {photo.filePath ? (
                              <img
                                src={`${BACKEND_URL}/${photo.filePath}`}
                                alt={photo.caption || 'Foto do sistema'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              onClick={() => handleDeleteSystemPhoto(photo.id)}
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          {photo.caption && (
                            <p className="mt-1 text-xs text-gray-600 text-center">
                              {photo.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(!systemDescription.photos || systemDescription.photos.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>Nenhuma foto enviada</p>
                      {!systemDescription.id && (
                        <p className="text-sm mt-1">Salve a descrição do sistema primeiro para enviar fotos</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  {!isEditing.system ? (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, system: true }))}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setIsEditing(prev => ({ ...prev, system: false }))
                          // Reset to original value if needed
                          loadSystemDescriptions()
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => saveSystemDescription()}
                        size="sm"
                        disabled={!systemDescription.title.trim() || !systemDescription.description.trim()}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          {/* Certificados */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Certificados da Empresa</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(prev => ({ ...prev, certificates: !prev.certificates }))}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {isEditing.certificates ? 'Cancelar' : 'Editar'}
                  </Button>
                  <Button
                    onClick={handleCertificateUpload}
                    size="sm"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Novo Certificado
                  </Button>
                </div>
              </div>
              <CardDescription>
                Gerencie os certificados da empresa para incluir nos orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum certificado cadastrado</p>
                    <p className="text-sm">Clique em "Novo Certificado" para adicionar o primeiro</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {certificates.map((certificate) => (
                      <div key={certificate.id} className="border rounded-lg p-4">
                        {isEditing.certificates ? (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Nome</label>
                                <Input
                                  value={certificate.name}
                                  onChange={(e) => updateCertificateField(certificate.id!, 'name', e.target.value)}
                                  disabled={!isEditing.certificates}
                                  placeholder="Nome do certificado"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Descrição</label>
                                <Input
                                  value={certificate.description}
                                  onChange={(e) => updateCertificateField(certificate.id!, 'description', e.target.value)}
                                  disabled={!isEditing.certificates}
                                  placeholder="Descrição"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Emissor</label>
                                <Input
                                  value={certificate.issuer || ''}
                                  onChange={(e) => updateCertificateField(certificate.id!, 'issuer', e.target.value)}
                                  disabled={!isEditing.certificates}
                                  placeholder="Emissor (opcional)"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Válido até</label>
                                <Input
                                  type="date"
                                  value={certificate.validUntil || ''}
                                  onChange={(e) => updateCertificateField(certificate.id!, 'validUntil', e.target.value)}
                                  disabled={!isEditing.certificates}
                                />
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {certificate.filePath && (
                                  <a
                                    href={`${BACKEND_URL}/${(certificate.filePath || '').replace(/^\/+/, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                  >
                                    <FileText className="h-4 w-4" />
                                    {certificate.fileName}
                                    {certificate.fileSize && (
                                      <span className="text-gray-500">
                                        ({(certificate.fileSize / 1024 / 1024).toFixed(2)} MB)
                                      </span>
                                    )}
                                  </a>
                                )}
                              </div>

                              {isEditing.certificates && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteCertificate(certificate.id!)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Excluir
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Simple listing: name + linked filename
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-medium">{certificate.name}</span>
                              {certificate.filePath ? (
                                <a
                                  href={`${BACKEND_URL}/${(certificate.filePath || '').replace(/^\/+/, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  {certificate.fileName}
                                </a>
                              ) : (
                                <span className="text-sm text-gray-500">Sem arquivo</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          {/* Equipamentos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <CardTitle>Equipamentos</CardTitle>
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
                    onClick={handleCreateEquipment}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Novo Equipamento
                  </Button>
                </div>
              </div>
              <CardDescription>
                Gerencie os equipamentos da empresa para incluir nos orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.length === 0 ? (
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum equipamento cadastrado</p>
                    <Button onClick={handleCreateEquipment} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Primeiro Equipamento
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {equipment.map((equip) => (
                      <div key={equip.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-lg">{equip.name}</h4>
                          {isEditing.equipment && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEquipment(equip.id!)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`equip-name-${equip.id}`}>Nome</Label>
                            <Input
                              id={`equip-name-${equip.id}`}
                              value={equip.name}
                              onChange={(e) => updateEquipmentField(equip.id!, 'name', e.target.value)}
                              disabled={!isEditing.equipment}
                              placeholder="Nome do equipamento"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`equip-description-${equip.id}`}>Descrição</Label>
                            <Input
                              id={`equip-description-${equip.id}`}
                              value={equip.description || ""}
                              onChange={(e) => updateEquipmentField(equip.id!, 'description', e.target.value)}
                              disabled={!isEditing.equipment}
                              placeholder="Descrição do equipamento"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`equip-specifications-${equip.id}`}>Especificações</Label>
                            <Textarea
                              id={`equip-specifications-${equip.id}`}
                              value={equip.specifications || ""}
                              onChange={(e) => updateEquipmentField(equip.id!, 'specifications', e.target.value)}
                              disabled={!isEditing.equipment}
                              placeholder="Especificações técnicas do equipamento..."
                              rows={3}
                            />
                          </div>
                        </div>

                        {/* Photos section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Fotos do Equipamento</Label>
                            <div>
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => handleEquipmentPhotoUpload(e, equip.id!)}
                                style={{ display: 'none' }}
                                id={`equipment-photo-upload-${equip.id}`}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`equipment-photo-upload-${equip.id}`)?.click()}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Upload Foto
                              </Button>
                            </div>
                          </div>
                          
                          {equip.photos && equip.photos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {equip.photos.map((photo) => (
                                <div key={photo.id} className="relative group">
                                  <img
                                    src={`${BACKEND_URL}/${(photo.filePath || '').replace(/^\/+/, '')}`}
                                    alt={photo.caption || equip.name}
                                    className="w-full h-32 object-cover rounded-md border"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteEquipmentPhoto(photo.id)}
                                      className="text-white hover:text-red-400"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {photo.caption && (
                                    <p className="text-xs text-gray-600 mt-1 truncate">{photo.caption}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="included-items" className="space-y-6">
          {/* Itens Inclusos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  <CardTitle>Itens Inclusos</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(prev => ({ ...prev, includedItems: !prev.includedItems }))}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {isEditing.includedItems ? 'Cancelar' : 'Editar'}
                  </Button>
                  <Button
                    onClick={handleCreateIncludedItem}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Novo Item
                  </Button>
                </div>
              </div>
              <CardDescription>
                Gerencie os itens inclusos da empresa para incluir nos orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {includedItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum item incluso cadastrado</p>
                    <p className="text-sm">Clique em "Novo Item" para adicionar o primeiro</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {includedItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">Item Incluso #{item.id}</h3>
                          {isEditing.includedItems && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteIncludedItem(item.id!)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`item-description-${item.id}`}>Descrição</Label>
                            <Input
                              id={`item-description-${item.id}`}
                              value={includedItemEdits[item.id || '']?.description ?? item.description}
                              onChange={(e) => setIncludedItemEdits(prev => ({ ...prev, [item.id!]: { ...(prev[item.id!] || { description: item.description, details: item.details }), description: e.target.value } }))}
                              disabled={!isEditing.includedItems}
                              placeholder="Descrição do item"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`item-details-${item.id}`}>Detalhes</Label>
                            <Textarea
                              id={`item-details-${item.id}`}
                              value={includedItemEdits[item.id || '']?.details ?? item.details || ""}
                              onChange={(e) => setIncludedItemEdits(prev => ({ ...prev, [item.id!]: { ...(prev[item.id!] || { description: item.description, details: item.details }), details: e.target.value } }))}
                              disabled={!isEditing.includedItems}
                              placeholder="Detalhes adicionais..."
                              rows={3}
                            />
                          </div>
                        </div>

                        {/* Photos section */}
                        <div className="space-y-2 mt-4">
                          <div className="flex items-center justify-between">
                            <Label>Fotos do Item</Label>
                            <div>
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => handleIncludedItemPhotoUpload(e, item.id!)}
                                style={{ display: 'none' }}
                                id={`included-item-photo-upload-${item.id}`}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`included-item-photo-upload-${item.id}`)?.click()}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Upload Foto
                              </Button>
                            </div>
                          </div>
                          
                          {item.photos && item.photos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {item.photos.map((photo) => (
                                <div key={photo.id} className="relative group">
                                  <img
                                    src={`${BACKEND_URL}/${(photo.filePath || '').replace(/^\/+/, '')}`}
                                    alt={photo.caption || item.description}
                                    className="w-full h-32 object-cover rounded-md border"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteIncludedItemPhoto(photo.id)}
                                      className="text-white hover:text-red-400"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {photo.caption && (
                                    <p className="text-xs text-gray-600 mt-1 truncate">{photo.caption}</p>
                                  )}
                                </div>
                                ))}
                            </div>
                          )}
                        </div>

                        {isEditing.includedItems && (
                          <div className="flex justify-end mt-4 space-x-2">
                            <Button onClick={() => handleSaveIncludedItem(item.id!)} size="sm" disabled={includedItemEdits[item.id || '']?.saving}>
                              {includedItemEdits[item.id || '']?.saving ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                              setIncludedItemEdits(prev => ({ ...prev, [item.id!]: { description: item.description, details: item.details } }))
                              setIsEditing(prev => ({ ...prev, includedItems: false }))
                            }}>
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="texts" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="covers" className="space-y-6">
          {/* Cover Pages */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  <CardTitle>Cover Pages</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(prev => ({ ...prev, coverPages: !prev.coverPages }))}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {isEditing.coverPages ? 'Cancelar' : 'Editar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCoverPage}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Cover Page
                  </Button>
                </div>
              </div>
              <CardDescription>
                Páginas de rosto personalizadas para orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingCoverPages ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Carregando cover pages...</p>
                </div>
              ) : (
                <>
                  {coverPages.map((page) => (
                    <div key={page.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{page.name || 'Nova Cover Page'}</h4>
                          {page.isDefault && <Badge variant="default">Padrão</Badge>}
                          <Badge variant="outline">{page.type}</Badge>
                          {page.fileName && <Badge variant="secondary">{page.fileName}</Badge>}
                        </div>
                        <div className="flex gap-2">
                          {!page.isDefault && isEditing.coverPages && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAsDefaultCoverPage(page.id)}
                            >
                              Definir como Padrão
                            </Button>
                          )}
                          {isEditing.coverPages && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCoverPage(page.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Nome da Cover Page</Label>
                          <Input
                            value={page.name}
                            onChange={(e) => updateCoverPageField(page.id, 'name', e.target.value)}
                            disabled={!isEditing.coverPages}
                            placeholder="Ex: Padrão, Empresarial..."
                          />
                        </div>
                        <div>
                          <Label>Tipo</Label>
                          <Input
                            value={page.type}
                            disabled={true}
                            placeholder="COVER ou BACK_COVER"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Descrição</Label>
                          <Input
                            value={page.description || ''}
                            onChange={(e) => updateCoverPageField(page.id, 'description', e.target.value)}
                            disabled={!isEditing.coverPages}
                            placeholder="Descrição da cover page"
                          />
                        </div>
                        {page.filePath && (
                          <div className="md:col-span-2">
                            <Label>Arquivo</Label>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <Image className="h-4 w-4" />
                              <span className="text-sm">{page.fileName}</span>
                              {page.fileSize && (
                                <span className="text-xs text-gray-500">
                                  ({(page.fileSize / 1024).toFixed(1)} KB)
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        {isEditing.coverPages && (
                          <div className="md:col-span-2">
                            <Label>Upload de Arquivo</Label>
                            <Input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  uploadCoverPageFile(page.id, file)
                                }
                              }}
                              disabled={!isEditing.coverPages}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {coverPages.length === 0 && !loadingCoverPages && (
                    <div className="text-center py-8">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma cover page encontrada</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para criar cover page */}
      <Dialog open={isCreateCoverPageModalOpen} onOpenChange={setIsCreateCoverPageModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Cover Page</DialogTitle>
            <DialogDescription>
              Crie uma nova página de rosto personalizada para seus orçamentos
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cover-page-name">Nome *</Label>
              <Input
                id="cover-page-name"
                placeholder="Ex: Capa Corporativa"
                value={newCoverPageData.name}
                onChange={(e) => setNewCoverPageData(prev => ({ ...prev, name: e.target.value }))}
                disabled={isSubmittingCoverPage}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cover-page-description">Descrição</Label>
              <Textarea
                id="cover-page-description"
                placeholder="Descrição opcional da cover page"
                value={newCoverPageData.description}
                onChange={(e) => setNewCoverPageData(prev => ({ ...prev, description: e.target.value }))}
                disabled={isSubmittingCoverPage}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cover-page-type">Tipo</Label>
              <Select
                value={newCoverPageData.type}
                onValueChange={(value: "COVER" | "BACK_COVER") => 
                  setNewCoverPageData(prev => ({ ...prev, type: value }))
                }
                disabled={isSubmittingCoverPage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COVER">Capa</SelectItem>
                  <SelectItem value="BACK_COVER">Contra-capa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            
            <div className="grid gap-2">
              <Label htmlFor="cover-page-file">Arquivo (opcional)</Label>
              <Input
                id="cover-page-file"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setNewCoverPageData(prev => ({ ...prev, file }))
                }}
                disabled={isSubmittingCoverPage}
              />
              {newCoverPageData.file && (
                <p className="text-sm text-gray-600">
                  Arquivo selecionado: {newCoverPageData.file.name}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="cover-page-default"
                checked={newCoverPageData.isDefault}
                onChange={(e) => setNewCoverPageData(prev => ({ ...prev, isDefault: e.target.checked }))}
                disabled={isSubmittingCoverPage}
                className="rounded border-gray-300"
              />
              <Label htmlFor="cover-page-default" className="text-sm">
                Definir como padrão
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="cover-page-active"
                checked={newCoverPageData.isActive}
                onChange={(e) => setNewCoverPageData(prev => ({ ...prev, isActive: e.target.checked }))}
                disabled={isSubmittingCoverPage}
                className="rounded border-gray-300"
              />
              <Label htmlFor="cover-page-active" className="text-sm">
                Ativo
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateCoverPageModalOpen(false)}
              disabled={isSubmittingCoverPage}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCoverPage}
              disabled={isSubmittingCoverPage || !newCoverPageData.name.trim()}
            >
              {isSubmittingCoverPage ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Cover Page
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Upload Modal */}
      <Dialog open={isCertificateModalOpen} onOpenChange={setIsCertificateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Certificado</DialogTitle>
            <DialogDescription>
              Faça upload de um certificado da empresa para incluir nos orçamentos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="certificate-file">Arquivo do Certificado</Label>
              <Input
                id="certificate-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setCertificateFormData(prev => ({ ...prev, file }))
                }}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="certificate-name">Nome do Certificado</Label>
              <Input
                id="certificate-name"
                value={certificateFormData.name}
                onChange={(e) => setCertificateFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Certificado ISO 9001"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="certificate-description">Descrição</Label>
              <Textarea
                id="certificate-description"
                value={certificateFormData.description}
                onChange={(e) => setCertificateFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do certificado..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="certificate-issuer">Emissor</Label>
              <Input
                id="certificate-issuer"
                value={certificateFormData.issuer}
                onChange={(e) => setCertificateFormData(prev => ({ ...prev, issuer: e.target.value }))}
                placeholder="Ex: ISO, ABNT, etc."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="certificate-valid-until">Válido até</Label>
              <Input
                id="certificate-valid-until"
                type="date"
                value={certificateFormData.validUntil}
                onChange={(e) => setCertificateFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCertificateModalOpen(false)}
              disabled={isSubmittingCertificate}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCertificateFormSubmit}
              disabled={isSubmittingCertificate}
            >
              {isSubmittingCertificate ? "Enviando..." : "Adicionar Certificado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Equipment Creation Modal */}
      <Dialog open={isEquipmentModalOpen} onOpenChange={setIsEquipmentModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Equipamento</DialogTitle>
            <DialogDescription>
              Cadastre um novo equipamento da empresa para incluir nos orçamentos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="equipment-name">Nome do Equipamento</Label>
              <Input
                id="equipment-name"
                value={equipmentFormData.name}
                onChange={(e) => setEquipmentFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Retroescavadeira Caterpillar 416E"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="equipment-description">Descrição</Label>
              <Textarea
                id="equipment-description"
                value={equipmentFormData.description}
                onChange={(e) => setEquipmentFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição detalhada do equipamento..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="equipment-specifications">Especificações Técnicas</Label>
              <Textarea
                id="equipment-specifications"
                value={equipmentFormData.specifications}
                onChange={(e) => setEquipmentFormData(prev => ({ ...prev, specifications: e.target.value }))}
                placeholder="Especificações técnicas, modelo, capacidade, etc..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEquipmentModalOpen(false)}
              disabled={isSubmittingEquipment}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEquipmentFormSubmit}
              disabled={isSubmittingEquipment || !equipmentFormData.name || !equipmentFormData.description}
            >
              {isSubmittingEquipment ? "Criando..." : "Adicionar Equipamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para adicionar novo item incluso */}
      <Dialog open={isIncludedItemModalOpen} onOpenChange={setIsIncludedItemModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Item Incluso</DialogTitle>
            <DialogDescription>
              Adicione um novo item incluso que poderá ser usado nos orçamentos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="includeditem-description">Descrição *</Label>
              <Input
                id="includeditem-description"
                value={includedItemFormData.description}
                onChange={(e) => setIncludedItemFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Digite a descrição do item"
                required
              />
            </div>
            <div>
              <Label htmlFor="includeditem-details">Detalhes</Label>
              <Textarea
                id="includeditem-details"
                value={includedItemFormData.details}
                onChange={(e) => setIncludedItemFormData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="Detalhes adicionais sobre o item..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIncludedItemModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleIncludedItemFormSubmit}
              disabled={isSubmittingIncludedItem || !includedItemFormData.description.trim()}
            >
              {isSubmittingIncludedItem ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
