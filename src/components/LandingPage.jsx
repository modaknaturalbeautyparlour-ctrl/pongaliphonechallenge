import { useState, useEffect } from 'react'
import { Sparkles, Gift, Calendar } from 'lucide-react'
import RegistrationModal from './RegistrationModal'

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const contestEndDate = new Date(import.meta.env.VITE_CONTEST_END_DATE || '2026-01-20T23:59:59')
    
    const timer = setInterval(() => {
      const now = new Date()
      const difference = contestEndDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ expired: true })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pongal-cream via-pongal-yellow/20 to-pongal-orange/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pongal-yellow/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-pongal-orange/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pongal-green/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-10 h-10 text-pongal-orange animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pongal-orange via-pongal-yellow to-pongal-green bg-clip-text text-transparent">
                Pongal 2026
              </h1>
              <Sparkles className="w-10 h-10 text-pongal-yellow animate-pulse" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-pongal-darkGreen mb-4">
              Celebrate Pongal & Win an iPhone for FREE!
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
              Join our special Pongal contest. Register now for a chance to win an exciting iPhone prize!
            </p>
          </div>

          {/* iPhone showcase */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pongal-orange to-pongal-yellow rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                <div className="w-64 h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center">
                  <Gift className="w-32 h-32 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 bg-pongal-orange text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg animate-bounce">
                  FREE!
                </div>
              </div>
            </div>

            {/* Pongal decorations */}
            <div className="text-center space-y-4">
              <div className="text-8xl">🎍</div>
              <div className="text-6xl">🫕</div>
              <div className="text-7xl">🌺</div>
            </div>
          </div>

          {/* Countdown Timer */}
          {!timeLeft.expired ? (
            <div className="glassmorphism rounded-3xl p-8 mb-12 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Calendar className="w-8 h-8 text-pongal-orange" />
                <h3 className="text-2xl font-bold text-pongal-darkGreen">Contest Closes In</h3>
              </div>
              
              <div className="grid grid-cols-4 gap-4 md:gap-8">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="bg-gradient-to-br from-pongal-orange to-pongal-yellow text-white text-4xl md:text-6xl font-bold rounded-2xl p-4 md:p-6 shadow-lg">
                      {String(item.value || 0).padStart(2, '0')}
                    </div>
                    <div className="text-gray-700 font-semibold mt-2 text-sm md:text-base">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glassmorphism rounded-3xl p-8 mb-12 max-w-4xl mx-auto text-center">
              <p className="text-2xl font-bold text-red-600">Contest has ended!</p>
            </div>
          )}

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              disabled={timeLeft.expired}
              className="btn-primary text-2xl px-12 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-3">
                <Gift className="w-8 h-8" />
                Register Now
                <Sparkles className="w-8 h-8" />
              </span>
            </button>
            
            <p className="mt-6 text-gray-600 text-sm">
              🎉 Free to enter • No purchase necessary • Limited time only
            </p>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && <RegistrationModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
