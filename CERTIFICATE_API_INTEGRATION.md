# Integração da Nova API de Elegibilidade de Certificados

## 📋 Resumo das Mudanças

O sistema de certificados foi completamente adaptado para utilizar a nova API de elegibilidade, oferecendo informações mais detalhadas sobre o status dos alunos e critérios de aprovação baseados em notas e presenças.

## 🔄 APIs Integradas

### 1. Verificação de Elegibilidade por Turma
- **Endpoint:** `GET /certificado/eligibility/{classId}`
- **Função:** `getCertificateEligibility(classId: string)`
- **Dados Retornados:**
  - Notas práticas e teóricas
  - Presenças e faltas detalhadas
  - Status de elegibilidade com motivos específicos
  - Média calculada automaticamente

### 2. Turmas Concluídas com Elegibilidade
- **Endpoint:** `GET /certificado/completed-classes`
- **Função:** `getCompletedClassesWithEligibility()`
- **Dados Retornados:**
  - Lista completa de turmas concluídas
  - Estatísticas de elegibilidade por turma
  - Informações de validade dos certificados

### 3. Turmas Elegíveis por Cliente
- **Endpoint:** `GET /certificado/client/{clientId}/eligible-classes`
- **Função:** `getClientEligibleClasses(clientId: string)`
- **Dados Retornados:**
  - Turmas específicas do cliente
  - Resumo de elegibilidade consolidado
  - Contadores de turmas e alunos elegíveis

## 🎯 Critérios de Elegibilidade

### Sistema de Notas
- ✅ **Nota ≥ 5.0:** Aprovado
- ❌ **Nota < 5.0:** Reprovado (impede certificação)
- 📝 **Sem notas:** Considerado apto automaticamente
- 🧮 **Tipos suportados:**
  - Apenas prática
  - Apenas teórica
  - Ambas (média calculada)
  - Nenhuma avaliação

### Sistema de Presenças
- ✅ **Sem faltas:** Apto para certificação
- ❌ **Com faltas:** Impede certificação
- 📝 **Sem chamadas:** Considerado apto automaticamente

### Bloqueios de Certificado
- 🚫 **Bloqueios ativos:** Impedem certificação
- 📄 **Motivos específicos:** Exibidos ao usuário
- ⚙️ **Gerenciamento:** Via tabela `CertificateBlock`

## 🔧 Melhorias na Interface

### Toggle de Modos
- **📊 API Elegibilidade:** Usa nova API com validação completa
- **📋 Modo Clássico:** Mantém compatibilidade com sistema anterior

### Exibição de Dados
1. **Informações de Notas:**
   - Nota prática (quando disponível)
   - Nota teórica (quando disponível)
   - Média calculada
   - Indicadores visuais de aprovação/reprovação

2. **Status de Elegibilidade:**
   - ✅ **Apto para certificado**
   - ❌ **Reprovado por Nota**
   - ⚠️ **Reprovado por Faltas**
   - 🚫 **Certificado Bloqueado**

3. **Estatísticas da Turma:**
   - Alunos elegíveis vs não elegíveis
   - Contadores específicos por motivo
   - Informações de validade dos certificados

### Funcionalidades Aprimoradas

#### Geração Individual
- **Validação automática** de elegibilidade
- **Mensagens específicas** para cada tipo de impedimento
- **Tooltips informativos** com motivos detalhados

#### Geração em Lote
- **Filtro automático** de alunos elegíveis
- **Contador atualizado** de certificados possíveis
- **Adaptação** para ambos os modos (elegibilidade/clássico)

## 📊 Exemplos de Uso

### Verificar Elegibilidade de uma Turma
```typescript
const students = await getCertificateEligibility('turma-123')
const eligible = students.filter(s => s.isEligible)
console.log(`${eligible.length}/${students.length} alunos elegíveis`)
```

### Obter Turmas de um Cliente
```typescript
const clientData = await getClientEligibleClasses('cliente-456')
console.log(`${clientData.eligibleClasses}/${clientData.totalClasses} turmas com alunos elegíveis`)
```

### Filtrar por Motivo de Inelegibilidade
```typescript
const failedByGrade = students.filter(s => 
  !s.isEligible && s.reason.includes('nota')
)
const failedByAbsence = students.filter(s => 
  !s.isEligible && s.reason.includes('falta')
)
```

## 🔒 Tratamento de Erros

### Códigos de Status
- **400:** Erro de validação com mensagem específica
- **404:** Turma/Cliente não encontrado
- **500:** Erro interno do servidor

### Mensagens de Usuário
- **Certificado bloqueado:** Exibe motivo específico
- **Aluno não elegível:** Explica critério não atendido
- **Dados indisponíveis:** Fallback para modo clássico

## 🚀 Compatibilidade

### Backward Compatibility
- **Modo clássico** mantém funcionalidade original
- **APIs antigas** ainda funcionam como fallback
- **Migração gradual** sem interrupção de serviço

### Progressive Enhancement
- **Detecção automática** de disponibilidade da nova API
- **Degradação elegante** em caso de erro
- **Experiência melhorada** quando nova API está disponível

## 📈 Benefícios

### Para Administradores
- **Visibilidade completa** do status de cada aluno
- **Relatórios detalhados** de elegibilidade
- **Controle fino** sobre critérios de aprovação

### Para Clientes
- **Transparência total** sobre status dos certificados
- **Informações precisas** sobre impedimentos
- **Processo automatizado** de validação

### Para Instrutores
- **Feedback detalhado** sobre performance da turma
- **Identificação fácil** de alunos com pendências
- **Gestão eficiente** da certificação

## 🔄 Próximos Passos

1. **Testes** com dados reais da nova API
2. **Monitoramento** de performance e erros
3. **Feedback** dos usuários sobre nova interface
4. **Otimizações** baseadas no uso real
5. **Documentação** para outros desenvolvedores

---

*Sistema atualizado em: 23/07/2025*
*Versão da API: v2.0*
*Compatibilidade: Backward compatible*
