import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'
import StartButton from '../components/startButton.jsx'
import LaserFlow from '../components/reactbits/laser.jsx'
import dashboardImg from '../assets/dashboard.png'

function Home() {
    return (
        <div style={{ background: '#080808', overflowX: 'hidden' }}>

            {/* Hero section */}
            <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>

                {/* Laser background */}
                <LaserFlow
                    verticalSizing={5}
                    verticalBeamOffset={-0.2}
                    horizontalSizing={0.5}
                    fogIntensity={0.3}
                    fogScale={0.2}
                    color="#ebffff"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0
                    }}
                />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <Header className="z-50"/>

                    <main className="pt-32 max-w-7xl mx-auto px-6" style={{ fontFamily: 'Geist' }}>
                        <h1 className="text-7xl font-black text-white leading-tight">
                            For a life less <br />cluttered by <br /> subscriptions
                        </h1>

                        <p className="mt-4 text-gray-100 text-lg max-w-sm">
                            Recur, an open-source platform, empowering you to effortlessly track all your subscriptions in one place.
                        </p>

                        <div className="mt-8">
                            <StartButton href="/register" variant="white">
                                Start Now
                            </StartButton>
                        </div>
                    </main>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        bottom: '-155px',
                        left: '56%',
                        transform: 'translateX(-50%)',
                        width: '70%',
                        maxWidth: '900px',
                        zIndex: 2,
                    }}
                >
                    <img
                        src={dashboardImg}
                        alt="dashboard preview"
                        style={{
                            width: '100%',
                            borderRadius: '16px',
                            boxShadow: '0 0 80px rgba(235,255,255,0.25)'
                        }}
                    />
                </div>

                {/* Bottom fade */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-240px',
                        left: 0,
                        width: '100%',
                        height: '900px',
                        background: 'linear-gradient(to bottom, transparent 60%, #080808 90%)',
                        zIndex: 3,
                        pointerEvents: 'none'
                    }}
                />

            </div>

            <div className="max-w-7xl mx-auto px-6 pt-65 mb-10" style={{ fontFamily: 'Geist' }}>
                <h2 className="text-sm text-gray-400 pb-2">
                    Everything you need for subscription management:
                </h2>

                <span className="text-white">Smart renewal reminders</span>
                <span className="text-gray-500"> • </span>

                <span className="text-white">Spending analytics</span>
                <span className="text-gray-500"> • </span>

                <span className="text-white">Subscription breakdown</span>
                <span className="text-gray-500"> • </span>

                <span className="text-white">Upcoming charges</span>
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

                    <StartButton href="/register" variant="black">
                        Start Now
                    </StartButton>

                </div>

                <Footer />
            </div>

        </div>
    )
}

export default Home