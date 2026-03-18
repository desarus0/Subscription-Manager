import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'
import { Github } from 'lucide-react'

function Resources() {
    return (
        <div style={{ background: '#080808' }} className="h-screen overflow-hidden flex flex-col justify-between">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ fontFamily: 'Geist' }}>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400 mb-8">
                    Open source
                </div>

                <h1 className="text-5xl font-bold text-white mb-6 tracking-tight max-w-xl leading-tight" style={{ fontFamily: 'Bricolage Grotesque' }}>
                    Resources &amp; support
                </h1>

                <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
                    All documentation, and support are all available on GitHub. If you run into an issue or have a question, open an issue.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="https://github.com/desarus0/Subscription-Manager"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition"
                    >
                        <Github className="w-4 h-4" />
                        View on GitHub
                    </a>
                    <a
                        href="https://github.com/desarus0/Subscription-Manager/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2.5 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition"
                    >
                        Open an issue
                    </a>
                </div>

            </div>
            <Footer dark />
        </div>
    )
}

export default Resources
