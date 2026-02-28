import logo from '../assets/logo.png'

function Logo() {
    return (
        <div className="flex items-center gap-2 mb-10">
            <img src={logo} className="w-9 h-9" alt="Recur logo" />
            <span className="text-white font-semibold text-4xl tracking-tight" style={{ fontFamily: 'Bricolage Grotesque' }}>
                Recur
            </span>
        </div>
    )
}

export default Logo