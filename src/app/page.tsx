import MainLayout from '@/components/layout/MainLayout'
import Navigation from '@/components/layout/Navigation'

export default function Home() {
  return (
    <MainLayout>
      <Navigation />
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900">Total Tasks</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900">Completed Today</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900">Active Batches</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">0</p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}