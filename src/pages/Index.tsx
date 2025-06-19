
import { useState } from 'react';
import { Ship, DollarSign, CheckCircle, Plus, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GalanganList from '@/components/GalanganList';
import SetorList from '@/components/SetorList';
import LunasList from '@/components/LunasList';
import AddGalanganForm from '@/components/AddGalanganForm';
import AddSetorForm from '@/components/AddSetorForm';
import AddLunasForm from '@/components/AddLunasForm';

const Index = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'bg-blue-500' },
    { id: 'galangan', label: 'Galangan', icon: Ship, color: 'bg-green-500' },
    { id: 'setor', label: 'Setor', icon: DollarSign, color: 'bg-yellow-500' },
    { id: 'lunas', label: 'Lunas', icon: CheckCircle, color: 'bg-purple-500' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardContent />;
      case 'galangan':
        return showAddForm ? (
          <AddGalanganForm onClose={() => setShowAddForm(false)} />
        ) : (
          <GalanganList onAdd={() => setShowAddForm(true)} />
        );
      case 'setor':
        return showAddForm ? (
          <AddSetorForm onClose={() => setShowAddForm(false)} />
        ) : (
          <SetorList onAdd={() => setShowAddForm(true)} />
        );
      case 'lunas':
        return showAddForm ? (
          <AddLunasForm onClose={() => setShowAddForm(false)} />
        ) : (
          <LunasList onAdd={() => setShowAddForm(true)} />
        );
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🚢 Monitoring Galangan
            </h1>
            <p className="text-gray-600">Sistem Manajemen Galangan Kapal</p>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  activeMenu === item.id
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => {
                  setActiveMenu(item.id);
                  setShowAddForm(false);
                }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{item.label}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Ringkasan status galangan kapal</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="w-5 h-5" />
              Total Galangan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-blue-100">Proyek aktif</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Total Setor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-green-100">Pembayaran tercatat</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Belum Lunas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-purple-100">Menunggu pelunasan</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status Proyek Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold">KM Bahari Jaya</h4>
                <p className="text-sm text-gray-600">Kapal Cargo - PT Pelayaran Nusantara</p>
              </div>
              <Badge variant="secondary">Ongoing</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold">KM Sinar Laut</h4>
                <p className="text-sm text-gray-600">Kapal Penumpang - CV Transportasi Laut</p>
              </div>
              <Badge variant="secondary">Ongoing</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold">KM Nelayan Sejahtera</h4>
                <p className="text-sm text-gray-600">Kapal Ikan - Koperasi Nelayan</p>
              </div>
              <Badge variant="secondary">Ongoing</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
