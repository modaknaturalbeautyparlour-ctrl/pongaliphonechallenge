import { useState, useEffect } from 'react'
import { 
  LogOut, Users, Calendar, TrendingUp, Search, 
  Download, Trash2, Eye, RefreshCw, Activity 
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export default function AdminDashboard({ user, onLogout }) {
  const [registrations, setRegistrations] = useState([])
  const [activities, setActivities] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    completed: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedRegistration, setSelectedRegistration] = useState(null)

  useEffect(() => {
    fetchData()
    
    const cleanup = subscribeToUpdates()
    
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  const fetchData = async () => {
    try {
      // Fetch all registrations
      const { data: regs, error: regsError } = await supabase
        .from('contest_registrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (regsError) throw regsError

      setRegistrations(regs || [])
      calculateStats(regs || [])

      // Fetch recent activities
      const { data: acts, error: actsError } = await supabase
        .from('registration_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (actsError) throw actsError

      setActivities(acts || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToUpdates = () => {
    // Subscribe to new registrations
    const registrationsChannel = supabase.channel('registrations_changes')
    
    registrationsChannel
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contest_registrations' },
        (payload) => {
          console.log('Registration change:', payload)
          fetchData()
        }
      )
      .subscribe()

    // Subscribe to activities
    const activitiesChannel = supabase.channel('activities_changes')
    
    activitiesChannel
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'registration_activity' },
        (payload) => {
          console.log('New activity:', payload)
          setActivities(prev => [payload.new, ...prev.slice(0, 49)])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(registrationsChannel)
      supabase.removeChannel(activitiesChannel)
    }
  }

  const calculateStats = (regs) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    setStats({
      total: regs.length,
      today: regs.filter(r => new Date(r.created_at) >= today).length,
      thisWeek: regs.filter(r => new Date(r.created_at) >= weekAgo).length,
      completed: regs.filter(r => r.registration_status === 'completed').length
    })
  }

  const handleExportCSV = () => {
    const headers = ['Registration Number', 'Full Name', 'Phone', 'Email', 'City', 'State', 'PIN Code', 'Status', 'Created At']
    const rows = filteredRegistrations.map(r => [
      r.registration_number,
      r.full_name,
      r.phone_number,
      r.email,
      r.city,
      r.state,
      r.pincode,
      r.registration_status,
      format(new Date(r.created_at), 'yyyy-MM-dd HH:mm:ss')
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pongal-contest-registrations-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this registration?')) return

    try {
      const { error } = await supabase
        .from('contest_registrations')
        .delete()
        .eq('id', id)

      if (error) throw error

      setRegistrations(prev => prev.filter(r => r.id !== id))
      alert('Registration deleted successfully')
    } catch (error) {
      alert('Error deleting registration: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = !searchTerm || 
      r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone_number.includes(searchTerm) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = !dateFilter || 
      format(new Date(r.created_at), 'yyyy-MM-dd') === dateFilter

    return matchesSearch && matchesDate
  })

  const toIST = (date) => {
    return new Date(date).toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-12 h-12 text-pongal-orange animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-pongal-darkGreen">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Pongal Contest Registration Management</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Registrations', value: stats.total, icon: Users, color: 'blue' },
            { label: 'Today', value: stats.today, icon: Calendar, color: 'green' },
            { label: 'This Week', value: stats.thisWeek, icon: TrendingUp, color: 'orange' },
            { label: 'Completed', value: stats.completed, icon: Users, color: 'purple' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-pongal-orange" />
            <h2 className="text-xl font-bold text-gray-900">Live Activity Feed</h2>
            <span className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-sm">No activity yet</p>
            ) : (
              activities.slice(0, 10).map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm border-b pb-2">
                  <div className="bg-pongal-yellow/20 p-1.5 rounded-full">
                    <Activity className="w-3 h-3 text-pongal-orange" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{activity.activity_description}</p>
                    <p className="text-gray-500 text-xs">{toIST(activity.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, phone, or email..."
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pongal-orange"
                />
              </div>
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pongal-orange"
            />
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-6 py-3 bg-pongal-green text-white rounded-lg hover:bg-pongal-darkGreen transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{reg.registration_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{reg.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">+91 {reg.phone_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{reg.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{reg.city}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {reg.registration_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{toIST(reg.created_at)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedRegistration(reg)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(reg.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Registration Details</h2>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div><strong>Registration ID:</strong> {selectedRegistration.registration_number}</div>
              <div><strong>Full Name:</strong> {selectedRegistration.full_name}</div>
              <div><strong>Phone:</strong> +91 {selectedRegistration.phone_number}</div>
              <div><strong>Email:</strong> {selectedRegistration.email}</div>
              <div><strong>Address:</strong> {selectedRegistration.delivery_address}</div>
              <div><strong>City:</strong> {selectedRegistration.city}</div>
              <div><strong>State:</strong> {selectedRegistration.state}</div>
              <div><strong>PIN Code:</strong> {selectedRegistration.pincode}</div>
              <div><strong>Status:</strong> {selectedRegistration.registration_status}</div>
              <div><strong>Consent Given:</strong> {selectedRegistration.consent_given ? 'Yes' : 'No'}</div>
              <div><strong>Registered At:</strong> {toIST(selectedRegistration.created_at)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
