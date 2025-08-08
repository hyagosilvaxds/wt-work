# Conta Bancária Obrigatória - Contas a Pagar ✅

## Alterações Implementadas

### 🎯 Objetivo
Tornar a seleção de conta bancária **obrigatória** no momento de criar uma conta a pagar.

### 📝 Alterações Realizadas

#### 1. Validação Obrigatória (`add-payable-dialog.tsx`)

**Antes:**
```typescript
if (!formData.supplier || !formData.value || !formData.dueDate) {
  alert("Preencha todos os campos obrigatórios")
  return
}
```

**Depois:**
```typescript
if (!formData.supplier || !formData.value || !formData.dueDate || !formData.accountId) {
  toast({
    title: "Campos obrigatórios",
    description: "Preencha todos os campos obrigatórios: Fornecedor, Valor, Data de Vencimento e Conta de Débito",
    variant: "destructive",
  })
  return
}
```

#### 2. Interface Visual Atualizada

**Label com Indicador Obrigatório:**
```typescript
<Label>Conta de Débito <span className="text-red-500">*</span></Label>
```

**SelectTrigger com Estilo de Validação:**
```typescript
<SelectTrigger className={!formData.accountId ? "border-red-300" : ""}>
```

### ✅ Funcionalidades Implementadas

1. **Validação Obrigatória**: Impede a criação de conta a pagar sem selecionar uma conta bancária
2. **Feedback Visual**: Label com asterisco vermelho indica campo obrigatório
3. **Feedback de Erro**: Toast com mensagem clara sobre campos obrigatórios
4. **Estilo de Validação**: Borda vermelha quando campo não está preenchido

### 🔍 Situação Atual dos Formulários

#### ✅ AddPayableDialog (Contas a Pagar)
- **Status**: Conta bancária obrigatória ✅
- **Validação**: Implementada
- **Feedback Visual**: Asterisco vermelho
- **Mensagem de Erro**: Toast informativo

#### ✅ AddReceivableDialog (Contas a Receber)
- **Status**: Conta bancária já era obrigatória ✅
- **Validação**: Já implementada
- **Feedback Visual**: Asterisco vermelho
- **Mensagem de Erro**: Toast informativo

### 📋 Campos Obrigatórios Finais

#### Para Contas a Pagar:
1. **Fornecedor** ⭐
2. **Valor** ⭐
3. **Data de Vencimento** ⭐
4. **Conta de Débito** ⭐ ← **NOVO OBRIGATÓRIO**

#### Para Contas a Receber:
1. **Cliente** ⭐
2. **Valor** ⭐
3. **Data de Vencimento** ⭐
4. **Conta de Recebimento** ⭐ ← **JÁ ERA OBRIGATÓRIO**

### 🎯 Resultado

Agora **ambos os formulários** (contas a pagar e contas a receber) exigem obrigatoriamente a seleção de uma conta bancária, garantindo:

- ✅ **Consistência**: Todas as transações financeiras têm conta bancária associada
- ✅ **Rastreabilidade**: Melhor controle do fluxo de caixa por conta
- ✅ **Relatórios**: Dados mais precisos para análises e relatórios
- ✅ **UX**: Feedback claro ao usuário sobre campos obrigatórios

---

**Data da Implementação:** 8 de agosto de 2025  
**Status:** ✅ **IMPLEMENTADO E FUNCIONAL**
