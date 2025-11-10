'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import React from 'react';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineChart = ({ data }) => {
  // ✅ Add a safety check for data
  if (!data || !data.months || !data.income) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading chart data...
      </div>
    );
  }

  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: 'Income',
        data: data.income,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: data.expenses,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
    },
    scales: {
      x: { grid: { color: 'rgba(200, 200, 200, 0.1)' } },
      y: { grid: { color: 'rgba(200, 200, 200, 0.1)' } },
    },
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
