
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Ship, Calendar, User, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface GalanganListProps {
  onAdd: () => void;
}

const GalanganList = ({ onAdd }: GalanganListProps) => {
  const { data: galangan, isLoading } = useQuery({
    queryKey: ['galangan'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('galangan')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'Berlangsung';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Ship className="w-6 h-6" />
            Data Galangan
          </h2>
          <p className="text-gray-600">Kelola proyek galangan kapal</p>
        </div>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Galangan
        </Button>
      </div>

      <div className="grid gap-4">
        {galangan?.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {item.nama_kapal}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{item.jenis_kapal}</p>
                </div>
                <Badge className={`${getStatusColor(item.status)} text-white`}>
                  {getStatusText(item.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Pemilik:</span>
                    <span>{item.pemilik}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Nilai Kontrak:</span>
                    <span className="font-semibold text-green-600">
                      Rp {item.nilai_kontrak.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Mulai:</span>
                    <span>{format(new Date(item.tanggal_mulai), 'dd MMM yyyy', { locale: id })}</span>
                  </div>
                  {item.tanggal_target && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Target:</span>
                      <span>{format(new Date(item.tanggal_target), 'dd MMM yyyy', { locale: id })}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {galangan?.length === 0 && (
        <div className="text-center py-12">
          <Ship className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Belum ada data galangan
          </h3>
          <p className="text-gray-500 mb-4">
            Tambahkan proyek galangan pertama Anda
          </p>
          <Button onClick={onAdd} className="flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            Tambah Galangan
          </Button>
        </div>
      )}
    </div>
  );
};

export default GalanganList;
