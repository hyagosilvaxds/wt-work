// Script de teste para upload de fotos de classes
// Execute este script no console do navegador após fazer login no sistema

async function testClassPhotoUpload() {
  const classId = 'cm2abc123def' // Substitua pelo ID de uma turma real
  
  // Criar um arquivo de teste (simula seleção de arquivo)
  const createTestImageFile = () => {
    // Criar um canvas pequeno para gerar uma imagem de teste
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    
    // Desenhar algo simples
    ctx.fillStyle = '#4A90E2'
    ctx.fillRect(0, 0, 100, 100)
    ctx.fillStyle = 'white'
    ctx.font = '16px Arial'
    ctx.fillText('TEST', 35, 55)
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], 'test-photo.png', { type: 'image/png' })
        resolve(file)
      }, 'image/png')
    })
  }
  
  try {
    console.log('🔄 Iniciando teste de upload de foto...')
    
    // Criar arquivo de teste
    const testFile = await createTestImageFile()
    console.log('✅ Arquivo de teste criado:', testFile)
    
    // Fazer upload
    const formData = new FormData()
    formData.append('photo', testFile)
    formData.append('caption', 'Parte Prática')
    
    const token = localStorage.getItem('token') // ou sessionStorage dependendo da implementação
    
    const response = await fetch(`/superadmin/class-photos/upload/${classId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Upload realizado com sucesso:', result)
      
      // Testar busca de fotos
      const photosResponse = await fetch(`/superadmin/class-photos/class/${classId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (photosResponse.ok) {
        const photos = await photosResponse.json()
        console.log('✅ Fotos da turma carregadas:', photos)
        
        // Testar estatísticas
        const statsResponse = await fetch(`/superadmin/class-photos/class/${classId}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (statsResponse.ok) {
          const stats = await statsResponse.json()
          console.log('✅ Estatísticas carregadas:', stats)
        }
      }
      
      return result
    } else {
      const error = await response.json()
      console.error('❌ Erro no upload:', error)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('❌ Erro no teste:', error)
    throw error
  }
}

// Função para testar atualização de legenda
async function testUpdateCaption(photoId, newCaption = 'Parte Teórica') {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`/superadmin/class-photos/${photoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ caption: newCaption })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Legenda atualizada:', result)
      return result
    } else {
      const error = await response.json()
      console.error('❌ Erro ao atualizar legenda:', error)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('❌ Erro no teste de atualização:', error)
    throw error
  }
}

// Função para testar remoção de foto
async function testDeletePhoto(photoId) {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`/superadmin/class-photos/${photoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Foto removida:', result)
      return result
    } else {
      const error = await response.json()
      console.error('❌ Erro ao remover foto:', error)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('❌ Erro no teste de remoção:', error)
    throw error
  }
}

// Exemplo de uso:
// testClassPhotoUpload().then(result => {
//   console.log('Teste concluído:', result)
//   // Testar atualização da legenda
//   return testUpdateCaption(result.id, 'Parte Teórica')
// }).then(() => {
//   console.log('Todos os testes concluídos!')
// }).catch(error => {
//   console.error('Falha no teste:', error)
// })

console.log('📋 Funções de teste carregadas:')
console.log('- testClassPhotoUpload(): Testa upload de foto')
console.log('- testUpdateCaption(photoId, caption): Testa atualização de legenda')  
console.log('- testDeletePhoto(photoId): Testa remoção de foto')
console.log('')
console.log('💡 Para testar, execute: testClassPhotoUpload()')
