import { useState } from 'react'
import { X, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function RegistrationModal({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    city: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [registrationId, setRegistrationId] = useState(null)
  const [sessionId] = useState(() => crypto.randomUUID())

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    const phoneRegex = /^[6-9]\d{9}$/
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit Indian mobile number'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const trackActivity = async (activityType, description) => {
    try {
      await supabase.from('registration_activity').insert({
        registration_id: sessionId,
        activity_type: activityType,
        activity_description: description
      })
    } catch (error) {
      console.error('Activity tracking error:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFieldBlur = (fieldName) => {
    trackActivity('field_completed', `Completed: ${fieldName}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      trackActivity('validation_error', 'Form validation failed')
      return
    }

    setLoading(true)
    trackActivity('form_submission_started', 'User clicked submit button')

    try {
      // Check for duplicate phone or email
      const { data: existingRegistrations, error: checkError } = await supabase
        .from('contest_registrations')
        .select('phone_number')
        .eq('phone_number', formData.phoneNumber)

      if (checkError) throw checkError

      if (existingRegistrations && existingRegistrations.length > 0) {
        setErrors({ phoneNumber: 'This phone number is already registered' })
        trackActivity('duplicate_registration', 'Duplicate phone detected')
        setLoading(false)
        return
      }

      // Generate registration number
      const registrationNumber = `PONGAL${Date.now().toString().slice(-8)}`

      // Insert registration
      const { data, error } = await supabase
        .from('contest_registrations')
        .insert({
          registration_number: registrationNumber,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          email: '',
          delivery_address: '',
          city: formData.city,
          state: '',
          pincode: '',
          consent_given: true,
          registration_status: 'completed'
        })
        .select()
        .single()

      if (error) throw error

      setRegistrationId(registrationNumber)
      setSuccess(true)
      trackActivity('registration_completed', `Registration successful: ${registrationNumber}`)
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ submit: 'Registration failed. Please try again.' })
      trackActivity('registration_failed', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="glassmorphism rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full text-center animate-scale-in">
          <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-4 md:mb-6 animate-bounce" />
          
          <h2 className="text-2xl md:text-3xl font-bold text-pongal-darkGreen mb-3 md:mb-4">
            🎉 Registration Successful!
          </h2>
          
          <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
            Your Pongal Contest Registration is Complete!
          </p>
          
          <div className="bg-pongal-yellow/20 rounded-xl p-4 mb-4 md:mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Registration ID</p>
            <p className="text-xl md:text-2xl font-bold text-pongal-orange break-all">{registrationId}</p>
          </div>
          
          <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8">
            Please save this registration ID for your records. We'll contact you via email or phone if you win!
          </p>
          
          <button
            onClick={onClose}
            className="btn-primary w-full"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="glassmorphism rounded-2xl md:rounded-3xl p-4 md:p-8 max-w-2xl w-full my-4 md:my-8 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6 sticky top-0 bg-white/80 backdrop-blur-sm pb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-pongal-darkGreen">
            Contest Registration
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('Full Name')}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              } focus:border-pongal-orange focus:outline-none transition-colors`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="bg-gray-100 px-4 py-3 rounded-xl border-2 border-gray-300 font-semibold">
                +91
              </div>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('Phone Number')}
                className={`flex-1 px-4 py-3 rounded-xl border-2 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } focus:border-pongal-orange focus:outline-none transition-colors`}
                maxLength="10"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('City')}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              } focus:border-pongal-orange focus:outline-none transition-colors`}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.city}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Registration'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
