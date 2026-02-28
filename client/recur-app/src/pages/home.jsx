import { useNavigate } from 'react-router-dom'
import Header from '../components/header.jsx'

function Home(){
    const navigate = useNavigate()
    return(
        <div className="min-h-screen bg-[#080808]">
            
            <div className="relative overflow-hidden min-h-screen">
                
                {/* Video */}
                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-40">
                    <source src="/src/assets/home.mp4" type="video/mp4" />
                </video>

                {/* Top fade */}
                <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-[#080808] to-transparent z-10" />
                
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#080808] to-transparent z-10" />

                {/* Content */}
                <div className="relative z-10 pt-32">
                    <span className="text-white font-semibold text-[280px] tracking-tight flex justify-center items-center leading-none" style={{ fontFamily: 'Bricolage Grotesque' }}>
                        Recur
                    </span>
                    <p className="text-gray-400 text-2xl mt-4 font-bold text-center" style={{ fontFamily: 'Google Sans'}}>
                        For a life less cluttered by subscriptions
                    </p>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="cursor-pointer bg-white text-black text-3xl font-semibold rounded-full hover:bg-black hover:text-white duration-500 transition absolute bottom-20 left-1/2 transform -translate-x-1/2 py-5 z-10 px-18"
                    style={{ fontFamily: 'Google Sans' }}
                    onClick={() => navigate('/register')}
                >
                    Start Now
                </button>
            </div>

        </div>
    )
}

export default Home