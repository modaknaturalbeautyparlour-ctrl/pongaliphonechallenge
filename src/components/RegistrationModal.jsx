import { useState } from 'react'
import { X, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function RegistrationModal({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    consent: false
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }

    const pincodeRegex = /^\d{6}$/
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN code is required'
    } else if (!pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit PIN code'
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to share your registration progress'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const trackActivity = async (activityType, description) => {
    if (!formData.consent) return

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
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFieldBlur = (fieldName) => {
    if (formData.consent) {
      trackActivity('field_completed', `Completed: ${fieldName}`)
    }
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
        .select('phone_number, email')
        .or(`phone_number.eq.${formData.phoneNumber},email.eq.${formData.email}`)

      if (checkError) throw checkError

      if (existingRegistrations && existingRegistrations.length > 0) {
        const duplicate = existingRegistrations[0]
        if (duplicate.phone_number === formData.phoneNumber) {
          setErrors({ phoneNumber: 'This phone number is already registered' })
        } else {
          setErrors({ email: 'This email is already registered' })
        }
        trackActivity('duplicate_registration', 'Duplicate phone or email detected')
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
          email: formData.email,
          delivery_address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          consent_given: formData.consent,
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
        <div className="glassmorphism rounded-3xl p-8 max-w-md w-full text-center animate-scale-in">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
          
          <h2 className="text-3xl font-bold text-pongal-darkGreen mb-4">
            🎉 Registration Successful!
          </h2>
          
          <p className="text-lg text-gray-700 mb-6">
            Your Pongal Contest Registration is Complete!
          </p>
          
          <div className="bg-pongal-yellow/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Registration ID</p>
            <p className="text-2xl font-bold text-pongal-orange">{registrationId}</p>
          </div>
          
          <p className="text-sm text-gray-600 mb-8">
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
      <div className="glassmorphism rounded-3xl p-8 max-w-2xl w-full my-8 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-pongal-darkGreen">
            Contest Registration
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your full name"
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
                placeholder="9876543210"
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

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('Email')}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:border-pongal-orange focus:outline-none transition-colors`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Complete Delivery Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('Address')}
              rows="3"
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } focus:border-pongal-orange focus:outline-none transition-colors resize-none`}
              placeholder="House/Flat No., Street, Locality"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.address}
              </p>
            )}
          </div>

          {/* City, State, PIN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="City"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('State')}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                } focus:border-pongal-orange focus:outline-none transition-colors`}
                placeholder="State"
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.state}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('PIN Code')}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                } focus:border-pongal-orange focus:outline-none transition-colors`}
                placeholder="600001"
                maxLength="6"
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.pincode}
                </p>
              )}
            </div>
          </div>

          {/* Consent */}
          <div className="bg-pongal-cream/50 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1 w-5 h-5 text-pongal-orange focus:ring-pongal-orange rounded"
              />
              <span className="text-sm text-gray-700">
                <span className="font-semibold">Privacy Consent:</span> I agree to share my registration progress with the admin dashboard for monitoring purposes. My personal information will be used only for contest administration and winner notification.
                <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.consent && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.consent}
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
