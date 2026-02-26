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
            <HRMasterLayout />
          </ProtectedRoute>
        }
      >
        {/* Master Data */}
        <Route path="master" element={<Navigate to="/hr/master/divisi" replace />} />
        <Route path="master/divisi" element={<DivisiPage />} />
        <Route path="master/department" element={<DepartmentPage />} />
        <Route path="master/posisi-jabatan" element={<PosisiJabatanPage />} />
        <Route path="master/kategori-pangkat" element={<KategoriPangkatPage />} />
        <Route path="master/golongan" element={<GolonganPage />} />
        <Route path="master/sub-golongan" element={<SubGolonganPage />} />
        <Route path="master/jenis-hubungan-kerja" element={<JenisHubunganKerjaPage />} />
        <Route path="master/tag" element={<TagPage />} />
        <Route path="master/lokasi-kerja" element={<LokasiKerjaPage />} />
        <Route path="master/status-karyawan" element={<StatusKaryawanPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
