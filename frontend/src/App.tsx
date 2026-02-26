import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import LoginPage from '@/pages/auth/LoginPage';
import WelcomePage from '@/pages/welcome/WelcomePage';
import HRLayout from '@/components/shared/HRLayout';

// Master Data Pages
import DivisiPage from '@/pages/hr/master/DivisiPage';
import DepartmentPage from '@/pages/hr/master/DepartmentPage';
import PosisiJabatanPage from '@/pages/hr/master/PosisiJabatanPage';
import KategoriPangkatPage from '@/pages/hr/master/KategoriPangkatPage';
import GolonganPage from '@/pages/hr/master/GolonganPage';
import SubGolonganPage from '@/pages/hr/master/SubGolonganPage';
import JenisHubunganKerjaPage from '@/pages/hr/master/JenisHubunganKerjaPage';
import TagPage from '@/pages/hr/master/TagPage';
import LokasiKerjaPage from '@/pages/hr/master/LokasiKerjaPage';
import StatusKaryawanPage from '@/pages/hr/master/StatusKaryawanPage';

// Karyawan Pages
import KaryawanListPage from '@/pages/hr/karyawan/KaryawanListPage';
import KaryawanDetailPage from '@/pages/hr/karyawan/KaryawanDetailPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = authService.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Breadcrumb configs per route
const masterBreadcrumbs: Record<string, { label: string; href?: string }[]> = {
  divisi: [
    { label: 'HR', href: '/' },
    { label: 'Master Data', href: '/hr/master/divisi' },
    { label: 'Divisi' },
  ],
  department: [
    { label: 'HR', href: '/' },
    { label: 'Master Data', href: '/hr/master/divisi' },
    { label: 'Department' },
  ],
  'posisi-jabatan': [
    { label: 'HR', href: '/' },
    { label: 'Master Data', href: '/hr/master/divisi' },
    { label: 'Posisi Jabatan' },
  ],
  'kategori-pangkat': [
    { label: 'HR', href: '/' },
    { label: 'Master Data', href: '/hr/master/divisi' },
    { label: 'Kategori Pangkat' },
  ],
  golongan: [
    { label: 'HR', href: '/' },
    { label: 'Master Data', href: '/hr/master/divisi' },
    { label: 'Golongan' },
  ],
  'sub-golongan': [
    { label: 'HR', href: '/' },
    { label: 'Master Data', href: '/hr/master/divisi' },
    { label: 'Sub Golongan' },
  ],
  'jenis-hubungan-kerja': [
    { label: 'HR', href: '/' },
    { label: 'Master Data', href: '/hr/master/divisi' },
    { label: 'Jenis Hubungan Kerja' },
  ],
  tag: [
    { label: 'HR', href: '/' },
    { label: 'Master Data', href: '/hr/master/divisi' },
    { label: 'Tag' },
  ],
  'lokasi-kerja': [
    { label: 'HR', href: '/' },
    { label: 'Master Data', href: '/hr/master/divisi' },
    { label: 'Lokasi Kerja' },
  ],
  'status-karyawan': [
    { label: 'HR', href: '/' },
    { label: 'Master Data', href: '/hr/master/divisi' },
    { label: 'Status Karyawan' },
  ],
};

function HRMasterLayout() {
  // Ambil segment terakhir dari URL untuk breadcrumb
  const segment = window.location.pathname.split('/').pop() ?? 'divisi';
  const breadcrumbs = masterBreadcrumbs[segment] ?? masterBreadcrumbs.divisi;

  return (
    <HRLayout breadcrumbs={breadcrumbs}>
      <Outlet />
    </HRLayout>
  );
}

function HRKaryawanLayout() {
  const { pathname } = window.location;
  let breadcrumbs = [];

  if (pathname.includes('/hr/karyawan/baru')) {
    breadcrumbs = [
      { label: 'HR', href: '/' },
      { label: 'Karyawan', href: '/hr/karyawan' },
      { label: 'Tambah Karyawan' },
    ];
  } else if (pathname !== '/hr/karyawan' && pathname.startsWith('/hr/karyawan/')) {
    breadcrumbs = [
      { label: 'HR', href: '/' },
      { label: 'Karyawan', href: '/hr/karyawan' },
      { label: 'Detail Karyawan' },
    ];
  } else {
    breadcrumbs = [
      { label: 'HR', href: '/' },
      { label: 'Karyawan' },
    ];
  }

  return (
    <HRLayout breadcrumbs={breadcrumbs}>
      <Outlet />
    </HRLayout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />

      {/* HR Routes */}
      <Route
        path="/hr/*"
        element={
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route path="master" element={<HRMasterLayout />}>
          <Route index element={<Navigate to="/hr/master/divisi" replace />} />
          <Route path="divisi" element={<DivisiPage />} />
          <Route path="department" element={<DepartmentPage />} />
          <Route path="posisi-jabatan" element={<PosisiJabatanPage />} />
          <Route path="kategori-pangkat" element={<KategoriPangkatPage />} />
          <Route path="golongan" element={<GolonganPage />} />
          <Route path="sub-golongan" element={<SubGolonganPage />} />
          <Route path="jenis-hubungan-kerja" element={<JenisHubunganKerjaPage />} />
          <Route path="tag" element={<TagPage />} />
          <Route path="lokasi-kerja" element={<LokasiKerjaPage />} />
          <Route path="status-karyawan" element={<StatusKaryawanPage />} />
        </Route>

        <Route path="karyawan" element={<HRKaryawanLayout />}>
          <Route index element={<KaryawanListPage />} />
          <Route path="baru" element={<KaryawanDetailPage />} />
          <Route path=":id" element={<KaryawanDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
