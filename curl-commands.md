# Comandos CURL para testar as funções de gerenciamento de alunos em turmas

## 📋 Pré-requisitos
- Substitua `TURMA_ID_AQUI` pelo ID real da turma
- Substitua `SEU_TOKEN_AQUI` pelo token de autenticação
- Substitua `STUDENT_ID_1`, `STUDENT_ID_2`, etc. pelos IDs reais dos alunos
- Ajuste a URL base se necessário (pode ser diferente de localhost:3000)

## 🔍 1. Obter dados para teste

### Listar turmas (para obter IDs)
```bash
curl -X GET 'http://localhost:3000/api/superadmin/classes?page=1&limit=10' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

### Listar alunos (para obter IDs)
```bash
curl -X GET 'http://localhost:3000/api/superadmin/students?page=1&limit=10' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

### Obter uma turma específica (para ver estrutura atual)
```bash
curl -X GET 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

## ➕ 2. Adicionar alunos a uma turma

### Adicionar múltiplos alunos
```bash
curl -X POST 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI/students' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "studentIds": ["STUDENT_ID_1", "STUDENT_ID_2", "STUDENT_ID_3"]
  }'
```

### Adicionar um único aluno
```bash
curl -X POST 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI/students' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "studentIds": ["STUDENT_ID_1"]
  }'
```

## ➖ 3. Remover alunos de uma turma

### Remover múltiplos alunos
```bash
curl -X DELETE 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI/students' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "studentIds": ["STUDENT_ID_1", "STUDENT_ID_2"]
  }'
```

### Remover um único aluno
```bash
curl -X DELETE 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI/students' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "studentIds": ["STUDENT_ID_1"]
  }'
```

## 🧪 4. Testes de validação

### Teste com array vazio (deve falhar)
```bash
curl -X DELETE 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI/students' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "studentIds": []
  }'
```

### Teste sem studentIds (deve falhar)
```bash
curl -X DELETE 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI/students' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{}'
```

### Teste com ID de turma inválido (deve falhar)
```bash
curl -X DELETE 'http://localhost:3000/api/superadmin/classes/ID_INEXISTENTE/students' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "studentIds": ["STUDENT_ID_1"]
  }'
```

### Teste com ID de aluno inválido (deve falhar)
```bash
curl -X DELETE 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI/students' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "studentIds": ["ID_INEXISTENTE"]
  }'
```

## 📊 5. Verificar resultados

### Verificar se os alunos foram removidos
```bash
curl -X GET 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

## 🔄 6. Fluxo completo de teste

### 1. Obter turma antes da modificação
```bash
curl -X GET 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

### 2. Adicionar alunos
```bash
curl -X POST 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI/students' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "studentIds": ["STUDENT_ID_1", "STUDENT_ID_2"]
  }'
```

### 3. Verificar se foram adicionados
```bash
curl -X GET 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

### 4. Remover alguns alunos
```bash
curl -X DELETE 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI/students' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "studentIds": ["STUDENT_ID_1"]
  }'
```

### 5. Verificar se foi removido
```bash
curl -X GET 'http://localhost:3000/api/superadmin/classes/TURMA_ID_AQUI' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

## 🛠️ Para usar no Postman:

1. **Método**: DELETE
2. **URL**: `http://localhost:3000/api/superadmin/classes/{classId}/students`
3. **Headers**:
   - `Content-Type: application/json`
   - `Authorization: Bearer SEU_TOKEN_AQUI`
4. **Body** (raw JSON):
   ```json
   {
     "studentIds": ["student_id_1", "student_id_2"]
   }
   ```

## 📋 Respostas esperadas:

### Sucesso (200):
```json
{
  "message": "Alunos removidos da turma com sucesso"
}
```

### Erro - Array vazio (400):
```json
{
  "message": "É necessário fornecer pelo menos um ID de estudante",
  "error": "Bad Request",
  "statusCode": 400
}
```

### Erro - Turma não encontrada (404):
```json
{
  "message": "Turma não encontrada",
  "error": "Not Found",
  "statusCode": 404
}
```

### Erro - Aluno não encontrado (400):
```json
{
  "message": "Um ou mais estudantes não encontrados",
  "error": "Bad Request",
  "statusCode": 400
}
```
