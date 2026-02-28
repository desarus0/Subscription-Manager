import { useState, useRef, useEffect } from 'react'
import { useSignUp } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/logo.jsx'

function VerifyPage() {
    const { signUp, setActive } = useSignUp()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [code, setCode] = useState(['', '', '', '', '', ''])
    const inputRefs = useRef([])

    const [countdown, setCountdown] = useState(0)
    useEffect(() => {
        if(countdown === 0) return

        const timer = setTimeout(() => {
            setCountdown(countdown - 1)
        }, 1000)

        return () => clearTimeout(timer)
    }, [countdown])

    function handleChange(index, value){
        if (!/^\d*$/.test(value)) return  // numbers only
        
        const newCode = [...code]
        newCode[index] = value.slice(-1)  // only keep last digit
        setCode(newCode)

        if(value && index < 5){
            inputRefs.current[index + 1].focus() // move to next
        }
    }

    function handleKeyDown(index, e){
        if(e.key === 'Backspace' && !code[index] && index > 0){
            inputRefs.current[index - 1].focus() // move to previous
        }
    }

    function handlePaste(e){
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6) // get digits only, max 6
        const newCode = [...code]

        pasted.split('').forEach((char, i) => {
            newCode[i] = char

        })
        setCode(newCode)

        const lastIndex = Math.min(pasted.length - 1, 5)
        inputRefs.current[lastIndex].focus() // focus last pasted digit
    }

    async function handleResend() {
        try {
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code'} )
            setError('')
            setCountdown(30)
        } catch (error) {
            setError('Failed to resend code. Please try again.')
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        setError('')

        const verificationCode = code.join('')
        if(verificationCode.trim() === '') {
            setError('Verification code is required')
            return
        } else if (verificationCode.trim().length !== 6) {
            setError('Verification code must be 6 digits')
            return
        }

        setIsLoading(true)

        try {
            const verificationAttempt = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            })

            if(verificationAttempt.status === "complete"){
                await setActive({ session: verificationAttempt.createdSessionId })

                try {
                    const res = await fetch('http://localhost:8000/api/v1/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: signUp.emailAddress,
                            name: `${signUp.firstName} ${signUp.lastName}`
                        })
                    })
                    
                    if(!res.ok){
                        setError('Something went wrong. Please try again.')
                        return
                    }

                    navigate('/dashboard')
                } catch (error) {
                        setIsLoading(false)
                        setError('Something went wrong. Please try again.')
                    }
                }  
        } catch (error) {
            setIsLoading(false)
            if (error.errors) {
                error.errors.forEach(err => {
                    if (err.code === 'form_code_incorrect') setError('Incorrect code. Please try again.')
                    else if (err.code === 'verification_expired') setError('Code expired. Click resend to get a new one.')
                    else setError('Verification failed. Please try again.')
                })
            } else {
                setError('Something went wrong. Please try again.')
            }
        }
    }

    const inputBase = `w-12 h-12 text-center text-white text-lg font-semibold bg-[#111111] border rounded-lg outline-none transition-all duration-150 mb-4`
    const inputClass = (error) => `${inputBase} ${error ? 'border-red-500 border-2' : 'border-[#2a2a2a] focus:border-white focus:border-2'}`

    return(
        <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4">

            {/* Logo */}
            <Logo />

            {/* Card */}
            <div className="w-full max-w-md bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl px-8 py-10 shadow-2xl">
                <h1 className="text-white text-2xl font-semibold mb-1 tracking-tight" style={{ fontFamily: 'Google Sans' }}>
                    Verification Required
                </h1>
                <p className="text-gray-500 text-sm mb-8">
                    We've sent a verification code to {(() => {
                        const email = signUp?.emailAddress || ''
                        const [local, domain] = email.split('@')
                        return `${local?.slice(0, 2)}***@${domain}`
                    })()} <br></br>
                    Enter the 6-digit code below. 
                </p>

                {/* Input */}
                <div className="flex gap-3 justify-between">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            maxLength="1"
                            className={inputClass(error)}
                            value={digit}
                            onChange={(e) => { handleChange(index, e.target.value); setError('') }}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                        />
                    ))}
                </div>

                <span className="text-red-500 text-xs min-h-4.5 mt-1 text-center block mb-4">{error}</span>

                {/* Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition cursor-pointer disabled:opacity-50 mb-4"
                    onClick={handleSubmit}
                >
                    {isLoading ? 'Verifying email...' : 'Submit'}
                </button>

                {/* Resend */}
                <p className="text-center text-xs text-gray-500">
                    Didn't recieve the code? {' '}
                    {countdown > 0 
                        ? <span className="text-gray-500 text-xs">Resend in {countdown}s</span>
                        : <span className="text-white cursor-pointer hover:underline" onClick={handleResend}>Resend</span>
                    }
                </p>
            </div>

            <p className="text-gray-700 text-xs mt-8">© {new Date().getFullYear()} Recur</p>
        </div>
    )
}

export default VerifyPage