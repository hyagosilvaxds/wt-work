# Correção da API de Contas Bancárias

## ✅ Problema Identificado e Resolvido

### 🐛 Erro Original:
```
Unknown argument `observacoes`. Did you mean `observations`?
```

### 🔧 Causa:
Inconsistência no nome do campo entre frontend e backend:
- Frontend enviava: `observacoes` 
- Backend/Prisma esperava: `observations`

### ✅ Solução Aplicada:

1. **Corrigida a interface `UpdateBankAccountData`** em `lib/api/financial.ts`:
   ```typescript
   // ANTES
   observacoes?: string
   
   // DEPOIS  
   observations?: string
   ```

2. **Atualizado o componente** em `components/financial/accounts-content.tsx`:
   ```typescript
   // ANTES
   observacoes: editingAccount.observations,
   
   // DEPOIS
   observations: editingAccount.observations,
   ```

### 🎯 Status:
**✅ CORREÇÃO COMPLETA**
- A atualização de contas bancárias agora deve funcionar corretamente
- O campo de observações está sincronizado entre frontend e backend
- Não há mais conflitos de nomes de campos

### 📝 Campos Corretos da API:
- `observations` ✅ (campo correto)
- `nome` ✅
- `banco` ✅  
- `agencia` ✅
- `numero` ✅
- `tipoConta` ✅
- `isActive` ✅
- `isMain` ✅
