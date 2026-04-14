import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode:      localStorage.getItem('darkMode') === 'true',
    mobileMenuOpen: false,
    chatOpen:      false,
    searchOpen:    false,
  },
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', state.darkMode)
      document.documentElement.classList.toggle('dark', state.darkMode)
      document.body.classList.toggle('dark', state.darkMode)
    },
    setDarkMode(state, { payload }) {
      state.darkMode = payload
      document.documentElement.classList.toggle('dark', payload)
      document.body.classList.toggle('dark', payload)
    },
    toggleMobileMenu(state) { state.mobileMenuOpen = !state.mobileMenuOpen },
    closeMobileMenu(state)  { state.mobileMenuOpen = false },
    toggleChat(state)  { state.chatOpen = !state.chatOpen },
    closeChat(state)   { state.chatOpen = false },
    toggleSearch(state) { state.searchOpen = !state.searchOpen },
    closeSearch(state)  { state.searchOpen = false },
  },
})

export const { toggleDarkMode, setDarkMode, toggleMobileMenu, closeMobileMenu,
               toggleChat, closeChat, toggleSearch, closeSearch } = uiSlice.actions
export default uiSlice.reducer
