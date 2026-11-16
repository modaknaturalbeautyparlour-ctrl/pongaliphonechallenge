import { useState, useEffect } from 'react'
import { Sparkles, Gift, Calendar } from 'lucide-react'
import RegistrationModal from './RegistrationModal'

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState({})
  const [spotsLeft] = useState(9) // Dummy counter for urgency

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
    <div className="min-h-screen bg-gradient-to-br from-pongal-cream via-pongal-yellow/20 to-pongal-orange/20 relative overflow-hidden flex items-center">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pongal-yellow/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-pongal-orange/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pongal-green/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section - Everything in one view */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left side - Text content */}
            <div className="text-center lg:text-left space-y-6">
              {/* Header */}
              <div className="animate-fade-in">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <Sparkles className="w-8 h-8 text-pongal-orange animate-pulse flex-shrink-0" />
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-pongal-orange via-pongal-yellow to-pongal-green bg-clip-text text-transparent">
                    Pongal 2027
                  </h1>
                  <Sparkles className="w-8 h-8 text-pongal-yellow animate-pulse flex-shrink-0" />
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pongal-darkGreen mb-4">
                  Win iPhone 15 FREE!
                </h2>
                
                {/* Urgency Badge */}
                <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full font-bold text-lg mb-4 animate-pulse shadow-lg">
                  ⚡ Only {spotsLeft} Spots Left!
                </div>
                
                <p className="text-lg sm:text-xl text-gray-700 mb-6">
                  🎍 Celebrate Pongal Festival 🫕<br/>
                  Register now for a chance to win!
                </p>
              </div>

              {/* Countdown Timer - Compact */}
              {!timeLeft.expired ? (
                <div className="glassmorphism rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-pongal-orange" />
                    <h3 className="text-lg font-bold text-pongal-darkGreen">Contest Closes In</h3>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hours', value: timeLeft.hours },
                      { label: 'Mins', value: timeLeft.minutes },
                      { label: 'Secs', value: timeLeft.seconds }
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className="bg-gradient-to-br from-pongal-orange to-pongal-yellow text-white text-2xl sm:text-3xl font-bold rounded-lg p-2 shadow-lg">
                          {String(item.value || 0).padStart(2, '0')}
                        </div>
                        <div className="text-gray-700 font-semibold mt-1 text-xs">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="glassmorphism rounded-2xl p-4 mb-6 text-center">
                  <p className="text-xl font-bold text-red-600">Contest has ended!</p>
                </div>
              )}

              {/* CTA Button */}
              <div>
                <button
                  onClick={() => setShowModal(true)}
                  disabled={timeLeft.expired}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xl px-10 py-5 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full lg:w-auto"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Gift className="w-7 h-7 flex-shrink-0" />
                    <span className="font-bold">Register Now - It's FREE!</span>
                    <Sparkles className="w-7 h-7 flex-shrink-0" />
                  </span>
                </button>
                
                <p className="mt-4 text-gray-600 text-sm">
                  🎉 Free Entry • No Purchase Required
                </p>
              </div>
            </div>

            {/* Right side - iPhone showcase */}
            <div className="flex items-center justify-center">
              <div className="relative group animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-r from-pongal-orange to-pongal-yellow rounded-3xl blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white p-6 md:p-10 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                  <div className="w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                    {/* iPhone 15 Image */}
                    <img 
                      src="https://www.apple.com/newsroom/images/2023/09/apple-debuts-iphone-15-and-iphone-15-plus/article/Apple-iPhone-15-lineup-color-lineup-geo-230912_big.jpg.large.jpg" 
                      alt="iPhone 15" 
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback content */}
                    <div className="hidden flex-col items-center justify-center w-full h-full">
                      <Gift className="w-32 h-32 text-gray-400 mb-4" />
                      <p className="text-gray-600 text-2xl font-bold">iPhone 15</p>
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 bg-pongal-orange text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg animate-bounce">
                    CLAIM!
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Registration Modal */}
      {showModal && <RegistrationModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
