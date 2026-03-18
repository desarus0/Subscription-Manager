import { useState, useEffect, useRef } from 'react'
import { useSignIn, useAuth } from '@clerk/clerk-react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../components/logo.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function checkPasswordRequirements(val) {
    return {
        hasMinLength: val.length >= 8,
        hasUppercase: /[A-Z]/.test(val),
        hasLowercase: /[a-z]/.test(val),
        hasNumber: /[0-9]/.test(val),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(val),
    }
}

function isPasswordValid(val) {
    const c = checkPasswordRequirements(val)
    return c.hasMinLength && c.hasUppercase && c.hasLowercase && c.hasNumber && c.hasSpecial
}

function SignIn() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const { isSignedIn } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState('credentials')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [showNewPasswordReqs, setShowNewPasswordReqs] = useState(false)
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({ email: '', password: '', mfa: '', forgot: '', reset: '', newPassword: '' })
    const [countdown, setCountdown] = useState(0)
    const inputRefs = useRef([])

    useEffect(() => {
        if (isLoaded && isSignedIn) navigate('/dashboard')
    }, [isLoaded, isSignedIn, navigate])

    useEffect(() => {
        if (countdown === 0) return
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
        return () => clearTimeout(timer)
    }, [countdown])

    if (!isLoaded) return null

    const inputBase = `w-full h-12 rounded-lg px-4 text-sm text-white bg-[#111111] border outline-none transition-all duration-150 placeholder-gray-600`
    const inputClass = (error) => `${inputBase} ${error ? 'border-red-500 border-2' : 'border-[#2a2a2a] focus:border-white focus:border-2'}`
    const digitBase = `w-12 h-12 text-center text-white text-lg font-semibold bg-[#111111] border rounded-lg outline-none transition-all duration-150 mb-4`
    const digitClass = (error) => `${digitBase} ${error ? 'border-red-500 border-2' : 'border-[#2a2a2a] focus:border-white focus:border-2'}`

    function resetCode() { setCode(['', '', '', '', '', '']) }

    function handleDigitChange(index, value) {
        if (!/^\d*$/.test(value)) return
        const newCode = [...code]
        newCode[index] = value.slice(-1)
        setCode(newCode)
        setErrors(prev => ({ ...prev, mfa: '', reset: '' }))
        if (value && index < 5) inputRefs.current[index + 1].focus()
    }

    function handleDigitKeyDown(index, e) {
        if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs.current[index - 1].focus()
    }

    function handleDigitPaste(e) {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        const newCode = [...code]
        pasted.split('').forEach((char, i) => { newCode[i] = char })
        setCode(newCode)
        inputRefs.current[Math.min(pasted.length - 1, 5)].focus()
    }

    async function handleCredentials(e) {
        e.preventDefault()

        let newErrors = { ...errors, email: '', password: '' }
        if (email.trim() === '') newErrors.email = 'Email is required'
        else if (!emailPattern.test(email.trim())) newErrors.email = 'Please enter a valid email'
        if (password.trim() === '') newErrors.password = 'Password is required'

        setErrors(newErrors)
        if (newErrors.email || newErrors.password) return

        setIsLoading(true)

        try {
            const result = await signIn.create({
                identifier: email.trim(),
                password: password.trim(),
            })

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                navigate('/dashboard')
            } else if (result.status === 'needs_second_factor' || result.status === 'needs_client_trust') {
                await signIn.prepareSecondFactor({ strategy: 'email_code' })
                setIsLoading(false)
                setCountdown(30)
                setStep('mfa')
            }
        } catch (error) {
            setIsLoading(false)
            const newErrors = { ...errors, email: '', password: '' }
            if (error.errors) {
                error.errors.forEach(err => {
                    if (err.code === 'form_identifier_not_found') newErrors.email = 'No account found with this email'
                    else if (err.code === 'form_password_incorrect') newErrors.password = 'Incorrect password'
                    else if (err.code === 'too_many_requests') newErrors.password = 'Too many attempts. Please try again later.'
                    else newErrors.password = 'Something went wrong. Please try again.'
                })
            }
            setErrors(newErrors)
        }
    }

    async function handleResendMfa() {
        try {
            await signIn.prepareSecondFactor({ strategy: 'email_code' })
            setErrors(prev => ({ ...prev, mfa: '' }))
            setCountdown(30)
        } catch {
            setErrors(prev => ({ ...prev, mfa: 'Failed to resend code. Please try again.' }))
        }
    }

    async function handleMfa(e) {
        e.preventDefault()
        const joined = code.join('')
        if (joined.length < 6) {
            setErrors(prev => ({ ...prev, mfa: 'Please enter the full 6-digit code' }))
            return
        }
        setIsLoading(true)
        try {
            const result = await signIn.attemptSecondFactor({ strategy: 'email_code', code: joined })
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                navigate('/dashboard')
            }
        } catch (error) {
            setIsLoading(false)
            resetCode()
            inputRefs.current[0]?.focus()
            if (error.errors) {
                error.errors.forEach(err => {
                    if (err.code === 'form_code_incorrect') setErrors(prev => ({ ...prev, mfa: 'Incorrect code. Please try again.' }))
                    else if (err.code === 'verification_expired') setErrors(prev => ({ ...prev, mfa: 'Code expired. Click resend to get a new one.' }))
                    else if (err.code === 'too_many_requests') setErrors(prev => ({ ...prev, mfa: 'Too many attempts. Please try again later.' }))
                    else setErrors(prev => ({ ...prev, mfa: 'Something went wrong. Please try again.' }))
                })
            }
        }
    }

    async function handleForgot(e) {
        e.preventDefault()
        if (email.trim() === '') {
            setErrors(prev => ({ ...prev, forgot: 'Email is required' }))
            return
        }
        if (!emailPattern.test(email.trim())) {
            setErrors(prev => ({ ...prev, forgot: 'Please enter a valid email' }))
            return
        }
        setIsLoading(true)
        try {
            await signIn.create({ strategy: 'reset_password_email_code', identifier: email.trim() })
        } catch (error) {
            if (error.errors?.some(e => e.code === 'too_many_requests')) {
                setIsLoading(false)
                setErrors(prev => ({ ...prev, forgot: 'Too many attempts. Please try again later.' }))
                return
            }
        }
        setIsLoading(false)
        setCountdown(30)
        resetCode()
        setNewPassword('')
        setStep('reset')
    }

    async function handleResendReset() {
        try {
            await signIn.create({ strategy: 'reset_password_email_code', identifier: email.trim() })
            setCountdown(30)
        } catch {
            setCountdown(30)
        }
    }

    function handleResetCode(e) {
        e.preventDefault()
        const joined = code.join('')
        if (joined.length < 6) {
            setErrors(prev => ({ ...prev, reset: 'Please enter the full 6-digit code' }))
            return
        }
        setStep('reset_password')
    }

    async function handleResetPassword(e) {
        e.preventDefault()
        if (newPassword.trim() === '') {
            setErrors(prev => ({ ...prev, newPassword: 'New password is required' }))
            return
        }
        if (!isPasswordValid(newPassword.trim())) {
            setErrors(prev => ({ ...prev, newPassword: 'Password requirements not met' }))
            return
        }
        setIsLoading(true)
        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: code.join(''),
                password: newPassword.trim(),
            })
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                setStep('success')
                setTimeout(() => navigate('/dashboard'), 2000)
            }
        } catch (error) {
            setIsLoading(false)
            if (error.errors) {
                error.errors.forEach(err => {
                    if (err.code === 'form_code_incorrect' || err.code === 'verification_expired') {
                        resetCode()
                        setErrors(prev => ({ ...prev, reset: err.code === 'verification_expired' ? 'Code expired. Request a new one.' : 'Incorrect code. Please try again.' }))
                        setStep('reset')
                    } else if (err.code === 'form_password_pwned') {
                        setErrors(prev => ({ ...prev, newPassword: 'This password has been compromised. Please use a different one.' }))
                    } else if (err.code === 'too_many_requests') {
                        setErrors(prev => ({ ...prev, newPassword: 'Too many attempts. Please try again later.' }))
                    } else {
                        setErrors(prev => ({ ...prev, newPassword: 'Something went wrong. Please try again.' }))
                    }
                })
            }
        }
    }

    const maskedEmail = (() => {
        const [local, domain] = email.split('@')
        return `${local?.slice(0, 2)}***@${domain}`
    })()

    return (
        <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4">

            <Link to="/"><Logo /></Link>

            <div className="w-full max-w-md bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl px-8 py-10 shadow-2xl" style={{ fontFamily: 'Geist' }}>

                {step === 'credentials' && (
                    <>
                        <h1 className="text-white text-2xl font-semibold mb-1 tracking-tight">Welcome back</h1>
                        <p className="text-gray-500 text-sm mb-8">Sign in to your Recur account.</p>

                        <form onSubmit={handleCredentials}>
                            <div className="flex flex-col mb-1">
                                <label className="text-xs text-gray-400 font-medium mb-1.5">Email Address</label>
                                <input
                                    className={inputClass(errors.email)}
                                    type="text"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })) }}
                                />
                                <span className="text-red-500 text-xs min-h-4.5 mt-1">{errors.email}</span>
                            </div>

                            <div className="flex flex-col mb-1">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs text-gray-400 font-medium">Password</label>
                                    <span
                                        className="text-xs text-gray-500 hover:text-white cursor-pointer transition"
                                        onClick={() => { setErrors(prev => ({ ...prev, forgot: '' })); setStep('forgot') }}
                                    >
                                        Forgot password?
                                    </span>
                                </div>
                                <input
                                    className={inputClass(errors.password)}
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })) }}
                                />
                                <span className="text-red-500 text-xs min-h-4.5 mt-1">{errors.password}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition cursor-pointer disabled:opacity-50 mt-4"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <span className="flex items-center my-5 gap-3 text-xs text-gray-600 before:flex-1 before:content-[''] before:h-px before:bg-[#1f1f1f] after:flex-1 after:content-[''] after:h-px after:bg-[#1f1f1f]">
                                OR
                            </span>

                            <p className="text-center text-xs text-gray-500">
                                Don't have an account?{' '}
                                <span className="text-white cursor-pointer hover:underline" onClick={() => navigate('/register')}>Sign up</span>
                            </p>
                        </form>
                    </>
                )}

                {step === 'mfa' && (
                    <>
                        <h1 className="text-white text-2xl font-semibold mb-1 tracking-tight">We need to verify your identity</h1>
                        <p className="text-gray-500 text-sm mb-8">
                            We've sent a verification code to {maskedEmail}<br />
                            Enter the 6-digit code below.
                        </p>

                        <div className="flex gap-3 justify-between">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    maxLength="1"
                                    className={digitClass(errors.mfa)}
                                    value={digit}
                                    autoFocus={index === 0}
                                    onChange={(e) => handleDigitChange(index, e.target.value)}
                                    onKeyDown={(e) => handleDigitKeyDown(index, e)}
                                    onPaste={handleDigitPaste}
                                />
                            ))}
                        </div>

                        <span className="text-red-500 text-xs min-h-4.5 mt-1 text-center block mb-4">{errors.mfa}</span>

                        <button
                            disabled={isLoading}
                            className="w-full h-11 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition cursor-pointer disabled:opacity-50 mb-4"
                            onClick={handleMfa}
                        >
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </button>

                        <p className="text-center text-xs text-gray-500">
                            Didn't receive the code?{' '}
                            {countdown > 0
                                ? <span className="text-gray-500">Resend in {countdown}s</span>
                                : <span className="text-white cursor-pointer hover:underline" onClick={handleResendMfa}>Resend</span>
                            }
                        </p>
                        <p className="text-center text-xs text-gray-500 mt-3">
                            <span className="text-white cursor-pointer hover:underline" onClick={() => { setStep('credentials'); resetCode(); setErrors(prev => ({ ...prev, mfa: '' })) }}>
                                ← Back to sign in
                            </span>
                        </p>
                    </>
                )}

                {step === 'forgot' && (
                    <>
                        <h1 className="text-white text-2xl font-semibold mb-1 tracking-tight">Forgot your password?</h1>
                        <p className="text-gray-500 text-sm mb-8">Enter your email and we'll send you a reset code.</p>

                        <form onSubmit={handleForgot}>
                            <div className="flex flex-col mb-1">
                                <label className="text-xs text-gray-400 font-medium mb-1.5">Email Address</label>
                                <input
                                    className={inputClass(errors.forgot)}
                                    type="text"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, forgot: '' })) }}
                                />
                                <span className="text-red-500 text-xs min-h-4.5 mt-1">{errors.forgot}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition cursor-pointer disabled:opacity-50 mt-4"
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>

                        <p className="text-center text-xs text-gray-500 mt-5">
                            <span className="text-white cursor-pointer hover:underline" onClick={() => { setStep('credentials'); setErrors(prev => ({ ...prev, forgot: '' })) }}>
                                ← Back to sign in
                            </span>
                        </p>
                    </>
                )}

                {step === 'reset' && (
                    <>
                        <h1 className="text-white text-2xl font-semibold mb-1 tracking-tight">Check your email</h1>
                        <p className="text-gray-500 text-sm mb-8">
                            If an account exists for {maskedEmail}, a reset code will be sent.<br /> <br />
                            Enter the 6-digit code below.
                        </p>

                        <form onSubmit={handleResetCode}>
                            <div className="flex gap-3 justify-between">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        maxLength="1"
                                        className={digitClass(errors.reset)}
                                        value={digit}
                                        autoFocus={index === 0}
                                        onChange={(e) => handleDigitChange(index, e.target.value)}
                                        onKeyDown={(e) => handleDigitKeyDown(index, e)}
                                        onPaste={handleDigitPaste}
                                    />
                                ))}
                            </div>

                            <span className="text-red-500 text-xs min-h-4.5 mt-1 text-center block mb-4">{errors.reset}</span>

                            <button
                                type="submit"
                                className="w-full h-11 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition cursor-pointer disabled:opacity-50 mb-4"
                            >
                                Continue
                            </button>
                        </form>

                        <p className="text-center text-xs text-gray-500">
                            Didn't receive the code?{' '}
                            {countdown > 0
                                ? <span className="text-gray-500">Resend in {countdown}s</span>
                                : <span className="text-white cursor-pointer hover:underline" onClick={handleResendReset}>Resend</span>
                            }
                        </p>
                        <p className="text-center text-xs text-gray-500 mt-3">
                            <span className="text-white cursor-pointer hover:underline" onClick={() => { setStep('forgot'); resetCode(); setErrors(prev => ({ ...prev, reset: '' })) }}>
                                ← Back
                            </span>
                        </p>
                    </>
                )}

                {step === 'reset_password' && (
                    <>
                        <h1 className="text-white text-2xl font-semibold mb-1 tracking-tight">Set a new password</h1>
                        <p className="text-gray-500 text-sm mb-8">Choose a strong password for your account.</p>

                        <form onSubmit={handleResetPassword}>
                            <div className="flex flex-col mb-1">
                                <label className="text-xs text-gray-400 font-medium mb-1.5">New Password</label>
                                <input
                                    className={inputClass(errors.newPassword)}
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    autoFocus
                                    onFocus={() => setShowNewPasswordReqs(true)}
                                    onBlur={() => setShowNewPasswordReqs(false)}
                                    onChange={(e) => { setNewPassword(e.target.value); setErrors(prev => ({ ...prev, newPassword: '' })) }}
                                />

                                <div className={`overflow-hidden transition-all duration-200 ${showNewPasswordReqs ? 'max-h-44 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                    <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg p-3">
                                        {[
                                            [checkPasswordRequirements(newPassword).hasMinLength, 'At least 8 characters'],
                                            [checkPasswordRequirements(newPassword).hasUppercase, 'One uppercase letter (A-Z)'],
                                            [checkPasswordRequirements(newPassword).hasLowercase, 'One lowercase letter (a-z)'],
                                            [checkPasswordRequirements(newPassword).hasNumber, 'One number (0-9)'],
                                            [checkPasswordRequirements(newPassword).hasSpecial, 'One special character (!@#$%^&*)'],
                                        ].map(([met, label]) => (
                                            <p key={label} className="text-xs text-gray-500 mb-1 last:mb-0">
                                                <span className={met ? 'text-white' : 'text-red-500'}>{met ? '✓ ' : '✗ '}</span>{label}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <span className="text-red-500 text-xs min-h-4.5 mt-1">{errors.newPassword}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition cursor-pointer disabled:opacity-50 mt-4"
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>

                        <p className="text-center text-xs text-gray-500 mt-5">
                            <span className="text-white cursor-pointer hover:underline" onClick={() => { setStep('reset'); setNewPassword(''); setErrors(prev => ({ ...prev, newPassword: '' })) }}>
                                ← Back
                            </span>
                        </p>
                    </>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center py-4">
                        <div className="w-12 h-12 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-white text-2xl font-semibold mb-1 tracking-tight">Password reset!</h1>
                        <p className="text-gray-500 text-sm text-center">Your password has been updated. Redirecting you to the dashboard...</p>
                    </div>
                )}

            </div>

            <p className="text-gray-700 text-xs mt-8">© {new Date().getFullYear()} Recur</p>
        </div>
    )
}

export default SignIn
