'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from "next/link"

export default function Home() {
  const [clientName, setClientName] = useState('')
  const [exercise, setExercise] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  async function saveEntry() {
    const rm =
      Number(weight) * (1 + Number(reps) / 30)

    const { error } = await supabase
      .from('rm_entries')
      .insert([
        {
          client_name: clientName,
          exercise: exercise,
          weight: Number(weight),
          reps: Number(reps),
          rm: Number(rm.toFixed(1)),
        },
      ])

    if (error) {
      console.log(error)
      alert('Erro ao guardar')
      return
    }

    alert('Registo guardado!')

    setClientName('')
    setExercise('')
    setWeight('')
    setReps('')
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="bg-zinc-900 p-8 rounded-3xl w-full max-w-xl space-y-5">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">
            PT RM Tracker
          </h1>

          <p className="text-zinc-400 mt-2">
            Novo registo de treino
          </p>
        </div>

        {/* BOTÃO DASHBOARD */}
        <Link
          href="/dashboard"
          className="block text-center bg-zinc-700 hover:bg-zinc-600 transition rounded-2xl p-3 font-semibold"
        >
          Ir para Dashboard 📊
        </Link>

        {/* INPUTS */}
        <input
          placeholder="Cliente"
          value={clientName}
          onChange={(e) =>
            setClientName(e.target.value)
          }
          className="w-full bg-zinc-800 rounded-2xl p-4"
        />

        <input
          placeholder="Exercício"
          value={exercise}
          onChange={(e) =>
            setExercise(e.target.value)
          }
          className="w-full bg-zinc-800 rounded-2xl p-4"
        />

        <input
          placeholder="Carga (kg)"
          type="number"
          value={weight}
          onChange={(e) =>
            setWeight(e.target.value)
          }
          className="w-full bg-zinc-800 rounded-2xl p-4"
        />

        <input
          placeholder="Repetições"
          type="number"
          value={reps}
          onChange={(e) =>
            setReps(e.target.value)
          }
          className="w-full bg-zinc-800 rounded-2xl p-4"
        />

        <button
          onClick={saveEntry}
          className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-2xl p-4 font-bold"
        >
          Guardar Registo
        </button>

      </div>
    </main>
  )
}