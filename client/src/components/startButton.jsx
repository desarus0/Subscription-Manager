import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const KEYFRAMES = `
@keyframes btnGlowPulse {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%       { opacity: 0.8;  transform: scale(1.06); }
}
@keyframes btnGlowPulseBlack {
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50%       { opacity: 0.72; transform: scale(1.08); }
}
`

let styleInjected = false
function injectStyles() {
    if (styleInjected) return
    const el = document.createElement('style')
    el.textContent = KEYFRAMES
    document.head.appendChild(el)
    styleInjected = true
}

export default function StartButton({ children, href, variant = 'ghost', className = '' }) {
    const btnRef = useRef(null)
    const [mouse, setMouse] = useState({ x: 72, y: 50 })
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => { injectStyles() }, [])

    const handleMouseMove = (e) => {
        const btn = btnRef.current
        if (!btn) return
        const rect = btn.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMouse({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) })
    }

    const Tag = href ? Link : 'button'

    // White variant — purple glow
    if (variant === 'white') {
        return (
            <div
                className="relative inline-flex items-center cursor-pointer"
                style={{ isolation: 'isolate' }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); setMouse({ x: 72, y: 50 }) }}
            >
                <div className="pointer-events-none absolute rounded-full" style={{
                    inset: '-50px -60px',
                    background: `radial-gradient(ellipse 85% 180% at ${mouse.x}% 50%,
                        rgba(120,60,240,0.35) 0%,
                        rgba(60,20,180,0.15) 40%,
                        transparent 70%)`,
                    filter: 'blur(28px)',
                    animation: isHovered ? 'none' : 'btnGlowPulseBlack 3.8s ease-in-out infinite',
                    opacity: isHovered ? 0.9 : undefined,
                    transition: 'opacity 0.6s ease',
                }} />

                <div className="pointer-events-none absolute rounded-full" style={{
                    inset: '-18px -22px',
                    background: `radial-gradient(ellipse 75% 150% at ${mouse.x}% 50%,
                        rgba(180,130,255,0.85) 0%,
                        rgba(100,50,220,0.5) 28%,
                        rgba(40,10,140,0.15) 55%,
                        transparent 75%)`,
                    filter: 'blur(9px)',
                    opacity: isHovered ? 1 : 0.6,
                    transition: 'opacity 0.4s ease',
                }} />

                <div className="pointer-events-none absolute rounded-full" style={{
                    inset: '-3px',
                    background: `radial-gradient(ellipse 65% 130% at ${mouse.x}% 50%,
                        rgba(220,200,255,0.95) 0%,
                        rgba(140,80,255,0.65) 35%,
                        transparent 65%)`,
                    filter: 'blur(3px)',
                    opacity: isHovered ? 1 : 0.45,
                    transition: 'opacity 0.3s ease',
                }} />

                <div className="pointer-events-none absolute inset-0 rounded-full" style={{
                    padding: '1.5px',
                    background: `radial-gradient(ellipse 70% 140% at ${mouse.x}% 50%,
                        rgba(230,210,255,1) 0%,
                        rgba(160,100,255,0.8) 45%,
                        rgba(80,30,200,0.3) 75%,
                        transparent 100%)`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }} />

                <Tag ref={btnRef} to={href}
                    className={`relative flex items-center gap-2.5 overflow-hidden rounded-full h-11 px-7 font-semibold text-[13px] tracking-wide text-white ${className}`}
                    style={{ background: 'rgba(255,255,255,0.97)', color: '#1a0a3a' }}
                >
                    <div className="pointer-events-none absolute inset-0" style={{
                        background: `radial-gradient(ellipse 90% 130% at ${mouse.x}% ${mouse.y}%,
                            rgba(180,140,255,0.14) 0%,
                            rgba(100,60,220,0.06) 45%,
                            transparent 70%)`,
                        opacity: isHovered ? 1 : 0.5,
                        transition: 'opacity 0.3s ease',
                    }} />
                    <span className="relative" style={{ color: '#1a0a3a' }}>{children}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 9" className="w-4 h-3.5 relative" style={{ opacity: 0.7, color: '#1a0a3a' }}>
                        <path fill="currentColor" fillRule="evenodd" d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z" clipRule="evenodd" />
                    </svg>
                </Tag>
            </div>
        )
    }

    // Black variant — cinematic violet / deep space
    if (variant === 'black') {
        return (
            <div
                className="relative inline-flex items-center cursor-pointer"
                style={{ isolation: 'isolate' }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); setMouse({ x: 72, y: 50 }) }}
            >
                <div className="pointer-events-none absolute rounded-full" style={{
                    inset: '-50px -60px',
                    background: `radial-gradient(ellipse 85% 180% at ${mouse.x}% 50%,
                        rgba(120,60,240,0.35) 0%,
                        rgba(60,20,180,0.15) 40%,
                        transparent 70%)`,
                    filter: 'blur(28px)',
                    animation: isHovered ? 'none' : 'btnGlowPulseBlack 3.8s ease-in-out infinite',
                    opacity: isHovered ? 0.9 : undefined,
                    transition: 'opacity 0.6s ease',
                }} />

                <div className="pointer-events-none absolute rounded-full" style={{
                    inset: '-18px -22px',
                    background: `radial-gradient(ellipse 75% 150% at ${mouse.x}% 50%,
                        rgba(180,130,255,0.85) 0%,
                        rgba(100,50,220,0.5) 28%,
                        rgba(40,10,140,0.15) 55%,
                        transparent 75%)`,
                    filter: 'blur(9px)',
                    opacity: isHovered ? 1 : 0.6,
                    transition: 'opacity 0.4s ease',
                }} />

                <div className="pointer-events-none absolute rounded-full" style={{
                    inset: '-3px',
                    background: `radial-gradient(ellipse 65% 130% at ${mouse.x}% 50%,
                        rgba(220,200,255,0.95) 0%,
                        rgba(140,80,255,0.65) 35%,
                        transparent 65%)`,
                    filter: 'blur(3px)',
                    opacity: isHovered ? 1 : 0.45,
                    transition: 'opacity 0.3s ease',
                }} />

                <div className="pointer-events-none absolute inset-0 rounded-full" style={{
                    padding: '1.5px',
                    background: `radial-gradient(ellipse 70% 140% at ${mouse.x}% 50%,
                        rgba(230,210,255,1) 0%,
                        rgba(160,100,255,0.8) 45%,
                        rgba(80,30,200,0.3) 75%,
                        transparent 100%)`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }} />

                <Tag ref={btnRef} to={href}
                    className={`relative flex items-center gap-2.5 overflow-hidden rounded-full h-11 px-7 font-semibold text-[13px] tracking-wide text-white ${className}`}
                    style={{ background: '#060608' }}
                >
                    <div className="pointer-events-none absolute inset-0" style={{
                        background: `radial-gradient(ellipse 90% 130% at ${mouse.x}% ${mouse.y}%,
                            rgba(180,140,255,0.14) 0%,
                            rgba(100,60,220,0.06) 45%,
                            transparent 70%)`,
                        opacity: isHovered ? 1 : 0.5,
                        transition: 'opacity 0.3s ease',
                    }} />
                    <span className="relative">{children}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 9" className="w-4 h-3.5 relative opacity-70">
                        <path fill="currentColor" fillRule="evenodd" d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z" clipRule="evenodd" />
                    </svg>
                </Tag>
            </div>
        )
    }

    // Ghost variant (default)
    return (
        <div
            className="relative inline-flex items-center cursor-pointer"
            style={{ isolation: 'isolate' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setMouse({ x: 72, y: 50 }) }}
        >
            <div className="pointer-events-none absolute inset-0 rounded-full" style={{
                padding: '1px',
                background: `radial-gradient(ellipse 60% 130% at ${mouse.x}% 50%, rgba(200,220,255,0.6) 0%, transparent 70%)`,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                opacity: isHovered ? 1 : 0.4,
                transition: 'opacity 0.25s ease',
            }} />
            <Tag ref={btnRef} to={href}
                className={`relative flex items-center gap-2.5 overflow-hidden rounded-full h-11 px-7 font-medium text-[13px] tracking-wide border border-white/15 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors duration-200 ${className}`}
            >
                <div className="pointer-events-none absolute inset-0" style={{
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    background: `radial-gradient(ellipse 70% 100% at ${mouse.x}% ${mouse.y}%, rgba(220,235,255,0.08) 0%, transparent 65%)`,
                }} />
                {children}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 9" className="w-4 h-3.5 opacity-70">
                    <path fill="currentColor" fillRule="evenodd" d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z" clipRule="evenodd" />
                </svg>
            </Tag>
        </div>
    )
}
