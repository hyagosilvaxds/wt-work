# Treinamentos Excel - Documentação de Implementação

## 📋 Visão Geral

Esta implementação fornece funcionalidades completas para importar e exportar treinamentos via Excel, seguindo a API documentada. O sistema inclui validação de arquivos, tratamento de erros, e uma interface de usuário intuitiva.

## 🗂️ Estrutura de Arquivos

```
lib/api/
  └── trainings-excel.ts          # Funções da API para Excel

hooks/
  └── use-training-excel.ts       # Hook personalizado para operações Excel

components/
  ├── training-excel-manager.tsx  # Componente completo de gerenciamento
  └── quick-training-excel.tsx    # Componente simplificado para uso rápido

app/(app)/
  └── trainings-excel/page.tsx    # Página completa de gerenciamento
```

## 🚀 Como Usar

### 1. Uso Básico com QuickTrainingExcel

Para adicionar funcionalidades de Excel em qualquer página existente:

```tsx
import { QuickTrainingExcel } from "@/components/quick-training-excel"

export function MinhaPage() {
  return (
    <div>
      <h1>Minha Página</h1>
      
      {/* Botões de Excel */}
      <QuickTrainingExcel 
        onImportComplete={() => {
          console.log('Treinamentos importados!')
          // Recarregar dados, etc.
        }}
        exportFilters={{ isActive: true }} // Apenas ativos
      />
    </div>
  )
}
```

### 2. Uso Avançado com Hook

Para controle total sobre as operações:

```tsx
import { useTrainingExcel } from "@/hooks/use-training-excel"

export function MinhaPage() {
  const {
    exportLoading,
    importLoading,
    exportTrainings,
    importTrainings,
    downloadTemplate
  } = useTrainingExcel({
    onImportSuccess: (result) => {
      console.log(`${result.importedRecords} treinamentos importados!`)
    },
    onExportSuccess: (fileName, totalRecords) => {
      console.log(`${totalRecords} treinamentos exportados em ${fileName}`)
    }
  })

  const handleExport = async () => {
    await exportTrainings({
      search: "NR",
      isActive: true,
      startDate: "2024-01-01"
    })
  }

  return (
    <div>
      <button onClick={handleExport} disabled={exportLoading}>
        {exportLoading ? 'Exportando...' : 'Exportar'}
      </button>
    </div>
  )
}
```

### 3. Componente Completo

Para uma interface completa de gerenciamento:

```tsx
import { TrainingExcelManager } from "@/components/training-excel-manager"

export function MinhaPage() {
  return (
    <div>
      <h1>Gerenciar Treinamentos</h1>
      
      <TrainingExcelManager 
        onImportComplete={() => {
          // Atualizar lista de treinamentos
          reloadTrainings()
        }}
      />
    </div>
  )
}
```

## 📊 Funcionalidades Disponíveis

### ✅ Exportação
- **Filtros flexíveis**: busca, status, datas
- **Download automático** do arquivo gerado
- **Feedback visual** com total de registros exportados
- **Gestão de arquivos** temporários

### ✅ Importação
- **Validação de arquivo**: formato e tamanho
- **Prévia antes da importação**: validação sem persistir dados
- **Relatório detalhado**: registros válidos, inválidos e erros específicos
- **Confirmação de importação**: usuário decide se quer prosseguir

### ✅ Template
- **Download de template** com formato correto
- **Documentação integrada** dos campos obrigatórios e opcionais

### ✅ Experiência do Usuário
- **Estados de loading** em todas as operações
- **Toasts informativos** para feedback
- **Tratamento de erros** com mensagens amigáveis
- **Interface responsiva** para desktop e mobile

## 🔧 Configuração da API

O arquivo `trainings-excel.ts` já está configurado para trabalhar com:

- **Base URL**: Usa o cliente axios configurado
- **Autenticação**: JWT token automático via interceptor
- **Tratamento de erros**: Redirecionamento automático para login se necessário
- **Tipos TypeScript**: Tipagem completa para todas as operações

## 📋 Template Excel

### Campos Obrigatórios:
- **Título**: Nome único do treinamento
- **Duração (Horas)**: Número maior que zero

### Campos Opcionais:
- **Descrição**: Descrição do treinamento
- **Validade (Dias)**: Dias de validade do certificado
- **Status**: Ativo ou Inativo (padrão: Ativo)

### Exemplo de Dados:
```
| Título | Descrição | Duração (Horas) | Validade (Dias) | Status |
|--------|-----------|-----------------|-----------------|--------|
| NR10 - Segurança em Eletricidade | Treinamento obrigatório | 40 | 730 | Ativo |
| Primeiros Socorros | Curso básico | 8 | 365 | Ativo |
```

## ⚠️ Limitações e Validações

### Arquivo:
- **Tamanho máximo**: 10MB
- **Formatos aceitos**: .xlsx, .xls
- **Registros por importação**: 500 treinamentos (conforme API)

### Validações:
- **Título único**: Não pode ter títulos duplicados
- **Duração positiva**: Deve ser maior que zero
- **Validade válida**: Se fornecida, deve ser positiva
- **Status válido**: Apenas "Ativo" ou "Inativo"

## 🔍 Tratamento de Erros

O sistema trata automaticamente:

- **Arquivos inválidos**: Formato ou tamanho incorreto
- **Erros de rede**: Timeout, conexão perdida
- **Erros de autenticação**: Token expirado
- **Erros de validação**: Dados inconsistentes
- **Erros do servidor**: Problemas na API

Todos os erros são exibidos como toasts com mensagens amigáveis.

## 🎨 Customização

### Estilos
Os componentes usam Tailwind CSS e shadcn/ui. Para personalizar:

```tsx
// Customize cores, tamanhos, etc.
<Button className="bg-custom-color hover:bg-custom-color-hover">
  Meu Botão Customizado
</Button>
```

### Filtros de Exportação
Adicione novos filtros modificando o tipo `TrainingExportFilters`:

```typescript
export interface TrainingExportFilters {
  search?: string
  isActive?: boolean
  startDate?: string
  endDate?: string
  // Adicione novos filtros aqui
  category?: string
  instructor?: string
}
```

### Callbacks Personalizados
Todos os componentes aceitam callbacks para integração:

```tsx
<TrainingExcelManager 
  onImportComplete={() => {
    // Sua lógica personalizada
    updateStatistics()
    refreshCharts()
    showSuccessModal()
  }}
/>
```

## 🧪 Testes

Para testar as funcionalidades:

1. **Export**: Crie alguns treinamentos e teste a exportação
2. **Template**: Baixe o template e verifique a estrutura
3. **Import**: Preencha o template e teste a importação
4. **Validação**: Teste com dados inválidos para ver o tratamento de erros
5. **Filtros**: Teste diferentes combinações de filtros na exportação

## 📚 Próximos Passos

1. **Conectar à API real**: Substitua os dados mock por chamadas reais
2. **Adicionar logs**: Implemente logging para auditoria
3. **Cache**: Implemente cache para melhor performance
4. **Notificações**: Adicione notificações por email para imports grandes
5. **Histórico**: Mantenha histórico de imports/exports

## 🤝 Suporte

Para dúvidas ou problemas:

1. Verifique os logs do console do navegador
2. Confira a documentação da API
3. Teste com dados menores para isolar problemas
4. Verifique as permissões do usuário

---

**Versão**: 1.0  
**Última atualização**: 24 de julho de 2025
