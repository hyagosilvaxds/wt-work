import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

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

export const CertificateTemplate = ({ data }: { data: CertificateData }) => {
  return (
    <div 
      id="certificate-template"
      className="bg-white p-16 font-serif relative overflow-hidden"
      style={{
        width: '297mm',
        height: '210mm',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        border: '8px solid #78BA00',
        boxShadow: '0 0 30px rgba(0,0,0,0.1)'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-primary-300 rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border-4 border-primary-300 rounded-full"></div>
        <div className="absolute bottom-10 left-20 w-28 h-28 border-4 border-primary-300 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 border-4 border-primary-300 rounded-full"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-2">
            CERTIFICADO
          </h1>
          <div className="w-32 h-1 bg-primary-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">
            DE CONCLUSÃO DE CURSO
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center text-center px-8">
          <p className="text-2xl text-gray-700 mb-8 leading-relaxed">
            Certificamos que
          </p>
          
          <div className="mb-12">
            <p className="text-5xl font-bold text-primary-700 mb-4 border-b-2 border-primary-200 pb-2 inline-block">
              {data.studentName}
            </p>
          </div>

          <p className="text-2xl text-gray-700 mb-8 leading-relaxed">
            concluiu com êxito o curso de
          </p>

          <div className="mb-12">
            <p className="text-4xl font-bold text-gray-800 mb-4">
              {data.trainingName}
            </p>
            <div className="flex justify-center items-center gap-8 text-lg text-gray-600">
              <span>Carga horária: <strong>{data.workload}</strong></span>
              {data.company && <span>•</span>}
              {data.company && <span>Empresa: <strong>{data.company}</strong></span>}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 text-lg text-gray-600 mb-8">
            {data.startDate && data.endDate && (
              <span>
                Período: <strong>{data.startDate} a {data.endDate}</strong>
              </span>
            )}
            {data.location && (
              <>
                <span>•</span>
                <span>Local: <strong>{data.location}</strong></span>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <div className="flex justify-between items-end">
            <div className="text-center flex-1">
              <div className="border-t-2 border-gray-400 pt-2 mx-8">
                <p className="text-lg font-semibold text-gray-700">{data.instructorName}</p>
                <p className="text-sm text-gray-600">Instrutor Responsável</p>
              </div>
            </div>
            
            <div className="text-center flex-1">
              <div className="border-t-2 border-gray-400 pt-2 mx-8">
                <p className="text-lg font-semibold text-gray-700">WT Work Treinamentos</p>
                <p className="text-sm text-gray-600">Direção</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Emitido em: {data.issueDate}</p>
            <p>Código de Validação: {data.validationCode}</p>
            <p className="mt-2">Este certificado pode ser validado em nosso sistema</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const generateCertificatePDF = async (data: CertificateData): Promise<void> => {
  try {
    // Criar elemento temporário em tamanho real para captura
    const container = document.createElement('div')
    container.id = 'certificate-temp'
    container.style.position = 'fixed'
    container.style.top = '-9999px'
    container.style.left = '-9999px'
    container.style.width = '297mm'
    container.style.height = '210mm'
    container.style.background = 'white'
    container.style.zIndex = '-1000'
    
    // Usar o HTML estático para garantir que seja renderizado corretamente
    container.innerHTML = generateCertificateHTML(data)
    document.body.appendChild(container)

    try {
      // Aguardar um pouco para o elemento ser renderizado
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Capturar o elemento como imagem em alta resolução
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: container.offsetWidth,
        height: container.offsetHeight,
        windowWidth: container.offsetWidth,
        windowHeight: container.offsetHeight
      })

      // Criar PDF em formato landscape
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Adicionar a imagem ao PDF ocupando toda a página
      const imgData = canvas.toDataURL('image/png', 1.0)
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210)

      // Fazer download do PDF
      pdf.save(`certificado-${data.studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } finally {
      // Limpar o container temporário
      document.body.removeChild(container)
    }
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    throw error
  }
}

export const generateCertificateHTML = (data: CertificateData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Certificado - ${data.studentName}</title>
        <style>
            @page {
                size: A4 landscape;
                margin: 0;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Times New Roman', serif;
                margin: 0;
                padding: 0;
                width: 297mm;
                height: 210mm;
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                position: relative;
                overflow: hidden;
            }
            
            .certificate {
                width: 100%;
                height: 100%;
                position: relative;
                border: 8px solid #78BA00;
                box-sizing: border-box;
                padding: 60px;
                display: flex;
                flex-direction: column;
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            }
            
            .bg-pattern {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0.05;
                pointer-events: none;
                z-index: 1;
            }
            
            .bg-circle {
                position: absolute;
                border: 4px solid #78BA00;
                border-radius: 50%;
            }
            
            .bg-circle:nth-child(1) {
                top: 40px;
                left: 40px;
                width: 120px;
                height: 120px;
            }
            
            .bg-circle:nth-child(2) {
                top: 80px;
                right: 80px;
                width: 90px;
                height: 90px;
            }
            
            .bg-circle:nth-child(3) {
                bottom: 40px;
                left: 80px;
                width: 100px;
                height: 100px;
            }
            
            .bg-circle:nth-child(4) {
                bottom: 80px;
                right: 40px;
                width: 80px;
                height: 80px;
            }
            
            .content {
                position: relative;
                z-index: 2;
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .header h1 {
                font-size: 48px;
                font-weight: bold;
                color: #333;
                margin-bottom: 10px;
                letter-spacing: 2px;
            }
            
            .header .line {
                width: 120px;
                height: 4px;
                background: #78BA00;
                margin: 0 auto 20px;
            }
            
            .header .subtitle {
                font-size: 20px;
                color: #666;
                letter-spacing: 1px;
            }
            
            .main-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: center;
                padding: 0 30px;
            }
            
            .certify-text {
                font-size: 24px;
                color: #333;
                margin-bottom: 30px;
                font-weight: normal;
            }
            
            .student-name {
                font-size: 42px;
                font-weight: bold;
                color: #78BA00;
                margin: 20px 0;
                border-bottom: 3px solid #78BA00;
                padding-bottom: 10px;
                display: inline-block;
                min-width: 400px;
            }
            
            .completion-text {
                font-size: 24px;
                color: #333;
                margin: 30px 0;
                font-weight: normal;
            }
            
            .training-name {
                font-size: 32px;
                font-weight: bold;
                color: #333;
                margin: 20px 0;
                line-height: 1.2;
            }
            
            .details {
                font-size: 18px;
                color: #666;
                margin: 20px 0;
                line-height: 1.5;
            }
            
            .details strong {
                color: #333;
            }
            
            .period-location {
                font-size: 18px;
                color: #666;
                margin: 15px 0;
            }
            
            .footer {
                margin-top: auto;
                padding-top: 30px;
            }
            
            .signatures {
                display: flex;
                justify-content: space-between;
                align-items: end;
                margin-bottom: 30px;
            }
            
            .signature {
                text-align: center;
                flex: 1;
                margin: 0 30px;
            }
            
            .signature-line {
                border-top: 2px solid #666;
                padding-top: 10px;
                margin-top: 40px;
            }
            
            .signature-name {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
            }
            
            .signature-title {
                font-size: 14px;
                color: #666;
            }
            
            .validation {
                text-align: center;
                font-size: 12px;
                color: #999;
                line-height: 1.4;
            }
            
            .validation div {
                margin: 3px 0;
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="bg-pattern">
                <div class="bg-circle"></div>
                <div class="bg-circle"></div>
                <div class="bg-circle"></div>
                <div class="bg-circle"></div>
            </div>
            
            <div class="content">
                <div class="header">
                    <h1>CERTIFICADO</h1>
                    <div class="line"></div>
                    <div class="subtitle">DE CONCLUSÃO DE CURSO</div>
                </div>
                
                <div class="main-content">
                    <div class="certify-text">
                        Certificamos que
                    </div>
                    
                    <div class="student-name">${data.studentName}</div>
                    
                    <div class="completion-text">
                        concluiu com êxito o curso de
                    </div>
                    
                    <div class="training-name">${data.trainingName}</div>
                    
                    <div class="details">
                        <div>Carga horária: <strong>${data.workload}</strong></div>
                        ${data.company ? `<div>Empresa: <strong>${data.company}</strong></div>` : ''}
                    </div>
                    
                    ${data.startDate && data.endDate ? `
                        <div class="period-location">
                            <strong>Período:</strong> ${data.startDate} a ${data.endDate}
                            ${data.location ? ` • <strong>Local:</strong> ${data.location}` : ''}
                        </div>
                    ` : data.location ? `
                        <div class="period-location">
                            <strong>Local:</strong> ${data.location}
                        </div>
                    ` : ''}
                </div>
                
                <div class="footer">
                    <div class="signatures">
                        <div class="signature">
                            <div class="signature-line">
                                <div class="signature-name">${data.instructorName}</div>
                                <div class="signature-title">Instrutor Responsável</div>
                            </div>
                        </div>
                        
                        <div class="signature">
                            <div class="signature-line">
                                <div class="signature-name">WT Work Treinamentos</div>
                                <div class="signature-title">Direção</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="validation">
                        <div>Emitido em: ${data.issueDate}</div>
                        <div>Código de Validação: ${data.validationCode}</div>
                        <div style="margin-top: 8px;">Este certificado pode ser validado em nosso sistema</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `
}
