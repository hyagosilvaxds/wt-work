# API Endpoints para Documentos de Instrutores

## Estrutura do Banco de Dados

```sql
CREATE TABLE instructor_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_instructor_documents_instructor_id ON instructor_documents(instructor_id);
CREATE INDEX idx_instructor_documents_category ON instructor_documents(category);
```

## Endpoints da API

### 1. Listar Documentos
```
GET /api/instructors/documents

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- instructorId: string (optional)
- category: string (optional)
- search: string (optional)

Response:
{
  "documents": [
    {
      "id": "uuid",
      "instructorId": "uuid",
      "fileName": "file_123.pdf",
      "originalName": "Certificado.pdf",
      "fileType": "application/pdf",
      "fileSize": 2048000,
      "description": "Certificado de instrutor",
      "category": "certificado",
      "uploadDate": "2024-01-15T10:30:00Z",
      "instructor": {
        "id": "uuid",
        "name": "João Silva"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2. Upload de Documento
```
POST /api/instructors/documents

Content-Type: multipart/form-data

Form Data:
- file: File (required)
- instructorId: string (required)
- description: string (optional)
- category: string (optional)

Response:
{
  "success": true,
  "document": {
    "id": "uuid",
    "instructorId": "uuid",
    "fileName": "file_123.pdf",
    "originalName": "Certificado.pdf",
    "fileType": "application/pdf",
    "fileSize": 2048000,
    "description": "Certificado de instrutor",
    "category": "certificado",
    "uploadDate": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Download de Documento
```
GET /api/instructors/documents/:id/download

Response:
- File stream with appropriate headers
- Content-Disposition: attachment; filename="original_name.pdf"
- Content-Type: application/pdf (or appropriate mime type)
```

### 4. Deletar Documento
```
DELETE /api/instructors/documents/:id

Response:
{
  "success": true,
  "message": "Documento excluído com sucesso"
}
```

### 5. Atualizar Documento (apenas metadados)
```
PUT /api/instructors/documents/:id

Body:
{
  "description": "Nova descrição",
  "category": "nova_categoria"
}

Response:
{
  "success": true,
  "document": {
    "id": "uuid",
    "description": "Nova descrição",
    "category": "nova_categoria",
    // ... outros campos
  }
}
```

## Implementação no Frontend

Para conectar o componente à API real, substitua as funções simuladas em `instructor-documents-page.tsx`:

### 1. Função de buscar documentos:
```typescript
const fetchDocuments = useCallback(async () => {
  try {
    setLoading(true)
    const params = new URLSearchParams({
      page: '1',
      limit: '1000',
      ...(selectedInstructor !== 'all' && { instructorId: selectedInstructor }),
      ...(selectedCategory !== 'all' && { category: selectedCategory }),
      ...(searchTerm && { search: searchTerm })
    })
    
    const response = await fetch(`/api/instructors/documents?${params}`)
    const data = await response.json()
    setDocuments(data.documents)
  } catch (error) {
    console.error('Erro ao carregar documentos:', error)
  } finally {
    setLoading(false)
  }
}, [selectedInstructor, selectedCategory, searchTerm])
```

### 2. Função de upload:
```typescript
const handleUploadSubmit = async () => {
  if (!uploadForm.file || !uploadForm.instructorId) return

  try {
    setUploadLoading(true)
    
    const formData = new FormData()
    formData.append('file', uploadForm.file)
    formData.append('instructorId', uploadForm.instructorId)
    if (uploadForm.description) formData.append('description', uploadForm.description)
    if (uploadForm.category) formData.append('category', uploadForm.category)

    const response = await fetch('/api/instructors/documents', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const data = await response.json()
      setDocuments(prev => [data.document, ...prev])
      // Reset form and close modal
    }
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
  } finally {
    setUploadLoading(false)
  }
}
```

### 3. Função de download:
```typescript
const handleDownload = async (documentId: string, fileName: string) => {
  try {
    const response = await fetch(`/api/instructors/documents/${documentId}/download`)
    const blob = await response.blob()
    
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Erro ao fazer download:', error)
  }
}
```

### 4. Função de exclusão:
```typescript
const handleDeleteDocument = async () => {
  if (!selectedDocument) return

  try {
    const response = await fetch(`/api/instructors/documents/${selectedDocument.id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      setDocuments(prev => prev.filter(doc => doc.id !== selectedDocument.id))
      setDeleteModalOpen(false)
      setSelectedDocument(null)
    }
  } catch (error) {
    console.error('Erro ao deletar documento:', error)
  }
}
```

## Considerações de Segurança

1. **Validação de arquivos**: Validar tipo e tamanho dos arquivos no backend
2. **Autenticação**: Verificar permissões do usuário para cada operação
3. **Armazenamento seguro**: Usar serviços como AWS S3 para armazenamento
4. **Sanitização**: Sanitizar nomes de arquivos para evitar vulnerabilidades
5. **Rate limiting**: Implementar limites de upload por usuário/IP

## Validações Recomendadas

- Tipos de arquivo permitidos: PDF, DOC, DOCX, JPG, JPEG, PNG
- Tamanho máximo: 10MB por arquivo
- Verificar se o instrutor existe e está ativo
- Verificar permissões do usuário logado
