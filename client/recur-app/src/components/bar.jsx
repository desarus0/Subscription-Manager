import { useUser } from '@clerk/clerk-react'

function TopBar(){
    const { user } = useUser()

    const firstName = `${user?.firstName || ''}`.charAt(0).toUpperCase() + `${user?.firstName || ''}`.slice(1).toLowerCase().trim()
    const lastName = `${user?.lastName || ''}`.charAt(0).toUpperCase() + `${user?.lastName || ''}`.slice(1).toLowerCase().trim()
    const fullName = `${firstName} ${lastName}`.trim() || 'User'
    
    const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()

    return (
        <div>
            <div className="flex justify-end text-white overflow-hidden h-18">
                <div className="hover:cursor-pointer flex">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 my-3">
                        <span className="text-white text-normal font-semibold">{initials}</span>
                    </div>
                    <span className="text-white my-4.75 mr-12" style={{ fontFamily: 'Bricolage Grotesque' }}>{fullName}</span>
                </div>
            </div>
            <div className="w-full h-px bg-[#1f1f1f]" />
        </div>
    )
}

export default TopBar