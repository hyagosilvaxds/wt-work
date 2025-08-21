// ⚠️ DESCONTINUADO - NÃO USE ESTE ARQUIVO ⚠️
// Este arquivo contém o modelo antigo de geração de certificados.
// Agora todos os certificados devem ser gerados através da API usando as funções em /lib/api/superadmin.ts:
// - generateCertificatePDF() - para certificados individuais
// - generateBatchCertificates() - para certificados em lote
// - downloadCertificatePDF() - para download direto
// 
// As funções abaixo são mantidas apenas para compatibilidade com código legado
// mas não devem ser usadas em novas implementações.

import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { getSignatureByInstructorId } from './api/superadmin'

// Constante para a URL base da API
const API_BASE_URL = 'worktreinamentos.olimpustech.com'

// Função utilitária para construir URLs de imagens
const buildImageUrl = (imagePath: string) => {
  if (!imagePath) return ''
  return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`
}

export interface CertificateData {
  studentName: string
  trainingName: string
  instructorName: string
  issueDate: string
  validationCode: string
  workload: string
  company?: string
  location?: string
  startDate?: string
  endDate?: string
  instructorSignature?: string
}

// Função para buscar assinatura do instrutor e incluir nos dados do certificado
export const enrichCertificateWithSignature = async (
  data: CertificateData, 
  instructorId?: string
): Promise<CertificateData> => {
  // Se já tem assinatura ou não tem instructorId, retorna os dados como estão
  if (data.instructorSignature || !instructorId) {
    return data
  }

  try {
    const signature = await getSignatureByInstructorId(instructorId)
    return {
      ...data,
      instructorSignature: signature?.pngPath || undefined
    }
  } catch (error) {
    console.error('Erro ao buscar assinatura do instrutor:', error)
    return data
  }
}

export const CertificateTemplate = ({ data }: { data: CertificateData }) => {
  return (
    <div 
      id="certificate-template"
      className="bg-white p-16 font-serif relative overflow-hidden"
      style={{
        width: '1123px',
        height: '794px',
        backgroundImage: 'url("/fundo-certificado.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: '8px solid #78BA00',
        boxShadow: '0 0 30px rgba(0,0,0,0.1)'
      }}
    >
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-4 mt-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-1">
            CERTIFICADO
          </h1>
          <div className="w-32 h-1 bg-primary-600 mx-auto mt-3 mb-1"></div>
          <p className="text-xl text-gray-600">
            DE CONCLUSÃO DE CURSO
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center text-center px-8">
          <p className="text-2xl text-gray-700 mb-4 leading-relaxed">
            Certificamos que
          </p>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4 px-8">
            {data.studentName}
          </h2>
          
          <p className="text-2xl text-gray-700 mb-4 leading-relaxed">
            concluiu com êxito o curso de
          </p>
          
          <h3 className="text-3xl font-bold text-primary-600 mb-4 px-4">
            {data.trainingName}
          </h3>
          
          <div className="text-lg text-gray-600 mb-4 space-y-1">
            <p>
              <strong>Carga horária:</strong> {data.workload}
            </p>
            {data.company && (
              <p>
                <strong>Empresa:</strong> {data.company}
              </p>
            )}
            {data.startDate && data.endDate && (
              <p>
                <strong>Período:</strong> {data.startDate} a {data.endDate}
                {data.location && (
                  <span> • <strong>Local:</strong> {data.location}</span>
                )}
              </p>
            )}
            {data.location && !data.startDate && !data.endDate && (
              <p>
                <strong>Local:</strong> {data.location}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4">
          <div className="flex justify-between items-end mb-4">
            <div className="flex-1 text-center mx-8">
              <div className="border-t-2 border-gray-400 pt-2 mt-4">
                {data.instructorSignature && (
                  <div className="mb-2">
                    <img 
                      src={buildImageUrl(data.instructorSignature)} 
                      alt={`Assinatura de ${data.instructorName}`}
                      className="max-w-40 max-h-12 object-scale-down mx-auto"
                    />
                  </div>
                )}
                <p className="text-lg font-semibold text-gray-700 mb-1">
                  {data.instructorName}
                </p>
                <p className="text-sm text-gray-600">Instrutor Responsável</p>
              </div>
            </div>
            
            <div className="flex-1 text-center mx-8">
              <div className="border-t-2 border-gray-400 pt-2 mt-4">
                <p className="text-lg font-semibold text-gray-700">WT Work Treinamentos</p>
                <p className="text-sm text-gray-600">Direção</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const generateCertificatePDF = async (data: CertificateData): Promise<void> => {
  try {
    // Verificar se já existe um elemento do template na página
    let templateElement = document.getElementById('certificate-template')
    let shouldCleanup = false
    
    if (!templateElement) {
      // Criar elemento temporário usando HTML com estilos inline para garantir renderização
      const container = document.createElement('div')
      container.innerHTML = `
        <div id="certificate-template" style="
          width: 1123px;
          height: 794px;
          background-image: url('/fundo-certificado.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border: 8px solid #78BA00;
          box-shadow: 0 0 30px rgba(0,0,0,0.1);
          background-color: white;
          padding: 64px;
          font-family: serif;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        ">
          <div style="position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 16px; margin-top: 0px;">
              <h1 style="font-size: 72px; font-weight: bold; color: #1f2937; margin-bottom: 4px; margin-top: 0px; line-height: 1;">
                CERTIFICADO
              </h1>
              <div style="width: 128px; height: 4px; margin: 8px auto; margin-top: 10px;"></div>
              <p style="font-size: 20px; color: #4b5563; margin: 0;">
                DE CONCLUSÃO DE CURSO
              </p>
            </div>
            
            <!-- Content -->
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 0 32px;">
              <p style="font-size: 24px; color: #374151; margin-bottom: 16px; line-height: 1.5;">
                Certificamos que
              </p>
              
              <h2 style="font-size: 48px; font-weight: bold; color: #1f2937; margin-bottom: 16px; padding: 0 32px;">
                ${data.studentName}
              </h2>
              
              <p style="font-size: 24px; color: #374151; margin-bottom: 16px; line-height: 1.5;">
                concluiu com êxito o curso de
              </p>
              
              <h3 style="font-size: 36px; font-weight: bold; color: #78BA00; margin-bottom: 16px; padding: 0 16px;">
                ${data.trainingName}
              </h3>
              
              <div style="font-size: 18px; color: #4b5563; margin-bottom: 16px;">
                <p style="margin: 4px 0;">
                  <strong>Carga horária:</strong> ${data.workload}
                </p>
                ${data.company ? `
                  <p style="margin: 4px 0;">
                    <strong>Empresa:</strong> ${data.company}
                  </p>
                ` : ''}
                ${data.startDate && data.endDate ? `
                  <p style="margin: 4px 0;">
                    <strong>Período:</strong> ${data.startDate} a ${data.endDate}
                    ${data.location ? ` • <strong>Local:</strong> ${data.location}` : ''}
                  </p>
                ` : data.location ? `
                  <p style="margin: 4px 0;">
                    <strong>Local:</strong> ${data.location}
                  </p>
                ` : ''}
              </div>
            </div>

            <!-- Footer -->
            <div style="margin-top: auto; padding-top: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: end; margin-bottom: 16px;">
                <div style="flex: 1; text-align: center; margin: 0 32px;">
                ${data.instructorSignature ? `
                      <div style="margin-bottom: 8px;">
                        <img 
                          src="${buildImageUrl(data.instructorSignature)}" 
                          alt="Assinatura de ${data.instructorName}"
                          style="max-width: 200px; max-height: 48px; object-fit: scale-down; margin: 0 auto; display: block;"
                        />
                      </div>
                    ` : ''}
                  <div style="border-top: 2px solid #9ca3af; padding-top: 8px; margin-top: 16px;">
                    
                    <p style="font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 4px; margin-top: 0;">
                      ${data.instructorName}
                    </p>
                    <p style="font-size: 14px; color: #4b5563; margin: 0;">
                      Instrutor Responsável
                    </p>
                  </div>
                </div>
                
                <div style="flex: 1; text-align: center; margin: 0 32px;">
                  <div style="border-top: 2px solid #9ca3af; padding-top: 8px; margin-top: 16px;">
                    <p style="font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 4px; margin-top: 0;">
                      WT Work Treinamentos
                    </p>
                    <p style="font-size: 14px; color: #4b5563; margin: 0;">
                      Direção
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
      
      container.style.position = 'fixed'
      container.style.top = '-9999px'
      container.style.left = '-9999px'
      container.style.zIndex = '-1000'
      
      document.body.appendChild(container)
      templateElement = container.querySelector('#certificate-template')
      shouldCleanup = true
    }

    if (!templateElement) {
      throw new Error('Não foi possível encontrar o template do certificado')
    }

    // Aguardar um pouco para o elemento ser renderizado
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Capturar o elemento como imagem em alta resolução
    const canvas = await html2canvas(templateElement, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: templateElement.offsetWidth,
      height: templateElement.offsetHeight,
      windowWidth: templateElement.offsetWidth,
      windowHeight: templateElement.offsetHeight
    })

    // Criar PDF em formato landscape A4
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    // Obter dimensões do canvas
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    
    // Dimensões do PDF A4 landscape (297mm x 210mm)
    const pdfWidth = 297
    const pdfHeight = 210

    // Calcular escala para manter proporção
    const scaleX = pdfWidth / canvasWidth
    const scaleY = pdfHeight / canvasHeight
    const scale = Math.min(scaleX, scaleY)

    // Calcular dimensões finais
    const finalWidth = canvasWidth * scale
    const finalHeight = canvasHeight * scale

    // Calcular posição para centralizar
    const x = (pdfWidth - finalWidth) / 2
    const y = (pdfHeight - finalHeight) / 2

    // Adicionar a imagem ao PDF
    const imgData = canvas.toDataURL('image/png', 1.0)
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)

    // Fazer download do PDF
    pdf.save(`certificado-${data.studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`)

    // Limpar o container temporário se foi criado
    if (shouldCleanup) {
      const container = templateElement.parentElement
      if (container && container.parentElement) {
        container.parentElement.removeChild(container)
      }
    }
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    throw error
  }
}

// Função auxiliar para gerar PDF a partir de um elemento existente
const generatePDFFromElement = async (element: HTMLElement, data: CertificateData): Promise<void> => {
  // Aguardar um pouco para garantir que tudo esteja renderizado
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Capturar o elemento como imagem em alta resolução
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: element.offsetWidth,
    height: element.offsetHeight,
    windowWidth: element.offsetWidth,
    windowHeight: element.offsetHeight
  })

  // Criar PDF em formato landscape A4
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Obter dimensões do canvas
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  
  // Dimensões do PDF A4 landscape (297mm x 210mm)
  const pdfWidth = 297
  const pdfHeight = 210

  // Calcular escala para manter proporção
  const scaleX = pdfWidth / canvasWidth
  const scaleY = pdfHeight / canvasHeight
  const scale = Math.min(scaleX, scaleY)

  // Calcular dimensões finais
  const finalWidth = canvasWidth * scale
  const finalHeight = canvasHeight * scale

  // Calcular posição para centralizar
  const x = (pdfWidth - finalWidth) / 2
  const y = (pdfHeight - finalHeight) / 2

  // Adicionar a imagem ao PDF
  const imgData = canvas.toDataURL('image/png', 1.0)
  pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)

  // Fazer download do PDF
  pdf.save(`certificado-${data.studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}

// Função para gerar certificados em lote
export const generateBatchCertificatesPDF = async (
  certificates: CertificateData[], 
  instructorId?: string,
  classTitle?: string
): Promise<void> => {
  try {
    if (certificates.length === 0) {
      throw new Error('Nenhum certificado para gerar')
    }

    // Criar PDF em formato landscape A4
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    // Dimensões do PDF A4 landscape (297mm x 210mm)
    const pdfWidth = 297
    const pdfHeight = 210

    // Processar cada certificado
    for (let i = 0; i < certificates.length; i++) {
      const data = certificates[i]
      
      // Enriquecer com assinatura se necessário
      const enrichedData = await enrichCertificateWithSignature(data, instructorId)
      
      // Criar elemento temporário para este certificado
      const container = document.createElement('div')
      container.innerHTML = `
        <div id="certificate-template-${i}" style="
          width: 1123px;
          height: 794px;
          background-image: url('/fundo-certificado.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border: 8px solid #78BA00;
          box-shadow: 0 0 30px rgba(0,0,0,0.1);
          background-color: white;
          padding: 64px;
          font-family: serif;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        ">
          <div style="position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 16px; margin-top: 0px;">
              <h1 style="font-size: 72px; font-weight: bold; color: #1f2937; margin-bottom: 4px; margin-top: 0px; line-height: 1;">
                CERTIFICADO
              </h1>
              <div style="width: 128px; height: 4px; margin: 8px auto; margin-top: 10px;"></div>
              <p style="font-size: 20px; color: #4b5563; margin: 0;">
                DE CONCLUSÃO DE CURSO
              </p>
            </div>
            
            <!-- Content -->
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 0 32px;">
              <p style="font-size: 24px; color: #374151; margin-bottom: 16px; line-height: 1.5;">
                Certificamos que
              </p>
              
              <h2 style="font-size: 48px; font-weight: bold; color: #1f2937; margin-bottom: 16px; padding: 0 32px;">
                ${enrichedData.studentName}
              </h2>
              
              <p style="font-size: 24px; color: #374151; margin-bottom: 16px; line-height: 1.5;">
                concluiu com êxito o curso de
              </p>
              
              <h3 style="font-size: 36px; font-weight: bold; color: #78BA00; margin-bottom: 16px; padding: 0 16px;">
                ${enrichedData.trainingName}
              </h3>
              
              <div style="font-size: 18px; color: #4b5563; margin-bottom: 16px;">
                <p style="margin: 4px 0;">
                  <strong>Carga horária:</strong> ${enrichedData.workload}
                </p>
                ${enrichedData.company ? `
                  <p style="margin: 4px 0;">
                    <strong>Empresa:</strong> ${enrichedData.company}
                  </p>
                ` : ''}
                ${enrichedData.startDate && enrichedData.endDate ? `
                  <p style="margin: 4px 0;">
                    <strong>Período:</strong> ${enrichedData.startDate} a ${enrichedData.endDate}
                    ${enrichedData.location ? ` • <strong>Local:</strong> ${enrichedData.location}` : ''}
                  </p>
                ` : enrichedData.location ? `
                  <p style="margin: 4px 0;">
                    <strong>Local:</strong> ${enrichedData.location}
                  </p>
                ` : ''}
              </div>
            </div>

            <!-- Footer -->
            <div style="margin-top: auto; padding-top: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: end; margin-bottom: 16px;">
                <div style="flex: 1; text-align: center; margin: 0 32px;">
                  ${enrichedData.instructorSignature ? `
                    <div style="margin-bottom: 8px;">
                      <img 
                        src="${buildImageUrl(enrichedData.instructorSignature)}" 
                        alt="Assinatura de ${enrichedData.instructorName}"
                        style="max-width: 200px; max-height: 48px; object-fit: scale-down; margin: 0 auto; display: block;"
                      />
                    </div>
                  ` : ''}
                  <div style="border-top: 2px solid #9ca3af; padding-top: 8px; margin-top: 16px;">
                    <p style="font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 4px; margin-top: 0;">
                      ${enrichedData.instructorName}
                    </p>
                    <p style="font-size: 14px; color: #4b5563; margin: 0;">
                      Instrutor Responsável
                    </p>
                  </div>
                </div>
                
                <div style="flex: 1; text-align: center; margin: 0 32px;">
                  <div style="border-top: 2px solid #9ca3af; padding-top: 8px; margin-top: 16px;">
                    <p style="font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 4px; margin-top: 0;">
                      WT Work Treinamentos
                    </p>
                    <p style="font-size: 14px; color: #4b5563; margin: 0;">
                      Direção
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
      
      container.style.position = 'fixed'
      container.style.top = '-9999px'
      container.style.left = '-9999px'
      container.style.zIndex = '-1000'
      
      document.body.appendChild(container)
      const templateElement = container.querySelector(`#certificate-template-${i}`) as HTMLElement
      
      if (!templateElement) {
        throw new Error(`Não foi possível encontrar o template do certificado ${i}`)
      }

      // Aguardar um pouco para o elemento ser renderizado
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Capturar o elemento como imagem em alta resolução
      const canvas = await html2canvas(templateElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: templateElement.offsetWidth,
        height: templateElement.offsetHeight,
        windowWidth: templateElement.offsetWidth,
        windowHeight: templateElement.offsetHeight
      })

      // Obter dimensões do canvas
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height

      // Calcular escala para manter proporção
      const scaleX = pdfWidth / canvasWidth
      const scaleY = pdfHeight / canvasHeight
      const scale = Math.min(scaleX, scaleY)

      // Calcular dimensões finais
      const finalWidth = canvasWidth * scale
      const finalHeight = canvasHeight * scale

      // Calcular posição para centralizar
      const x = (pdfWidth - finalWidth) / 2
      const y = (pdfHeight - finalHeight) / 2

      // Adicionar nova página se não for o primeiro certificado
      if (i > 0) {
        pdf.addPage()
      }

      // Adicionar a imagem ao PDF
      const imgData = canvas.toDataURL('image/png', 1.0)
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)

      // Limpar o container temporário
      if (container.parentElement) {
        container.parentElement.removeChild(container)
      }
    }

    // Criar nome do arquivo
    const fileName = classTitle 
      ? `certificados-${classTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`
      : `certificados-lote-${new Date().toISOString().split('T')[0]}.pdf`

    // Fazer download do PDF
    pdf.save(fileName)

  } catch (error) {
    console.error('Erro ao gerar certificados em lote:', error)
    throw error
  }
}

// Função para gerar certificados em lote com assinatura automática
export const generateBatchCertificatesPDFWithSignature = async (
  certificates: CertificateData[], 
  instructorId?: string,
  classTitle?: string
): Promise<void> => {
  return generateBatchCertificatesPDF(certificates, instructorId, classTitle)
}

// Função para gerar PDF com assinatura automática
export const generateCertificatePDFWithSignature = async (
  data: CertificateData, 
  instructorId?: string
): Promise<void> => {
  const enrichedData = await enrichCertificateWithSignature(data, instructorId)
  return generateCertificatePDF(enrichedData)
}

// Função alternativa que usa o template React diretamente
export const generateCertificatePDFFromTemplate = async (data: CertificateData): Promise<void> => {
  try {
    // Procurar por um elemento do template que já existe na página
    const existingTemplate = document.getElementById('certificate-template')
    
    if (existingTemplate) {
      // Usar o template existente (do preview)
      await generatePDFFromElement(existingTemplate, data)
    } else {
      // Usar a versão com HTML inline se não houver template existente
      await generateCertificatePDF(data)
    }
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    throw error
  }
}
