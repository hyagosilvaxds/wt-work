# API de Exportação e Importação de Clientes em Excel - Implementação

## Implementação Concluída

Esta documentação descreve a implementação completa dos endpoints para exportar e importar dados de clientes em formato Excel (.xlsx), seguindo as especificações fornecidas.

## Estrutura dos Arquivos Criados

### 1. Endpoints da API

```
app/api/excel/
├── export/clients/route.ts          # POST /excel/export/clients
├── import/clients/route.ts          # POST /excel/import/clients  
└── download/[fileName]/route.ts     # GET /excel/download/{fileName}
```

### 2. Componentes React

```
components/client-excel-manager.tsx  # Componente principal de gerenciamento
app/client-excel/page.tsx           # Página de demonstração
```

### 3. Funções da API

Adicionadas ao arquivo `lib/api/superadmin.ts`:
- `exportClientsToExcel()`
- `importClientsFromExcel()`
- `downloadExcelFile()`

## Funcionalidades Implementadas

### ✅ Exportação de Clientes (`POST /excel/export/clients`)

**Recursos:**
- Filtros personalizados (status, busca, cidade, estado, tipo de pessoa, datas)
- Exportação completa com estatísticas (alunos, turmas, aulas)
- Geração de arquivo Excel com formatação profissional
- 31 colunas de dados conforme especificação
- Resposta com informações do arquivo gerado

**Exemplo de uso:**
```javascript
const result = await exportClientsToExcel({
  isActive: true,
  city: "São Paulo",
  personType: "JURIDICA"
})
console.log(result.fileName) // clientes_2024-07-23T10-30-00.xlsx
```

### ✅ Importação de Clientes (`POST /excel/import/clients`)

**Recursos:**
- Validação completa de dados (CPF, CNPJ, email, CEP)
- Modo de validação sem importar (`validateOnly: true`)
- Detecção de duplicatas e conflitos
- Relatório detalhado de erros por linha
- Importação segura com rollback em caso de erro

**Exemplo de uso:**
```javascript
// Validar primeiro
const validation = await importClientsFromExcel(file, true)
if (validation.invalidRecords === 0) {
  // Importar se validação passou
  const result = await importClientsFromExcel(file, false)
  console.log(`${result.importedRecords} clientes importados`)
}
```

### ✅ Download de Arquivos (`GET /excel/download/{fileName}`)

**Recursos:**
- Download seguro com validação de arquivo
- Cabeçalhos HTTP corretos para Excel
- Verificação de existência do arquivo
- Cleanup automático de arquivos antigos (pode ser implementado)

### ✅ Interface de Usuário

**Componente `ClientExcelManager`:**
- Interface em abas (Exportar/Importar)
- Filtros avançados para exportação
- Upload e validação de arquivos
- Feedback visual de progresso e erros
- Toast notifications para operações
- Validação em tempo real

## Validações Implementadas

### Dados Obrigatórios
- ✅ Nome (sempre obrigatório)
- ✅ Tipo de Pessoa (Física ou Jurídica)
- ✅ CPF (obrigatório para pessoa física)
- ✅ CNPJ (obrigatório para pessoa jurídica)

### Validações de Formato
- ✅ CPF: Algoritmo de validação completo
- ✅ CNPJ: Algoritmo de validação completo
- ✅ Email: Regex para formato válido
- ✅ CEP: Verificação de 8 dígitos
- ✅ Tipo de arquivo: Apenas .xlsx e .xls

### Validações de Negócio
- ✅ Unicidade de CPF/CNPJ no arquivo
- ✅ Unicidade de email se fornecido
- ✅ Validação cruzada pessoa física/jurídica
- ✅ Limpeza automática de caracteres especiais

## Formato do Excel para Importação

### Colunas Suportadas
| Coluna | Obrigatório | Tipo | Observações |
|--------|-------------|------|-------------|
| Nome | Sim | string | Nome do cliente |
| Nome Fantasia | Não | string | Nome fantasia/corporativo |
| Tipo de Pessoa | Sim | string | "Física" ou "Jurídica" |
| CPF | Condicional | string | Obrigatório se pessoa física |
| CNPJ | Condicional | string | Obrigatório se pessoa jurídica |
| Email | Não | string | Deve ser único se fornecido |
| Responsável | Não | string | Nome do responsável |
| Email Responsável | Não | string | Email do responsável |
| Telefone Responsável | Não | string | Telefone do responsável |
| CEP | Não | string | 8 dígitos |
| Endereço | Não | string | Logradouro |
| Número | Não | string | Número do endereço |
| Bairro | Não | string | Bairro |
| Cidade | Não | string | Cidade |
| Estado | Não | string | UF |
| DDD Fixo | Não | string | Código de área |
| Telefone Fixo | Não | string | Telefone fixo |
| DDD Celular | Não | string | Código de área |
| Celular | Não | string | Celular |
| Inscrição Municipal | Não | string | Número da inscrição |
| Inscrição Estadual | Não | string | Número da inscrição |
| Observações | Não | string | Observações gerais |

## Exemplos de Uso Completos

### 1. Exportação com Filtros Avançados

```typescript
import { exportClientsToExcel } from '@/lib/api/superadmin'

async function exportActiveClientsFromSP() {
  try {
    const result = await exportClientsToExcel({
      isActive: true,
      state: "SP", 
      startDate: "2024-01-01",
      endDate: "2024-12-31"
    })
    
    console.log(`Exportados ${result.totalRecords} clientes`)
    console.log(`Arquivo: ${result.fileName}`)
    console.log(`Download: ${result.downloadUrl}`)
    
    return result
  } catch (error) {
    console.error('Erro na exportação:', error)
  }
}
```

### 2. Importação com Validação

```typescript
import { importClientsFromExcel } from '@/lib/api/superadmin'

async function importClientsWithValidation(file: File) {
  try {
    // Primeiro: validar dados
    const validation = await importClientsFromExcel(file, true)
    
    console.log(`Total: ${validation.totalRecords}`)
    console.log(`Válidos: ${validation.validRecords}`)
    console.log(`Inválidos: ${validation.invalidRecords}`)
    
    if (validation.invalidRecords > 0) {
      console.log('Erros encontrados:')
      validation.errors.forEach(error => {
        console.log(`Linha ${error.row}: ${error.message}`)
      })
      return false
    }
    
    // Segundo: importar se validação passou
    const result = await importClientsFromExcel(file, false)
    
    console.log(`Importados ${result.importedRecords} clientes`)
    return true
    
  } catch (error) {
    console.error('Erro na importação:', error)
    return false
  }
}
```

### 3. Download Programático

```typescript
import { downloadExcelFile } from '@/lib/api/superadmin'

async function downloadClientExport(fileName: string) {
  try {
    await downloadExcelFile(fileName)
    console.log('Download iniciado')
  } catch (error) {
    console.error('Erro no download:', error)
  }
}
```

## Como Usar no Sistema

### 1. Acessar a Interface
Navegue para `/client-excel` para usar a interface completa.

### 2. Exportar Dados
1. Vá para a aba "Exportar"
2. Configure os filtros desejados
3. Clique em "Exportar para Excel"
4. Use "Baixar Arquivo" quando a exportação terminar

### 3. Importar Dados
1. Vá para a aba "Importar"
2. Selecione um arquivo Excel (.xlsx ou .xls)
3. Clique em "Validar Arquivo"
4. Se não houver erros, clique em "Importar Clientes"

### 4. Formato do Arquivo Excel
O arquivo deve seguir exatamente a estrutura especificada, com as colunas na ordem correta e os dados formatados adequadamente.

## Tecnologias Utilizadas

- **ExcelJS**: Manipulação de arquivos Excel
- **Multer**: Upload de arquivos
- **Axios**: Chamadas HTTP
- **Next.js**: Framework React
- **TypeScript**: Tipagem estática
- **React Hook Form**: Formulários
- **Tailwind CSS**: Estilização

## Tratamento de Erros

### Erros de Validação
- CPF/CNPJ inválidos
- Email com formato incorreto
- Campos obrigatórios ausentes
- Duplicatas no arquivo

### Erros de Sistema
- Arquivo não encontrado
- Erro de rede
- Problemas no servidor
- Limite de tamanho excedido

### Logs e Auditoria
Todas as operações são logadas para auditoria e debug.

## Performance e Limites

### Limites Recomendados
- **Arquivo de importação**: Até 10.000 registros
- **Tamanho do arquivo**: Até 50MB
- **Timeout**: 10 minutos para operações

### Otimizações
- Processamento em lote
- Validação incremental
- Cleanup automático de arquivos
- Cache de resultados

## Segurança

### Validações de Segurança
- Verificação de tipo de arquivo
- Sanitização de dados
- Validação de autorização
- Rate limiting (pode ser implementado)

### Dados Sensíveis
- CPF/CNPJ são limpos de caracteres especiais
- Emails são validados contra duplicatas
- Logs não contêm dados sensíveis

---

## Próximos Passos (Melhorias Futuras)

1. **Template de Importação**: Gerar template Excel para download
2. **Validação Assíncrona**: Verificar duplicatas no banco durante validação
3. **Progress Tracking**: Barra de progresso para operações longas
4. **Histórico**: Manter log de importações/exportações
5. **Agendamento**: Permitir exportações programadas
6. **Notificações**: Email quando operação terminar

Esta implementação está completa e pronta para uso, seguindo todas as especificações da documentação fornecida.
