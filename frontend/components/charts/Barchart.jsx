// minimal bar chart if needed
'use client'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function BarChart({ labels = [], values = [], height = 240 }) {
  const data = { labels, datasets: [{ label: 'Count', data: values }] }
  return <div style={{ height }}><Bar data={data} options={{ maintainAspectRatio: false }} /></div>
}
