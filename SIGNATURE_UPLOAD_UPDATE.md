# Atualização do Sistema de Assinatura dos Instrutores

## Resumo das Alterações

O sistema de upload de assinaturas dos instrutores foi atualizado para usar a nova API de upload de imagens. As principais mudanças incluem:

### 1. Nova API de Upload de Imagens

**Endpoint:** `POST /upload/image`

**Payload:**
```bash
curl --location 'worktreinamentos.olimpustech.com/upload/image' \
--header 'Authorization: Bearer [TOKEN]' \
--form 'file=@"/path/to/image.png"'
```

**Resposta:**
```json
{
    "filename": "402bcfda-141f-45b7-81e3-f13a25f01bfb.png",
    "originalname": "fundo-certificado.png",
    "path": "uploads/images/402bcfda-141f-45b7-81e3-f13a25f01bfb.png",
    "mimetype": "image/png",
    "size": 611049,
    "url": "/uploads/images/402bcfda-141f-45b7-81e3-f13a25f01bfb.png"
}
```

### 2. Atualização do Endpoint de Assinaturas

**Endpoint:** `POST /superadmin/signatures`

**Payload:**
```json
{
  "instructorId": "clxxxxx",
  "imagePath": "/uploads/images/signatures/12345678-1234-1234-1234-123456789012.png"
}
```

### 3. Processo de Upload Atualizado

O processo agora funciona em duas etapas:

1. **Upload da Imagem:** O arquivo é enviado primeiro para `/upload/image`
2. **Registro da Assinatura:** O path da imagem é enviado para `/superadmin/signatures`

### 4. Arquivos Modificados

#### `/lib/api/superadmin.ts`
- Adicionada nova interface `UploadImageResponse`
- Adicionada função `uploadImage()` para upload genérico de imagens
- Atualizada função `uploadSignature()` para usar o novo processo em duas etapas

#### `/components/signatures-page.tsx`
- Melhorado feedback visual durante o upload
- Adicionada validação de tamanho de arquivo (5MB máximo)
- Adicionado spinner de loading no botão de upload
- Melhorado as mensagens de toast para o usuário

#### `/components/signature-upload-modal.tsx`
- Aplicadas as mesmas melhorias de UX do arquivo anterior
- Validação de tamanho de arquivo
- Feedback visual melhorado

### 5. Melhorias de UX Implementadas

- **Validação de Arquivo:** Verificação de tipo e tamanho antes do upload
- **Feedback Visual:** Spinner animado durante o upload
- **Mensagens Informativas:** Toast com progresso do upload
- **Prévia da Imagem:** Visualização da imagem antes do upload
- **Tratamento de Erros:** Mensagens de erro mais específicas

### 6. Configuração da API

O sistema usa o cliente axios configurado em `/lib/api/client.ts` que:
- Adiciona automaticamente o token JWT no cabeçalho `Authorization`
- Intercepta erros 401/403 e redireciona para login
- Tem timeout de 10 segundos configurado

### 7. Como Usar

1. **Acesse a aba "Assinaturas"** na página de instrutores
2. **Clique em "Fazer Upload"** para uma nova assinatura ou "Atualizar" para uma existente
3. **Selecione um instrutor** (se aplicável)
4. **Escolha o arquivo de imagem** (PNG, JPG, JPEG - máximo 5MB)
5. **Visualize a prévia** da imagem
6. **Clique em "Fazer Upload"** para enviar

### 8. Arquivos de Suporte

- `components/ui/button.tsx` - Componente de botão
- `components/ui/dialog.tsx` - Modal de diálogo
- `components/ui/input.tsx` - Campo de input
- `components/ui/label.tsx` - Label de formulário
- `components/ui/select.tsx` - Seletor dropdown

### 9. Dependências

- `axios` - Cliente HTTP
- `js-cookie` - Gerenciamento de cookies
- `sonner` - Sistema de notificações toast
- `lucide-react` - Ícones
- `date-fns` - Formatação de datas

### 10. Segurança

- Validação de tipo de arquivo no frontend
- Validação de tamanho de arquivo (5MB máximo)
- Autenticação JWT obrigatória
- Interceptação automática de tokens inválidos

## Estrutura de Arquivos Relacionados

```
lib/
├── api/
│   ├── client.ts           # Cliente axios configurado
│   └── superadmin.ts       # APIs de administração
components/
├── signatures-page.tsx     # Página principal de assinaturas
├── signature-upload-modal.tsx # Modal de upload de assinaturas
└── instructors-page.tsx    # Página de instrutores
```

## Testando o Sistema

1. Inicie o servidor de desenvolvimento: `npm run dev`
2. Acesse: `http://localhost:3001`
3. Faça login como superadmin
4. Navegue para a página de instrutores
5. Clique na aba "Assinaturas"
6. Teste o upload de uma nova assinatura

## Possíveis Melhorias Futuras

- Implementar upload por drag & drop
- Adicionar crop de imagem
- Implementar compress de imagem automático
- Adicionar validação de dimensões de imagem
- Implementar upload em lote
