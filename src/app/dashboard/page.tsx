"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function Dashboard() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [clientFilter, setClientFilter] = useState("all")
  const [exerciseFilter, setExerciseFilter] = useState("all")

  // 🔄 FETCH SUPABASE
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("rm_entries")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.log(error)
      }

      setEntries(data || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  // 👤 CLIENTES ÚNICOS
  const clients = Array.from(
    new Set(entries.map((e) => e.client_name))
  )

  // 🏋️ EXERCÍCIOS ÚNICOS
  const exercises = Array.from(
    new Set(entries.map((e) => e.exercise))
  )

  // 🔎 FILTRO COMBINADO
  const filteredEntries = entries
    .filter((e) =>
      clientFilter === "all" ? true : e.client_name === clientFilter
    )
    .filter((e) =>
      exerciseFilter === "all" ? true : e.exercise === exerciseFilter
    )

  // 📈 DADOS DO GRÁFICO
  const chartData = filteredEntries
    .map((entry) => ({
      date: new Date(entry.created_at).toLocaleDateString(),
      rm: entry.rm,
    }))
    .reverse()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* LOADING */}
      {loading && (
        <p className="mt-4 text-gray-500">A carregar dados...</p>
      )}

      {/* FILTROS */}
      {!loading && (
        <div className="mt-4 flex gap-3 flex-wrap">
          {/* CLIENTE */}
          <select
            className="bg-black text-white border border-zinc-700 p-2 rounded"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          >
            <option value="all">Todos os clientes</option>

            {clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* EXERCÍCIO */}
          <select
            className="bg-black text-white border border-zinc-700 p-2 rounded"
            value={exerciseFilter}
            onChange={(e) => setExerciseFilter(e.target.value)}
          >
            <option value="all">Todos os exercícios</option>

            {exercises.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* GRÁFICO */}
      {!loading && (
        <div className="mt-6 border p-4 rounded-lg">
          <h2 className="font-bold mb-4">
            Evolução do RM
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="rm"
                stroke="#ffffff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* TABELA */}
      {!loading && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border rounded-lg">
            <thead>
              <tr className="bg-black text-white">
                <th className="text-left p-3">Cliente</th>
                <th className="text-left p-3">Exercício</th>
                <th className="text-left p-3">RM</th>
                <th className="text-left p-3">Data</th>
              </tr>
            </thead>

            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="p-3 font-medium">
                    {entry.client_name}
                  </td>

                  <td className="p-3">
                    {entry.exercise}
                  </td>

                  <td className="p-3">
                    {entry.rm} kg
                  </td>

                  <td className="p-3 text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* SEM DADOS */}
          {filteredEntries.length === 0 && (
            <p className="mt-4 text-gray-500">
              Sem registos para estes filtros
            </p>
          )}
        </div>
      )}
    </div>
  )
}