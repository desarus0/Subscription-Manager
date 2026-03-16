import { useRef, useState } from 'react'

export default function StartButton({ children, href, className = '' }) {
    const btnRef = useRef(null)
    const [mouseX, setMouseX] = useState(50)
    const [isHovered, setIsHovered] = useState(false)
    const [gradientX, setGradientX] = useState(0)

    const handleMouseMove = (e) => {
        const btn = btnRef.current
        if (!btn) return
        const rect = btn.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const clamped = Math.max(-rect.width / 2 + 10, Math.min(rect.width / 2 - 10, x))
        setGradientX(clamped)
        // percentage across the button for the border glow position
        const pct = ((e.clientX - rect.left) / rect.width) * 100
        setMouseX(Math.min(100, Math.max(0, pct)))
    }

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => {
        setIsHovered(false)
        setMouseX(50)
        setGradientX(0)
    }

    const Tag = href ? 'a' : 'button'

    return (
        <div
            className="relative inline-flex items-center"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Glowing border outline that follows cursor */}
            <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                    padding: '1px',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    background: `radial-gradient(ellipse 40% 100% at ${mouseX}% 50%, rgba(255,220,150,0.9) 0%, rgba(255,160,80,0.6) 30%, transparent 70%)`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />

            {/* Button */}
            <Tag
                ref={btnRef}
                href={href}
                className={`relative z-10 flex items-center justify-center overflow-hidden rounded-full border border-white/30 bg-[#d1d1d1] h-10 px-16 uppercase font-bold text-[12px] tracking-[-0.015em] space-x-1 ${className}`}
            >
                {/* Inner glow */}
                <div
                    className="pointer-events-none absolute -z-10 flex w-51 items-center justify-center"
                    style={{
                        transform: `translateX(${gradientX}px) translateZ(0px)`,
                    }}
                >
                    <div
                        className="absolute top-1/2 h-30.25 w-30.25 -translate-y-1/2"
                        style={{
                            background:
                                'radial-gradient(50% 50% at 50% 50%, #FFFFF5 3.5%, #FFAA81 26.5%, #FFDA9F 37.5%, rgba(255,170,129,0.50) 49%, rgba(210,106,58,0.00) 92.5%)',
                        }}
                    />
                    <div
                        className="absolute top-1/2 h-25.75 w-51 -translate-y-1/2"
                        style={{
                            background:
                                'radial-gradient(43.3% 44.23% at 50% 49.51%, #FFFFF7 29%, #FFFACD 48.5%, #F4D2BF 60.71%, rgba(214,211,210,0.00) 100%)',
                            filter: 'blur(5px)',
                        }}
                    />
                </div>

                {children}
            </Tag>
        </div>
    )
}