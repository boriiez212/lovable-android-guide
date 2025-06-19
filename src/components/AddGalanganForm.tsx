
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddGalanganFormProps {
  onClose: () => void;
}

const AddGalanganForm = ({ onClose }: AddGalanganFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    nama_kapal: '',
    jenis_kapal: '',
    pemilik: '',
    nilai_kontrak: '',
    tanggal_mulai: '',
    tanggal_target: '',
    status: 'ongoing'
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('galangan')
        .insert([{
          ...data,
          nilai_kontrak: parseFloat(data.nilai_kontrak) || 0,
          tanggal_target: data.tanggal_target || null
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galangan'] });
      toast({
        title: "Berhasil!",
        description: "Data galangan berhasil ditambahkan",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Gagal menambahkan data galangan",
        variant: "destructive",
      });
      console.error('Error adding galangan:', error);
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
          <h2 className="text-2xl font-bold text-gray-800">Tambah Galangan</h2>
          <p className="text-gray-600">Tambahkan proyek galangan baru</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Galangan Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama_kapal">Nama Kapal *</Label>
                <Input
                  id="nama_kapal"
                  value={formData.nama_kapal}
                  onChange={(e) => handleInputChange('nama_kapal', e.target.value)}
                  placeholder="Masukkan nama kapal"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jenis_kapal">Jenis Kapal *</Label>
                <Select value={formData.jenis_kapal} onValueChange={(value) => handleInputChange('jenis_kapal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kapal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kapal Cargo">Kapal Cargo</SelectItem>
                    <SelectItem value="Kapal Penumpang">Kapal Penumpang</SelectItem>
                    <SelectItem value="Kapal Ikan">Kapal Ikan</SelectItem>
                    <SelectItem value="Kapal Tanker">Kapal Tanker</SelectItem>
                    <SelectItem value="Kapal Tug Boat">Kapal Tug Boat</SelectItem>
                    <SelectItem value="Kapal Patroli">Kapal Patroli</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pemilik">Pemilik *</Label>
              <Input
                id="pemilik"
                value={formData.pemilik}
                onChange={(e) => handleInputChange('pemilik', e.target.value)}
                placeholder="Masukkan nama pemilik"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nilai_kontrak">Nilai Kontrak (Rp) *</Label>
              <Input
                id="nilai_kontrak"
                type="number"
                value={formData.nilai_kontrak}
                onChange={(e) => handleInputChange('nilai_kontrak', e.target.value)}
                placeholder="Masukkan nilai kontrak"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tanggal_mulai">Tanggal Mulai *</Label>
                <Input
                  id="tanggal_mulai"
                  type="date"
                  value={formData.tanggal_mulai}
                  onChange={(e) => handleInputChange('tanggal_mulai', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tanggal_target">Tanggal Target</Label>
                <Input
                  id="tanggal_target"
                  type="date"
                  value={formData.tanggal_target}
                  onChange={(e) => handleInputChange('tanggal_target', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Berlangsung</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
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

export default AddGalanganForm;
