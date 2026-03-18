import heart from '../assets/heart.png'

function Footer({ dark = false }) {
    return (
        <div className={`w-full max-w-7xl mx-auto px-6 flex justify-between items-center ${dark ? 'px-8 py-6 mb-4' : 'mt-12'}`} style={{ fontFamily: 'Geist' }}>
            <p className={`text-base ${dark ? 'text-gray-400' : 'text-gray-700'}`}>© {new Date().getFullYear()} Recur. All Rights Reserved.</p>
            <a href="https://github.com/desarus0" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center">
                    <img src={heart} alt="heart icon" className="w-12 h-12" />
                    <p className="text-base font-medium bg-linear-to-r from-[#ff86b9] via-gray500 to-gray-500 bg-clip-text text-transparent">Made with passion by Justin</p>
                </div>
            </a>
        </div>
    )
}

export default Footer
