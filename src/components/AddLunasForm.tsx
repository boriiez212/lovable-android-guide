
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddLunasFormProps {
  onClose: () => void;
}

const AddLunasForm = ({ onClose }: AddLunasFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    galangan_id: '',
    tanggal_lunas: new Date().toISOString().split('T')[0],
    total_bayar: '',
    sisa_bayar: '',
    keterangan: ''
  });

  const { data: galangan } = useQuery({
    queryKey: ['galangan'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('galangan')
        .select('id, nama_kapal, jenis_kapal, pemilik')
        .order('nama_kapal');
      
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('lunas')
        .insert([{
          ...data,
          total_bayar: parseFloat(data.total_bayar) || 0,
          sisa_bayar: parseFloat(data.sisa_bayar) || 0,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lunas'] });
      toast({
        title: "Berhasil!",
        description: "Data lunas berhasil ditambahkan",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Gagal menambahkan data lunas",
        variant: "destructive",
      });
      console.error('Error adding lunas:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tambah Lunas</h2>
          <p className="text-gray-600">Tambahkan catatan pelunasan baru</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Lunas Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="galangan_id">Pilih Galangan *</Label>
              <Select value={formData.galangan_id} onValueChange={(value) => handleInputChange('galangan_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih galangan" />
                </SelectTrigger>
                <SelectContent>
                  {galangan?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nama_kapal} - {item.jenis_kapal} ({item.pemilik})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal_lunas">Tanggal Lunas *</Label>
              <Input
                id="tanggal_lunas"
                type="date"
                value={formData.tanggal_lunas}
                onChange={(e) => handleInputChange('tanggal_lunas', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_bayar">Total Bayar (Rp) *</Label>
                <Input
                  id="total_bayar"
                  type="number"
                  value={formData.total_bayar}
                  onChange={(e) => handleInputChange('total_bayar', e.target.value)}
                  placeholder="Masukkan total pembayaran"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sisa_bayar">Sisa Bayar (Rp)</Label>
                <Input
                  id="sisa_bayar"
                  type="number"
                  value={formData.sisa_bayar}
                  onChange={(e) => handleInputChange('sisa_bayar', e.target.value)}
                  placeholder="Masukkan sisa pembayaran"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
                placeholder="Masukkan keterangan (opsional)"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={mutation.isPending} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddLunasForm;
