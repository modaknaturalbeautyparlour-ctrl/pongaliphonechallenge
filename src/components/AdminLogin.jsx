import { useState } from 'react'
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        onLoginSuccess(data.user)
      }
    } catch (error) {
      setError(error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pongal-cream via-pongal-yellow/20 to-pongal-orange/20 flex items-center justify-center p-4">
      <div className="glassmorphism rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-pongal-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-pongal-orange" />
          </div>
          <h1 className="text-3xl font-bold text-pongal-darkGreen mb-2">Admin Login</h1>
          <p className="text-gray-600">Pongal Contest Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-pongal-orange focus:outline-none transition-colors"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-pongal-orange focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
