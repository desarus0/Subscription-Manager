import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'
import { Link } from 'react-router-dom'

function Pricing() {
    return (
        <div style={{ background: '#080808' }} className="h-screen overflow-hidden flex flex-col justify-between">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ fontFamily: 'Geist' }}>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400 mb-8">
                    Free forever
                </div>

                <h1 className="text-5xl font-bold text-white mb-6 tracking-tight max-w-xl leading-tight" style={{ fontFamily: 'Bricolage Grotesque' }}>
                    Simple pricing.
                </h1>

                <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
                    Recur is a free, open-source platform built as a personal project to track subscription spending. No subscriptions, no tiers, and no paywalls.
                </p>

                <div className="w-full max-w-sm bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8">
                    <div className="text-4xl font-bold text-white mb-1">$0</div>
                    <div className="text-sm text-gray-500 mb-6">forever</div>
                    <ul className="text-sm text-gray-400 text-left space-y-3 mb-8">
                        {[
                            'Unlimited subscriptions',
                            'Analytics & spending insights',
                            'Renewal reminders',
                            'Open source & self-hostable',
                        ].map(f => (
                            <li key={f} className="flex items-center gap-2">
                                <span className="text-white">✓</span> {f}
                            </li>
                        ))}
                    </ul>
                    <Link
                        to="/register"
                        className="block w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition text-center"
                    >
                        Get started
                    </Link>
                </div>

            </div>
            <Footer dark />
        </div>
    )
}

export default Pricing
