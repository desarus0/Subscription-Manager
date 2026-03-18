import { createContext, useContext, useState } from 'react'

const AddSubContext = createContext()

export function AddSubProvider({ children }) {
    const [open, setOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    function openSheet() { setOpen(true) }
    function triggerRefresh() { setRefreshKey(k => k + 1) }

    return (
        <AddSubContext.Provider value={{ open, setOpen, openSheet, refreshKey, triggerRefresh }}>
            {children}
        </AddSubContext.Provider>
    )
}

export function useAddSub() { return useContext(AddSubContext) }
