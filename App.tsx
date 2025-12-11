import React, { useState } from 'react';
import { LayoutDashboard, MessageSquareText, Settings, Activity, Menu, X, Hospital } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import { INITIAL_STATS } from './constants';

enum ViewState {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  SETTINGS = 'settings'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false); // Close sidebar on mobile after click
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Hospital size={24} />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg">SIMRS AI</h1>
              <p className="text-xs text-slate-500">Sistem Cerdas RS</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Menu Utama</div>
            <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard & SIA" />
            <NavItem view={ViewState.CHAT} icon={MessageSquareText} label="Agen Cerdas" />
            
            <div className="mt-8 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Sistem</div>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-not-allowed opacity-60">
               <Activity size={20} />
               <span>Status FHIR</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-not-allowed opacity-60">
               <Settings size={20} />
               <span>Pengaturan</span>
            </button>
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 font-medium mb-1">Status Koneksi</p>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-slate-700">Online & Aman</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Top Header (Mobile Only for Menu) */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center lg:hidden z-10">
          <button onClick={toggleSidebar} className="text-slate-600 hover:text-slate-900">
             {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="ml-4 font-semibold text-slate-800">SIMRS AI Dashboard</span>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {currentView === ViewState.DASHBOARD && (
            <Dashboard stats={INITIAL_STATS} />
          )}
          {currentView === ViewState.CHAT && (
            <div className="h-full p-4 lg:p-6 max-w-5xl mx-auto">
              <ChatInterface initialMessage="Halo, saya adalah Sistem Koordinator Rumah Sakit. Apa yang bisa saya bantu hari ini? (Contoh: Pendaftaran pasien, Cek pendapatan, Informasi medis)" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;