import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Activity, DollarSign, Users, FileText, TrendingUp } from 'lucide-react';
import { KPIStats, ChartDataPoint } from '../types';
import { MOCK_REVENUE_DATA, MOCK_INSURANCE_DISTRIBUTION } from '../constants';

interface DashboardProps {
  stats: KPIStats;
}

const COLORS = ['#0ea5e9', '#0284c7', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(value);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">SIA & Dashboard Operasional</h2>
        <p className="text-slate-500">Tinjauan Keuangan dan Statistik SIMRS Real-time</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Pendapatan (Bulan Ini)</p>
            <h3 className="text-xl font-bold text-slate-800">{formatCurrency(stats.revenue)}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Okupansi Tempat Tidur</p>
            <h3 className="text-xl font-bold text-slate-800">{stats.bedOccupancy}%</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Pasien Hari Ini</p>
            <h3 className="text-xl font-bold text-slate-800">{stats.patientsToday}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Klaim BPJS Pending</p>
            <h3 className="text-xl font-bold text-slate-800">{stats.pendingClaims}</h3>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <TrendingUp size={18} /> Tren Pendapatan & Pasien (SIA)
            </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis yAxisId="left" orientation="left" stroke="#0ea5e9" axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Pendapatan (Juta IDR)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="patients" name="Jumlah Pasien" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insurance Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <FileText size={18} /> Komposisi Penjamin
            </h3>
           <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_INSURANCE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_INSURANCE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* FHIR Interoperability Note */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center text-sm text-blue-800">
        <p className="font-medium">Status Interoperabilitas:</p>
        <p>Sistem terhubung dengan SATUSEHAT (Kemenkes) menggunakan standar <span className="font-mono font-bold bg-blue-100 px-1 rounded">HL7 FHIR R4</span>.</p>
      </div>

    </div>
  );
};

export default Dashboard;