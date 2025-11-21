# PENDENTE: Migração de Endpoint - Turmas do Cliente

## ⚠️ Status: BACKEND PRECISA IMPLEMENTAR

### Situação Atual

**Frontend está configurado para:**
```typescript
GET /client-dashboard/classes?page=1&limit=10&search=...&status=...
```

**Backend atualmente responde em:**
```
GET /superadmin/my-classes?page=1&limit=10&search=...&status=...
```

### ❌ Problema

O sistema está **temporariamente funcional** porque:
1. Frontend chama `/client-dashboard/classes`
2. Mas backend ainda não implementou esse endpoint
3. Provavelmente há um fallback ou redirecionamento para `/superadmin/my-classes`

**Isso causa:**
- ❌ Inconsistência na arquitetura da API
- ❌ Endpoint "superadmin" sendo usado por clientes
- ❌ Semântica incorreta (cliente não é superadmin)
- ❌ Dificuldade de manutenção futura

### ✅ Solução Necessária (BACKEND)

#### 1. Criar Novo Endpoint

**Arquivo:** `src/controllers/client-dashboard.controller.ts` (ou similar)

```typescript
import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('client-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientDashboardController {
  constructor(
    private readonly clientDashboardService: ClientDashboardService
  ) {}

  @Get('classes')
  @Roles('CLIENTE')
  async getClasses(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: 'completed' | 'ongoing'
  ) {
    const userId = req.user.id;
    
    // 1. Buscar clientId do usuário
    const user = await this.usersService.findOne(userId);
    
    if (!user.clientId) {
      throw new UnauthorizedException('Usuário não está vinculado a nenhum cliente');
    }
    
    // 2. Buscar turmas do cliente com paginação
    return this.clientDashboardService.getClasses({
      clientId: user.clientId,
      page: Number(page),
      limit: Number(limit),
      search,
      status
    });
  }
}
```

#### 2. Implementar Service

**Arquivo:** `src/services/client-dashboard.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientDashboardService {
  constructor(private prisma: PrismaService) {}

  async getClasses(params: {
    clientId: string
    page: number
    limit: number
    search?: string
    status?: 'completed' | 'ongoing'
  }) {
    const { clientId, page, limit, search, status } = params;
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {
      clientId: clientId
    };

    // Filtro de busca (training title, instructor name, location)
    if (search) {
      where.OR = [
        {
          training: {
            title: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          instructor: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          location: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    // Filtro de status
    if (status === 'completed') {
      where.status = 'CONCLUIDO';
    } else if (status === 'ongoing') {
      where.status = {
        in: ['EM_ANDAMENTO', 'AGENDADA']
      };
    }

    // Buscar turmas com paginação
    const [classes, total] = await Promise.all([
      this.prisma.class.findMany({
        where,
        skip,
        take: limit,
        include: {
          training: {
            select: {
              id: true,
              title: true
            }
          },
          instructor: {
            select: {
              id: true,
              name: true
            }
          },
          lessons: {
            select: {
              id: true
            }
          },
          _count: {
            select: {
              studentClasses: true,
              lessons: true
            }
          }
        },
        orderBy: {
          startDate: 'desc'
        }
      }),
      this.prisma.class.count({ where })
    ]);

    // Formatar resposta
    const formattedClasses = classes.map(cls => ({
      id: cls.id,
      trainingId: cls.training.id,
      trainingTitle: cls.training.title,
      instructorId: cls.instructor.id,
      instructorName: cls.instructor.name,
      startDate: cls.startDate.toISOString(),
      endDate: cls.endDate.toISOString(),
      location: cls.location,
      status: this.formatStatus(cls.status),
      closingDate: cls.closingDate?.toISOString() || null,
      totalStudents: cls._count.studentClasses,
      totalLessons: cls._count.lessons,
      completedLessons: await this.getCompletedLessonsCount(cls.id),
      createdAt: cls.createdAt.toISOString(),
      updatedAt: cls.updatedAt.toISOString()
    }));

    return {
      classes: formattedClasses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  private formatStatus(status: string): string {
    const statusMap = {
      'AGENDADA': 'Agendada',
      'EM_ANDAMENTO': 'Em andamento',
      'CONCLUIDO': 'Concluída',
      'ENCERRADA': 'Encerrada'
    };
    return statusMap[status] || status;
  }

  private async getCompletedLessonsCount(classId: string): Promise<number> {
    // Contar aulas que já foram dadas (endTime no passado)
    const now = new Date();
    return this.prisma.lesson.count({
      where: {
        classId,
        endTime: {
          lt: now
        }
      }
    });
  }
}
```

#### 3. Registrar no Module

**Arquivo:** `src/app.module.ts` ou `src/client-dashboard/client-dashboard.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ClientDashboardController } from './controllers/client-dashboard.controller';
import { ClientDashboardService } from './services/client-dashboard.service';

@Module({
  controllers: [ClientDashboardController],
  providers: [ClientDashboardService],
  exports: [ClientDashboardService]
})
export class ClientDashboardModule {}
```

#### 4. Remover/Depreciar Endpoint Antigo

```typescript
// NO FUTURO, após migração completa:
// Remover ou marcar como deprecated o endpoint /superadmin/my-classes
// usado apenas por clientes

@Get('my-classes')
@Deprecated('Use /client-dashboard/classes instead')
async getMyClassesDeprecated() {
  throw new GoneException('This endpoint has been moved to /client-dashboard/classes');
}
```

### 📋 Especificação Completa do Endpoint

#### GET /client-dashboard/classes

**Autenticação:** JWT token obrigatório

**Autorização:** Role `CLIENTE` obrigatório

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Query Parameters:**

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|---------|-----------|
| `page` | number | Não | 1 | Número da página (começa em 1) |
| `limit` | number | Não | 10 | Itens por página (máximo recomendado: 50) |
| `search` | string | Não | - | Busca por título do treinamento, nome do instrutor ou localização (case-insensitive) |
| `status` | enum | Não | - | Filtro: `completed` (concluídas) ou `ongoing` (em andamento/agendadas) |

**Exemplos de Requisições:**

```http
# Básico - primeira página
GET /client-dashboard/classes?page=1&limit=10

# Com busca
GET /client-dashboard/classes?page=1&limit=10&search=NR-35

# Com filtro de status
GET /client-dashboard/classes?page=1&limit=10&status=completed

# Busca + filtro
GET /client-dashboard/classes?page=1&limit=10&search=NR-10&status=ongoing

# Segunda página
GET /client-dashboard/classes?page=2&limit=10
```

**Resposta de Sucesso (200 OK):**

```json
{
  "classes": [
    {
      "id": "cmi91x3k205sjjrwqiv0vt3kz",
      "trainingId": "cmdi1eeml001xjkump5x2z0iw",
      "trainingTitle": "NR-35 - Trabalho em Altura",
      "instructorId": "instructor-uuid",
      "instructorName": "João Silva",
      "startDate": "2025-11-01T08:00:00.000Z",
      "endDate": "2025-11-05T17:00:00.000Z",
      "location": "São Paulo - SP",
      "status": "Concluída",
      "closingDate": "2025-11-05T18:00:00.000Z",
      "totalStudents": 25,
      "totalLessons": 4,
      "completedLessons": 4,
      "createdAt": "2025-11-21T14:51:22.110Z",
      "updatedAt": "2025-11-21T14:51:22.110Z"
    }
    // ... mais 9 turmas
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 486,
    "totalPages": 49
  }
}
```

**Erros Possíveis:**

| Status | Código | Mensagem | Quando Ocorre |
|--------|--------|----------|---------------|
| 401 | UNAUTHORIZED | "Unauthorized" | Token inválido ou ausente |
| 401 | UNAUTHORIZED | "Apenas usuários com perfil de cliente podem acessar esta informação" | Usuário não tem role CLIENTE |
| 401 | UNAUTHORIZED | "Usuário não está vinculado a nenhum cliente" | user.clientId é null |
| 404 | NOT_FOUND | "Usuário não encontrado" | userId do token não existe no banco |
| 400 | BAD_REQUEST | "Invalid query parameters" | Parâmetros inválidos (ex: page=0, limit=-1) |

### 🔄 Plano de Migração

#### Fase 1: ✅ CONCLUÍDO (Frontend)
- [x] Frontend configurado para chamar `/client-dashboard/classes`
- [x] Interfaces TypeScript definidas
- [x] Componente usando a função correta
- [x] Documentação criada

#### Fase 2: ⚠️ PENDENTE (Backend)
- [ ] Criar `ClientDashboardController`
- [ ] Implementar `ClientDashboardService`
- [ ] Adicionar validação de role CLIENTE
- [ ] Implementar filtros (search, status)
- [ ] Implementar paginação correta
- [ ] Testes unitários e de integração
- [ ] Documentar no Swagger/OpenAPI

#### Fase 3: 🔮 FUTURO (Limpeza)
- [ ] Verificar se algum outro código usa `/superadmin/my-classes`
- [ ] Marcar endpoint antigo como deprecated
- [ ] Remover endpoint antigo após período de transição
- [ ] Atualizar documentação da API

### 🧪 Testes Necessários (Backend)

#### Teste 1: Autenticação e Autorização
```typescript
describe('GET /client-dashboard/classes', () => {
  it('deve retornar 401 sem token', async () => {
    const response = await request(app.getHttpServer())
      .get('/client-dashboard/classes')
      .expect(401);
  });

  it('deve retornar 401 se usuário não é CLIENTE', async () => {
    const adminToken = await getAdminToken();
    const response = await request(app.getHttpServer())
      .get('/client-dashboard/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(401);
    
    expect(response.body.message).toContain('perfil de cliente');
  });

  it('deve retornar 401 se usuário não tem clientId', async () => {
    const userWithoutClient = await createUserWithoutClient();
    const token = generateToken(userWithoutClient);
    
    const response = await request(app.getHttpServer())
      .get('/client-dashboard/classes')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
    
    expect(response.body.message).toContain('não está vinculado');
  });
});
```

#### Teste 2: Paginação
```typescript
it('deve retornar 10 turmas na primeira página', async () => {
  const clientToken = await getClientToken();
  const response = await request(app.getHttpServer())
    .get('/client-dashboard/classes?page=1&limit=10')
    .set('Authorization', `Bearer ${clientToken}`)
    .expect(200);
  
  expect(response.body.classes).toHaveLength(10);
  expect(response.body.pagination).toEqual({
    page: 1,
    limit: 10,
    total: expect.any(Number),
    totalPages: expect.any(Number)
  });
});

it('deve retornar página vazia se page > totalPages', async () => {
  const clientToken = await getClientToken();
  const response = await request(app.getHttpServer())
    .get('/client-dashboard/classes?page=9999&limit=10')
    .set('Authorization', `Bearer ${clientToken}`)
    .expect(200);
  
  expect(response.body.classes).toHaveLength(0);
});
```

#### Teste 3: Busca
```typescript
it('deve filtrar por título do treinamento', async () => {
  const clientToken = await getClientToken();
  const response = await request(app.getHttpServer())
    .get('/client-dashboard/classes?search=NR-35')
    .set('Authorization', `Bearer ${clientToken}`)
    .expect(200);
  
  response.body.classes.forEach(cls => {
    expect(cls.trainingTitle.toLowerCase()).toContain('nr-35');
  });
});

it('deve filtrar por nome do instrutor', async () => {
  const clientToken = await getClientToken();
  const response = await request(app.getHttpServer())
    .get('/client-dashboard/classes?search=João')
    .set('Authorization', `Bearer ${clientToken}`)
    .expect(200);
  
  response.body.classes.forEach(cls => {
    expect(cls.instructorName.toLowerCase()).toContain('joão');
  });
});
```

#### Teste 4: Filtro de Status
```typescript
it('deve retornar apenas turmas concluídas', async () => {
  const clientToken = await getClientToken();
  const response = await request(app.getHttpServer())
    .get('/client-dashboard/classes?status=completed')
    .set('Authorization', `Bearer ${clientToken}`)
    .expect(200);
  
  response.body.classes.forEach(cls => {
    expect(cls.status).toBe('Concluída');
  });
});

it('deve retornar turmas em andamento e agendadas', async () => {
  const clientToken = await getClientToken();
  const response = await request(app.getHttpServer())
    .get('/client-dashboard/classes?status=ongoing')
    .set('Authorization', `Bearer ${clientToken}`)
    .expect(200);
  
  response.body.classes.forEach(cls => {
    expect(['Em andamento', 'Agendada']).toContain(cls.status);
  });
});
```

#### Teste 5: Isolamento de Dados
```typescript
it('deve retornar apenas turmas do cliente autenticado', async () => {
  // Criar dois clientes com turmas
  const client1 = await createClientWithClasses(5);
  const client2 = await createClientWithClasses(3);
  
  const token1 = await getClientToken(client1.userId);
  const response1 = await request(app.getHttpServer())
    .get('/client-dashboard/classes')
    .set('Authorization', `Bearer ${token1}`)
    .expect(200);
  
  // Cliente 1 deve ver apenas suas 5 turmas
  expect(response1.body.pagination.total).toBe(5);
  
  const token2 = await getClientToken(client2.userId);
  const response2 = await request(app.getHttpServer())
    .get('/client-dashboard/classes')
    .set('Authorization', `Bearer ${token2}`)
    .expect(200);
  
  // Cliente 2 deve ver apenas suas 3 turmas
  expect(response2.body.pagination.total).toBe(3);
});
```

### 📊 Comparação: Endpoint Antigo vs Novo

| Aspecto | `/superadmin/my-classes` | `/client-dashboard/classes` |
|---------|--------------------------|----------------------------|
| **Localização** | SuperAdminController | ClientDashboardController |
| **Semântica** | ❌ Incorreta (cliente não é admin) | ✅ Correta (dashboard do cliente) |
| **Autorização** | Provavelmente genérica | ✅ Role CLIENTE específica |
| **Manutenibilidade** | ❌ Dificulta expansão | ✅ Organizado por contexto |
| **Documentação** | ❌ Confusa | ✅ Clara |
| **Escalabilidade** | ❌ Mistura concerns | ✅ Separação de responsabilidades |

### 🎯 Benefícios da Migração

#### 1. **Organização da API**
```
Antes:
/superadmin/my-classes         (cliente)
/superadmin/other-endpoint     (admin)
/superadmin/another-endpoint   (admin)

Depois:
/client-dashboard/classes      (cliente)
/client-dashboard/statistics   (cliente)
/client-dashboard/lessons      (cliente)
/superadmin/users              (admin)
/superadmin/reports            (admin)
```

#### 2. **Segurança Melhorada**
- Validação de role específica (CLIENTE)
- Isolamento de dados por clientId
- Logs mais claros (quem acessou o quê)

#### 3. **Facilita Expansão**
```typescript
// Fácil adicionar novos endpoints relacionados ao cliente:
/client-dashboard/classes
/client-dashboard/statistics
/client-dashboard/lessons
/client-dashboard/eligible-classes
/client-dashboard/certificates
```

#### 4. **Documentação Clara**
- Swagger/OpenAPI melhor organizado
- Desenvolvedores entendem imediatamente o propósito
- Clientes sabem quais endpoints usar

### ⚡ Checklist de Implementação (Backend)

```markdown
## Backend: Implementar /client-dashboard/classes

### Setup Inicial
- [ ] Criar pasta `src/client-dashboard/`
- [ ] Criar `client-dashboard.module.ts`
- [ ] Criar `client-dashboard.controller.ts`
- [ ] Criar `client-dashboard.service.ts`
- [ ] Registrar módulo no `app.module.ts`

### Controller
- [ ] Criar endpoint GET /client-dashboard/classes
- [ ] Adicionar decorator @Roles('CLIENTE')
- [ ] Adicionar guards (JwtAuthGuard, RolesGuard)
- [ ] Validar query parameters
- [ ] Documentar com Swagger decorators

### Service
- [ ] Implementar getClasses()
- [ ] Validar usuário tem clientId
- [ ] Implementar filtro de search (training, instructor, location)
- [ ] Implementar filtro de status (completed, ongoing)
- [ ] Implementar paginação (skip, take)
- [ ] Formatar resposta conforme interface
- [ ] Calcular completedLessons

### Testes
- [ ] Teste de autenticação (401 sem token)
- [ ] Teste de autorização (401 se não CLIENTE)
- [ ] Teste de paginação (10 por página)
- [ ] Teste de busca (training, instructor, location)
- [ ] Teste de filtro de status
- [ ] Teste de isolamento de dados (cliente vê só suas turmas)
- [ ] Teste de performance (486 turmas)

### Deploy
- [ ] Testar em ambiente de desenvolvimento
- [ ] Testar em staging
- [ ] Migrar dados se necessário
- [ ] Deploy em produção
- [ ] Verificar logs de erro
- [ ] Monitorar performance

### Limpeza (Opcional)
- [ ] Marcar /superadmin/my-classes como deprecated
- [ ] Adicionar mensagem de redirecionamento
- [ ] Aguardar período de transição
- [ ] Remover endpoint antigo
```

### 📞 Comunicação com Time Backend

**Mensagem sugerida:**

```markdown
Olá time de backend! 👋

O frontend da tela "Minhas Turmas" do cliente está configurado para chamar:

`GET /client-dashboard/classes?page=1&limit=10&search=...&status=...`

Atualmente o sistema responde em `/superadmin/my-classes`, mas precisamos migrar para o endpoint correto conforme a arquitetura.

📄 Documentação completa:
- Arquivo: CLIENT_CLASSES_ENDPOINT_MIGRATION.md
- Contém: especificação completa, código de exemplo, testes sugeridos

✅ Frontend já está pronto e aguardando o novo endpoint!

Podem revisar a documentação e me avisar se tiverem dúvidas ou sugestões?

Obrigado! 🚀
```

## Data de Criação
21 de novembro de 2025

## Status
⚠️ **AGUARDANDO IMPLEMENTAÇÃO NO BACKEND**
