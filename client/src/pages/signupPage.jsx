import { useState, useEffect } from 'react'
import { useSignUp, useAuth } from '@clerk/clerk-react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../components/logo.jsx'
import { PasswordRequirements, isPasswordValid } from '@/components/password-requirements'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SignUp() {
    const { signUp } = useSignUp()
    const { isSignedIn, isLoaded } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            navigate('/dashboard')
        }
    }, [isLoaded, isSignedIn, navigate])

    if (!isLoaded || isSignedIn) {
        return null
    }

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [termsChecked, setTerms] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showRequirements, setShowRequirements] = useState(false)
    const [errors, setErrors] = useState({
        firstName: '', lastName: '', email: '', password: '', terms: ''
    })

    async function handleSubmit(e) {
        e.preventDefault()

        let newErrors = { firstName: '', lastName: '', email: '', password: '', terms: '' }

        if (firstName.trim() === '') newErrors.firstName = 'First name is required'
        if (lastName.trim() === '') newErrors.lastName = 'Last name is required'
        if (email.trim() === '') {
            newErrors.email = 'Email is required'
        } else if (!emailPattern.test(email.trim())) {
            newErrors.email = 'Please enter a valid email'
        }
        if (password.trim() === '') {
            newErrors.password = 'Password is required'
        } else if (!isPasswordValid(password.trim())) {
            newErrors.password = 'Password requirements not met'
        }
        if (!termsChecked) newErrors.terms = 'You must agree to the terms and service'

        setErrors(newErrors)
        const isValid = Object.values(newErrors).every(err => err === '')
        if (!isValid) return

        setIsLoading(true)

        try {
            const signUpAttempt = await signUp.create({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                emailAddress: email.trim(),
                password: password.trim(),
            })
            await signUpAttempt.prepareEmailAddressVerification({ strategy: "email_code" })
            navigate('/verify')
        } catch (error) {
            const newErrors = { firstName: '', lastName: '', email: '', password: '', terms: '' }
            setIsLoading(false)
            if (error.errors) {
                error.errors.forEach(err => {
                    if (err.code === "form_identifier_exists") newErrors.email = 'This email is already registered'
                    else if (err.code === "form_password_pwned") newErrors.password = 'This password has been compromised. Please use a different one.'
                    else if (err.code === "form_param_format_invalid") newErrors.email = 'Invalid email format'
                })
                setErrors(newErrors)
            } else {
                alert("An error occurred during signup. Please try again.")
            }
        }
    }

    const inputBase = `w-full h-12 rounded-lg px-4 text-sm text-white bg-[#111111] border outline-none transition-all duration-150 placeholder-gray-600`
    const inputClass = (error) => `${inputBase} ${error ? 'border-red-500 border-2' : 'border-[#2a2a2a] focus:border-white focus:border-2'}`

    return (
        <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4">

            {/* Logo */}
            <Link to="/">
                <Logo />
            </Link>

            {/* Card */}
            <div className="w-full max-w-md bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl px-8 py-10 shadow-2xl" style={{ fontFamily: 'Geist' }}>

                <h1 className="text-white text-2xl font-semibold mb-1 tracking-tight">
                    Let's set up your account
                </h1>
                <p className="text-gray-500 text-sm mb-8">Start tracking your subscriptions today.</p>

                <form onSubmit={handleSubmit}>

                    {/* Name Row */}
                    <div className="flex gap-3 mb-1">
                        <div className="flex flex-col flex-1">
                            <label className="text-xs text-gray-400 font-medium mb-1.5">First Name</label>
                            <input
                                className={inputClass(errors.firstName)}
                                type="text"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, firstName: '' })) }}
                            />
                            <span className="text-red-500 text-xs min-h-4.5 mt-1">{errors.firstName}</span>
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="text-xs text-gray-400 font-medium mb-1.5">Last Name</label>
                            <input
                                className={inputClass(errors.lastName)}
                                type="text"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => { setLastName(e.target.value); setErrors(prev => ({ ...prev, lastName: '' })) }}
                            />
                            <span className="text-red-500 text-xs min-h-4.5 mt-1">{errors.lastName}</span>
                        </div>
                    </div>

                    {/* Email */}
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

                    {/* Password */}
                    <div className="flex flex-col mb-1">
                        <label className="text-xs text-gray-400 font-medium mb-1.5">Password</label>
                        <input
                            className={inputClass(errors.password)}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onFocus={() => setShowRequirements(true)}
                            onBlur={() => setShowRequirements(false)}
                            onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })) }}
                        />

                        <PasswordRequirements value={password} visible={showRequirements} />

                        <span className="text-red-500 text-xs min-h-4.5 mt-1">{errors.password}</span>
                    </div>

                    {/* Terms */}
                    <div className="flex items-center gap-2 mt-1">
                        <div
                            onClick={() => { setTerms(!termsChecked); setErrors(p => ({ ...p, terms: '' })) }}
                            className={`w-4 h-4 rounded cursor-pointer flex items-center justify-center border transition-all duration-150 shrink-0
                                ${termsChecked ? 'bg-white border-white' : 'bg-transparent'}
                                ${errors.terms && !termsChecked ? 'border-2 border-red-500' : termsChecked ? '' : 'border-[#444]'}
                            `}
                        >
                            {termsChecked && (
                                <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <label
                            className="text-xs text-gray-400 cursor-pointer"
                            onClick={() => { setTerms(!termsChecked); setErrors(p => ({ ...p, terms: '' })) }}
                        >
                            I agree to the <span className="text-white hover:underline">Terms & Policy</span>
                        </label>
                    </div>
                    <span className="text-red-500 text-xs block min-h-4.5 mt-1 mb-5">{errors.terms}</span>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>

                    {/* Divider */}
                    <span className="flex items-center my-5 gap-3 text-xs text-gray-600 before:flex-1 before:content-[''] before:h-px before:bg-[#1f1f1f] after:flex-1 after:content-[''] after:h-px after:bg-[#1f1f1f]">
                        OR
                    </span>

                    <p className="text-center text-xs text-gray-500">
                        Already have an account?{' '}
                        <span className="text-white cursor-pointer hover:underline" onClick={() => navigate('/login')}>Log in</span>
                    </p>

                </form>
            </div>

            <p className="text-gray-700 text-xs mt-8">© {new Date().getFullYear()} Recur</p>
        </div>
    )
}

export default SignUp