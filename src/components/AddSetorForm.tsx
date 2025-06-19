
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

interface AddSetorFormProps {
  onClose: () => void;
}

const AddSetorForm = ({ onClose }: AddSetorFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    galangan_id: '',
    jumlah: '',
    tanggal_setor: new Date().toISOString().split('T')[0],
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
        .from('setor')
        .insert([{
          ...data,
          jumlah: parseFloat(data.jumlah) || 0,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setor'] });
      toast({
        title: "Berhasil!",
        description: "Data setor berhasil ditambahkan",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Gagal menambahkan data setor",
        variant: "destructive",
      });
      console.error('Error adding setor:', error);
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
          <h2 className="text-2xl font-bold text-gray-800">Tambah Setor</h2>
          <p className="text-gray-600">Tambahkan catatan setoran baru</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Setor Baru</CardTitle>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jumlah">Jumlah Setor (Rp) *</Label>
                <Input
                  id="jumlah"
                  type="number"
                  value={formData.jumlah}
                  onChange={(e) => handleInputChange('jumlah', e.target.value)}
                  placeholder="Masukkan jumlah setoran"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tanggal_setor">Tanggal Setor *</Label>
                <Input
                  id="tanggal_setor"
                  type="date"
                  value={formData.tanggal_setor}
                  onChange={(e) => handleInputChange('tanggal_setor', e.target.value)}
                  required
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

export default AddSetorForm;
