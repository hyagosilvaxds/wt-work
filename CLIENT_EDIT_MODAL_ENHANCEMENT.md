# Aprimoramento do Modal de Edição de Clientes

## Resumo das Alterações

O modal de edição de clientes foi atualizado para incluir todos os campos presentes no modal de criação de clientes, garantindo consistência e funcionalidade completa.

## Campos Adicionados

### 1. Registros Fiscais (apenas para Pessoa Jurídica)
- **Inscrição Municipal**: Campo para inscrição municipal da empresa
- **Inscrição Estadual**: Campo para inscrição estadual da empresa

Estes campos são exibidos condicionalmente apenas quando o tipo de pessoa é "JURIDICA".

### 2. Informações de Endereço
- **CEP**: Código postal
- **Endereço**: Logradouro completo
- **Número**: Número do imóvel
- **Bairro**: Bairro do endereço
- **Cidade**: Cidade
- **Estado**: Estado (UF)

### 3. Informações de Contato Expandidas
- **Email**: Email principal do cliente
- **Telefone Fixo**: Código de área + número do telefone fixo
- **Telefone Celular**: Código de área + número do celular
- **Nome do Responsável**: Nome da pessoa responsável pelo contato
- **Email do Responsável**: Email específico do responsável
- **Telefone do Responsável**: Telefone direto do responsável

### 4. Informações Adicionais
- **Observações**: Campo de texto livre para anotações sobre o cliente

## Estrutura dos Campos de Telefone

Os campos de telefone foram implementados com uma estrutura separada:
- Campo pequeno para **código de área** (máximo 2 dígitos)
- Campo maior para **número do telefone** (formato: 99999-9999)

## Validações e Comportamentos

### Registros Fiscais
- Os campos de inscrição municipal e estadual só aparecem quando "Pessoa Jurídica" está selecionada
- Campos opcionais, não obrigatórios

### Campos de Telefone
- Separação clara entre código de área e número
- Placeholders informativos para orientar o preenchimento
- Campos opcionais

## Compatibilidade

As alterações são totalmente compatíveis com:
- Backend existente (todos os campos já existem na interface `CreateClientData`)
- Funcionalidade de atualização (`UpdateClientData`)
- Sistema de validação existente

## Interface Unificada

Agora tanto o modal de **criação** quanto o de **edição** de clientes possuem exatamente os mesmos campos, proporcionando:
- Experiência de usuário consistente
- Possibilidade de editar qualquer informação do cliente
- Melhor organização visual com seções claras:
  - Informações Básicas
  - Registros Fiscais (quando aplicável)
  - Endereço
  - Contatos
  - Observações

## Resultado

O modal de edição de clientes agora permite modificar todas as informações que podem ser inseridas durante a criação, eliminando limitações anteriores e oferecendo funcionalidade completa para gerenciamento de dados dos clientes.
