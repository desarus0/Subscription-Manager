import Header from '../components/header.jsx'
import StartButton from '../components/startButton.jsx'
import LaserFlow from '../components/reactbits/laser.jsx'
import dashboardImg from '../assets/dashboard.png'
import heart from '../assets/heart.png'

function Home(){
    return(
        <div style={{ background: '#080808', overflowX: 'hidden' }}>

            <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>

                <LaserFlow verticalSizing={5} verticalBeamOffset={-0.2} horizontalSizing={0.5} color="#ebffff"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Header />

                    <img
                        src={dashboardImg}
                        alt="dashboard preview"
                        style={{
                            position: 'absolute',
                            top: '635px',
                            left: '55%',
                            transform: 'translateX(-50%)',
                            width: '70%',
                            maxWidth: '900px',
                            borderRadius: '12px',
                            zIndex: 2
                        }}
                    />

                    <main className="pt-32 max-w-7xl mx-auto px-6" style={{ fontFamily: 'Geist' }}>
                        <h1 className="text-7xl font-black text-white leading-tight">
                            For a life less <br />cluttered by <br /> subscriptions
                        </h1>

                        <p className="mt-4 text-gray-100 text-lg max-w-sm">
                            Recur, an open-source platform, empowering you to effortlessly track all your subscriptions in one place.
                        </p>

                        <div className="mt-8">
                            <StartButton href="/register">
                                <span className="relative z-10 text-[#5A250A]">Start Now</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 17 9"
                                    className="relative z-10 h-2.25 w-4.25 text-[#5A250A]"
                                >
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"
                                    clipRule="evenodd"
                                />
                                </svg>
                            </StartButton>
                        </div>
                    </main>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '-230px',
                    left: 0,
                    width: '100%',
                    height: '300px',
                    background: 'linear-gradient(to bottom, transparent 0%, transparent 30%, #080808 100%)',
                    zIndex: 3,
                    pointerEvents: 'none'
                }} />

            </div>

            <div className="max-w-7xl mx-auto px-6 pt-80 mb-10" style={{ fontFamily: 'Geist' }}>
                <h2 className="text-sm text-gray-400 pb-2">Everything you need for subscription management:</h2>
                <span className="text-white">Smart renewal reminders</span>
                <span className="text-gray-500"> • </span>

                <span className="text-white">Spending analytics</span>
                <span className="text-gray-500"> • </span>

                <span className="text-white">Subscription breakdown</span>
                <span className="text-gray-500"> • </span>

                <span className="text-white mb">Upcoming charges</span>
            </div>


            <div
            style={{
                background: "white",
                width: "100%",
                paddingTop: "120px",
                paddingBottom: "20px"
            }}
            >
                <div className="max-w-7xl mx-auto px-6" style={{ fontFamily: "Geist" }}>
                    
                    <h2 className="text-5xl font-bold text-black">
                    Take control of <br /> your subscriptions
                    </h2>

                    <p className="mt-4 text-gray-600 max-w-xl text-lg mb-6">
                    Recur helps you understand exactly where your money goes every month.
                    Track recurring payments, analyze spending patterns, and never forget a renewal again.
                    </p>

                    <StartButton href="/register">
                        <span className="relative z-10 text-[#5A250A]">Start Now</span>
                    </StartButton>

                </div>

                <div className="max-w-7xl mx-auto px-6 mt-12 flex justify-between items-center" style={{ fontFamily: 'Geist' }}>
                    <p className="text-gray-700 text-base">© {new Date().getFullYear()} Recur. All Rights Reserved.</p>

                    <a href="https://github.com/desarus0" target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center"> 
                            <img src={heart} alt="heart icon" className="w-12 h-12" />
                            <p className="text-base font-medium bg-linear-to-r from-[#ff86b9] via-gray500 to-gray-500 bg-clip-text text-transparent">Made with passion by Justin</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Home
