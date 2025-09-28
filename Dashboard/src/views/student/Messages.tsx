import React, { useEffect, useState } from 'react'
import { studentApi } from '../../api/studentApi'

export default function Messages(){
  const [messages, setMessages] = useState<any[]>([])
  useEffect(()=>{
    async function load(){
      try{
        const m = await studentApi.getMessages()
        setMessages(m)
      }catch(e){
        setMessages([
          {id:1, from:'Admin', subject:'Welcome', body:'Welcome to the portal.'}
        ])
      }
    }
    load()
  },[])
  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="text-lg font-semibold mb-4">Messages</div>
      {messages.map(m=>(
        <div key={m.id} className="p-3 border-b">
          <div className="font-medium">{m.from} — {m.subject}</div>
          <div className="text-sm text-gray-600">{m.body}</div>
        </div>
      ))}
    </div>
  )
}
