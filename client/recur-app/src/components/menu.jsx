import Logo from '../components/logo.jsx'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, CreditCard, BarChart2, Settings } from 'lucide-react'

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Subscriptions', icon: CreditCard, path: '/subscriptions' },
    { label: 'Analytics', icon: BarChart2, path: '/analytics' },
]

const bottomItems = [
    { label: 'Settings', icon: Settings, path: '/settings' },
]

function Menu(){
    const navigate = useNavigate()
    const location = useLocation()

    return(
        <div className="w-64 h-screen bg-[#0a0a0a] border-r border-[#1f1f1f] flex flex-col px-4 py-6">
            
            {/* Logo */}
            <div className="px-2 hover:cursor-pointer" onClick={() => navigate('/')}>
                <Logo />
            </div>

            {/* Nav items */}
            <div className="flex flex-col gap-1">
                {navItems.map(item => {
                    const isActive = location.pathname === item.path
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer w-full text-left
                                ${isActive 
                                    ? 'bg-[#1f1f1f] text-white' 
                                    : 'text-gray-400 hover:bg-[#161616] hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    )
                })}
            </div>

            {/* Bottom items */}
            <div className="mt-auto flex flex-col gap-1">
                {bottomItems.map(item => {
                    const isActive = location.pathname === item.path
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer w-full text-left
                                ${isActive 
                                    ? 'bg-[#1f1f1f] text-white' 
                                    : 'text-gray-400 hover:bg-[#161616] hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Menu