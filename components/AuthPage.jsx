'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { translations } from '@/lib/translations'
import { CheckCircle2, Mail, Lock, Globe } from 'lucide-react'
import { toast } from 'sonner'

export default function AuthPage() {
  const [lang, setLang] = useState('en')
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [showEmailBanner, setShowEmailBanner] = useState(false)

  const t = translations[lang]

  useEffect(() => {
    const savedLang = localStorage.getItem('appLang') || 'en'
    setLang(savedLang)
  }, [])

  const changeLang = (newLang) => {
    setLang(newLang)
    localStorage.setItem('appLang', newLang)
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error(t.emailRequired)
      return
    }
    if (!password) {
      toast.error(t.passwordRequired)
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          // Check if it's an email not confirmed error
          if (error.message.includes('Email not confirmed') || 
              error.message.includes('email_not_confirmed') ||
              error.status === 400) {
            toast.error(
              lang === 'en' 
                ? '📧 Please verify your email first! Check your inbox (and spam folder) for the confirmation link.' 
                : '📧 कृपया पहले अपना ईमेल सत्यापित करें! पुष्टिकरण लिंक के लिए अपना इनबॉक्स (और स्पैम फ़ोल्डर) जांचें।',
              { duration: 8000 }
            )
          } else {
            toast.error(error.message || t.error)
          }
          throw error
        }
        
        toast.success(t.loginSuccess)
      } else {
        // SIGNUP
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) throw error
        
        // Show detailed success message
        toast.success(
          lang === 'en'
            ? '✅ Account created successfully! Please check your email and click the confirmation link to activate your account.'
            : '✅ खाता सफलतापूर्वक बनाया गया! कृपया अपना ईमेल जांचें और अपना खाता सक्रिय करने के लिए पुष्टिकरण लिंक पर क्लिक करें।',
          { duration: 10000 }
        )
        
        // Show additional info toast
        setTimeout(() => {
          toast.info(
            lang === 'en'
              ? '💡 Tip: Check your spam folder if you don\'t see the email within a few minutes.'
              : '💡 टिप: यदि आपको कुछ मिनटों के भीतर ईमेल नहीं दिखाई देता है तो अपना स्पैम फ़ोल्डर जांचें।',
            { duration: 8000 }
          )
        }, 2000)
        
        // Show email confirmation banner
        setShowEmailBanner(true)
      }
    } catch (error) {
      // Error already handled above
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error(t.emailRequired)
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      toast.success('Reset link sent to your email!')
      setShowReset(false)
    } catch (error) {
      toast.error(error.message || t.error)
    } finally {
      setLoading(false)
    }
  }

  if (showReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => changeLang('en')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              lang === 'en' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => changeLang('hi')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              lang === 'hi' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            हिं
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.resetPassword}</h1>
            <p className="text-gray-600">Enter your email to receive reset link</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : t.sendResetLink}
            </button>

            <button
              type="button"
              onClick={() => setShowReset(false)}
              className="w-full text-purple-600 text-sm hover:underline"
            >
              {t.backToLogin}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="absolute top-6 right-6 flex gap-2">
        <button
          onClick={() => changeLang('en')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            lang === 'en' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => changeLang('hi')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            lang === 'hi' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          हिं
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.appTitle}</h1>
          <p className="text-gray-600">{t.tagline}</p>
        </div>

        {/* Email Confirmation Banner */}
        {showEmailBanner && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">
                  {lang === 'en' ? 'Verify Your Email' : 'अपना ईमेल सत्यापित करें'}
                </h3>
                <p className="text-sm text-blue-800">
                  {lang === 'en' 
                    ? 'We sent a confirmation link to your email. Click it to activate your account and login!'
                    : 'हमने आपके ईमेल पर एक पुष्टिकरण लिंक भेजा है। अपना खाता सक्रिय करने और लॉगिन करने के लिए उस पर क्लिक करें!'}
                </p>
              </div>
              <button 
                onClick={() => setShowEmailBanner(false)}
                className="flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>

          {isLogin && (
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="text-purple-600 text-sm hover:underline"
            >
              {t.forgotPassword}
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : (isLogin ? t.login : t.signup)}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setShowEmailBanner(false)
            }}
            className="w-full text-purple-600 text-sm hover:underline"
          >
            {isLogin ? t.dontHaveAccount : t.alreadyHaveAccount}
          </button>
        </form>
      </div>
    </div>
  )
}