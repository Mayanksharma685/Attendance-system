import React, { useEffect, useState } from 'react'
import { Subject, StudentAttendance } from '../../models/Teacher'
import { teacherApi } from '../../api/teacherApi'

export default function QrPanel({ selected }: { selected: Subject | null }){
  const [qrId, setQrId] = useState<string | null>(null)
  const [payload, setPayload] = useState<string | null>(null)
  const [active, setActive] = useState(false)
  const [attendees, setAttendees] = useState<StudentAttendance[]>([])

  useEffect(()=>{
    let t:any
    if(active && qrId){
      // poll attendance every 2.5s (replace with websocket in real app)
      t = setInterval(async ()=>{
        try{
          const data = await teacherApi.getAttendance(qrId)
          setAttendees(data)
        }catch(e){
          // ignore in mock
        }
      }, 2500)
    }
    return ()=> clearInterval(t)
  },[active, qrId])

  const start = async ()=>{
    if(!selected) return alert('select subject')
    try{
      const res = await teacherApi.startQr(selected.code)
      setQrId(res.qrId || 'qr-mock-1')
      setPayload(res.payload || 'QR-MOCK-PAYLOAD')
      setActive(true)
    }catch(e){
      // fallback for mock
      setQrId('qr-mock-1')
      setPayload('QR-MOCK-PAYLOAD')
      setActive(true)
    }
  }

  const stop = async ()=>{
    if(!qrId) return
    try{
      await teacherApi.stopQr(qrId)
    }catch(e){}
    setActive(false)
    setQrId(null)
    setPayload(null)
    setAttendees([])
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">QR Panel</div>
          <div className="text-sm text-gray-500">{selected ? `${selected.code} - ${selected.title}` : 'No subject selected'}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={start} className="px-3 py-2 bg-gray-800 text-white rounded" disabled={!selected || active}>Start QR</button>
          <button onClick={stop} className="px-3 py-2 border rounded" disabled={!active}>Stop QR</button>
        </div>
      </div>

      <div className="mt-6 flex gap-6">
        <div className="w-96 h-96 bg-gray-50 rounded-lg flex items-center justify-center border relative">
          {active && payload ? (
            <>
              <div className="absolute top-3 right-3 text-xs text-gray-400">Live</div>
              <div className="text-center">
                <div className="font-mono text-sm mb-2">{payload}</div>
                <div className="w-56 h-56 bg-white border flex items-center justify-center">QR IMAGE</div>
              </div>
            </>
          ) : (
            <div className="text-gray-400">QR will occupy this space (full-screen in real app)</div>
          )}
        </div>

        <div className="flex-1 p-4 bg-gray-50 rounded border">
          <div className="font-semibold">Live Attendance</div>
          <div className="mt-3 space-y-2">
            {attendees.length===0 && <div className="text-sm text-gray-500">No attendees yet</div>}
            {attendees.map(a=>(
              <div key={a.studentId} className="p-2 rounded border flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-gray-500">{a.enrollment}</div>
                </div>
                <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Present</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
