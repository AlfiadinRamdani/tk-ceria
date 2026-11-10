export type Activity = {
  id: number;
  judul: string;
  tanggal: string;
  deskripsi: string;
  ikon: string;
  foto?: string;
};

export type Teacher = {
  id: number;
  nama: string;
  jabatan: string;
  deskripsi: string;
  foto: string;
};

export type Founder = {
  nama: string;
  jabatan: string;
  deskripsi: string;
  foto: string;
};

export type User = {
  id: number;
  nama: string;
  email: string;
  role: string;
};
