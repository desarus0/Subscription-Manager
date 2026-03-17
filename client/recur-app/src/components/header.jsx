import logo from '../assets/logo.png'
import { Github } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Header() {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    return(
        <header className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-black/30 backdrop-blur-md' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className = "flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} className="w-10 h-10" alt="Recur logo" />
                        <span className="text-white text-2xl font-semibold" style={{ fontFamily: 'Bricolage Grotesque' }}>Recur</span>
                    </Link>

                    <nav className="flex items-center gap-1 pl-8" style={{ fontFamily: 'Geist' }}>
                        <Link to="/pricing" className="px-3 text-[15px] text-gray-100 hover:text-[#4a6fb8]">Pricing</Link>
                        <Link to="/resources" className="px-3 text-[15px] text-gray-100 hover:text-[#4a6fb8]">Resources</Link>
                        <Link to="/download" className="px-3 text-[15px] text-gray-100 hover:text-[#4a6fb8]">Download</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4" style={{ fontFamily: 'Geist' }}>
                    <a href="https://github.com/desarus0/Subscription-Manager" target="_blank" className="flex items-center gap-2 text-gray-100 hover:text-gray-400 text-sm font-medium">
                        <Github className="w-4 h-4" />
                        Star Us
                    </a>
                    <Link to="/login" className="px-4 py-1.5 text-xs font-medium tracking-wide text-gray-100 border border-white/40 rounded-full hover:bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        SIGN IN
                    </Link>
                    <Link to="/register" className="px-4 py-1.5 text-xs font-medium tracking-wide text-gray-100 border border-white/40 rounded-full hover:bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        SIGN UP
                    </Link>
                </div>
            </div>
        </header>
        )
}

export default Header