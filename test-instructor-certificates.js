// Script para testar as APIs de certificados do instrutor
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testInstructorCertificates() {
  try {
    console.log('=== TESTANDO CERTIFICADOS DO INSTRUTOR ===\n')
    
    // 1. Buscar um usuário instrutor
    const instructorUser = await prisma.user.findFirst({
      where: {
        userRoles: {
          some: {
            role: {
              name: 'INSTRUTOR'
            }
          }
        }
      },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })
    
    if (!instructorUser) {
      console.log('❌ Nenhum usuário instrutor encontrado')
      return
    }
    
    console.log('✅ Usuário instrutor encontrado:', {
      id: instructorUser.id,
      name: instructorUser.name,
      email: instructorUser.email,
      role: instructorUser.role.name
    })
    
    // 2. Buscar o registro de instrutor associado ao usuário
    const instructor = await prisma.instructor.findFirst({
      where: {
        userId: instructorUser.id
      }
    })
    
    if (!instructor) {
      console.log('❌ Registro de instrutor não encontrado para este usuário')
      return
    }
    
    console.log('✅ Registro de instrutor encontrado:', {
      id: instructor.id,
      name: instructor.name,
      userId: instructor.userId
    })
    
    // 3. Buscar turmas do instrutor
    const instructorClasses = await prisma.class.findMany({
      where: {
        instructorId: instructor.id
      },
      include: {
        training: true,
        client: true,
        instructor: true,
        students: true
      }
    })
    
    console.log(`\n✅ Turmas do instrutor encontradas: ${instructorClasses.length}`)
    
    instructorClasses.forEach((classItem, index) => {
      console.log(`\n--- Turma ${index + 1} ---`)
      console.log(`ID: ${classItem.id}`)
      console.log(`Treinamento: ${classItem.training.title}`)
      console.log(`Cliente: ${classItem.client?.name || 'N/A'}`)
      console.log(`Instrutor: ${classItem.instructor?.name || 'N/A'}`)
      console.log(`Status: ${classItem.status}`)
      console.log(`Estudantes: ${classItem.students?.length || 0}`)
      console.log(`Data início: ${classItem.startDate}`)
      console.log(`Data fim: ${classItem.endDate}`)
    })
    
    // 4. Buscar turmas finalizadas especificamente
    const finishedClasses = await prisma.class.findMany({
      where: {
        instructorId: instructor.id,
        status: 'FINISHED'
      },
      include: {
        training: true,
        client: true,
        instructor: true,
        students: {
          include: {
            attendances: true
          }
        }
      }
    })
    
    console.log(`\n✅ Turmas finalizadas do instrutor: ${finishedClasses.length}`)
    
    finishedClasses.forEach((classItem, index) => {
      console.log(`\n--- Turma Finalizada ${index + 1} ---`)
      console.log(`ID: ${classItem.id}`)
      console.log(`Treinamento: ${classItem.training.title}`)
      console.log(`Cliente: ${classItem.client?.name || 'N/A'}`)
      console.log(`Instrutor: ${classItem.instructor?.name || 'N/A'}`)
      console.log(`Estudantes: ${classItem.students?.length || 0}`)
    })
    
    // 5. Verificar se há outras turmas finalizadas no sistema
    const allFinishedClasses = await prisma.class.findMany({
      where: {
        status: 'FINISHED'
      },
      include: {
        training: true,
        client: true,
        instructor: true
      }
    })
    
    console.log(`\n📊 Total de turmas finalizadas no sistema: ${allFinishedClasses.length}`)
    
    const otherInstructorClasses = allFinishedClasses.filter(c => c.instructorId !== instructor.id)
    console.log(`📊 Turmas finalizadas de outros instrutores: ${otherInstructorClasses.length}`)
    
    if (otherInstructorClasses.length > 0) {
      console.log('\n⚠️  OUTRAS TURMAS FINALIZADAS (que não deveriam aparecer para este instrutor):')
      otherInstructorClasses.forEach((classItem, index) => {
        console.log(`${index + 1}. ${classItem.training.title} - Instrutor: ${classItem.instructor?.name || 'N/A'} (ID: ${classItem.instructorId})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testInstructorCertificates()
