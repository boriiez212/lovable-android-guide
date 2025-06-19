
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface SetorListProps {
  onAdd: () => void;
}

const SetorList = ({ onAdd }: SetorListProps) => {
  const { data: setor, isLoading } = useQuery({
    queryKey: ['setor'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('setor')
        .select(`
          *,
          galangan:galangan_id (
            nama_kapal,
            jenis_kapal,
            pemilik
          )
        `)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Data Setor
          </h2>
          <p className="text-gray-600">Kelola pembayaran setoran</p>
        </div>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Setor
        </Button>
      </div>

      <div className="grid gap-4">
        {setor?.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">
                {item.galangan?.nama_kapal || 'Galangan tidak ditemukan'}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {item.galangan?.jenis_kapal} - {item.galangan?.pemilik}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Jumlah:</span>
                    <span className="font-semibold text-green-600">
                      Rp {item.jumlah.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Tanggal:</span>
                    <span>{format(new Date(item.tanggal_setor), 'dd MMM yyyy', { locale: id })}</span>
                  </div>
                </div>
                {item.keterangan && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Keterangan:</span>
                        <p className="text-gray-600 mt-1">{item.keterangan}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {setor?.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Belum ada data setor
          </h3>
          <p className="text-gray-500 mb-4">
            Tambahkan catatan setoran pertama Anda
          </p>
          <Button onClick={onAdd} className="flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            Tambah Setor
          </Button>
        </div>
      )}
    </div>
  );
};

export default SetorList;
