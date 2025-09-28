import React from 'react'
import { Subject } from '../../models/Teacher'

export default function Subjects({subjects, onSelect}:{subjects:Subject[], onSelect:(s:Subject)=>void}){
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="font-semibold mb-3">Subjects</div>
      <div className="space-y-3">
        {subjects.map(s=>(
          <div key={s.code} onClick={()=>onSelect(s)} className="p-3 rounded border cursor-pointer hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium">{s.code}</div>
              <div className="text-xs text-gray-500">2cr</div>
            </div>
            <div className="text-sm text-gray-600">{s.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
