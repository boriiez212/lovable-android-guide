
-- Create table for galangan (shipyard projects)
CREATE TABLE public.galangan (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_kapal TEXT NOT NULL,
  jenis_kapal TEXT NOT NULL,
  pemilik TEXT NOT NULL,
  nilai_kontrak DECIMAL(15,2) NOT NULL DEFAULT 0,
  tanggal_mulai DATE NOT NULL,
  tanggal_target DATE,
  status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for setor (deposits/payments)
CREATE TABLE public.setor (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  galangan_id UUID REFERENCES public.galangan(id) ON DELETE CASCADE,
  jumlah DECIMAL(15,2) NOT NULL,
  tanggal_setor DATE NOT NULL DEFAULT CURRENT_DATE,
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for lunas (completion/final payments)
CREATE TABLE public.lunas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  galangan_id UUID REFERENCES public.galangan(id) ON DELETE CASCADE,
  tanggal_lunas DATE NOT NULL DEFAULT CURRENT_DATE,
  total_bayar DECIMAL(15,2) NOT NULL,
  sisa_bayar DECIMAL(15,2) DEFAULT 0,
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (make it public for now)
ALTER TABLE public.galangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lunas ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for all operations (public access)
CREATE POLICY "Allow all operations on galangan" ON public.galangan FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on setor" ON public.setor FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on lunas" ON public.lunas FOR ALL USING (true) WITH CHECK (true);

-- Insert some sample data
INSERT INTO public.galangan (nama_kapal, jenis_kapal, pemilik, nilai_kontrak, tanggal_mulai, tanggal_target) VALUES
('KM Bahari Jaya', 'Kapal Cargo', 'PT Pelayaran Nusantara', 2500000000, '2024-01-15', '2024-06-15'),
('KM Sinar Laut', 'Kapal Penumpang', 'CV Transportasi Laut', 1800000000, '2024-02-01', '2024-07-01'),
('KM Nelayan Sejahtera', 'Kapal Ikan', 'Koperasi Nelayan', 950000000, '2024-03-10', '2024-08-10');

INSERT INTO public.setor (galangan_id, jumlah, tanggal_setor, keterangan) VALUES
((SELECT id FROM public.galangan WHERE nama_kapal = 'KM Bahari Jaya'), 500000000, '2024-01-20', 'Pembayaran DP 20%'),
((SELECT id FROM public.galangan WHERE nama_kapal = 'KM Bahari Jaya'), 750000000, '2024-03-15', 'Pembayaran Progress 30%'),
((SELECT id FROM public.galangan WHERE nama_kapal = 'KM Sinar Laut'), 360000000, '2024-02-10', 'Pembayaran DP 20%');
