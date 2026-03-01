import TopBar from "../components/bar";
import Menu from "../components/menu"
import { useUser } from "@clerk/clerk-react";

function Dashboard() {
    const { user } = useUser()

    const firstName = `${user?.firstName || ''}`.charAt(0).toUpperCase() + `${user?.firstName || ''}`.slice(1).toLowerCase().trim()
    const lastName = `${user?.lastName || ''}`.charAt(0).toUpperCase() + `${user?.lastName || ''}`.slice(1).toLowerCase().trim()
    const fullName = `${firstName} ${lastName}`.trim() || 'User'

    return (
        <div className="flex h-screen bg-[#080808]">
            <Menu />
            <div className="flex flex-col flex-1">
                <TopBar />
                
                <div className="flex-1 overflow-auto p-8">
                    <span className="text-white font-semibold text-4xl tracking-tight" style={{ fontFamily: 'Bricolage Grotesque' }}>
                        Dashboard
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Dashboard