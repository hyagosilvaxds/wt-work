'use client'

import { useEffect, useState } from 'react'
import { getTrainings, getClients, getLightInstructors } from '@/lib/api/superadmin'

export function ApiTestComponent() {
  const [data, setData] = useState<any>({})

  useEffect(() => {
    const testApis = async () => {
      try {
        console.log('🧪 Testando APIs...')
        
        const trainings = await getTrainings(1, 10)
        console.log('✅ Treinamentos:', trainings)
        
        const clients = await getClients(1, 10)
        console.log('✅ Clientes:', clients)
        
        const instructors = await getLightInstructors()
        console.log('✅ Instrutores:', instructors)
        
        setData({ trainings, clients, instructors })
      } catch (error) {
        console.error('❌ Erro nas APIs:', error)
      }
    }
    
    testApis()
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Teste de APIs</h3>
      <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
