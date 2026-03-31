import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Auth
  token: localStorage.getItem('token') || null,
  userEmail: localStorage.getItem('userEmail') || null,

  setAuth: (token, email) => {
    localStorage.setItem('token', token)
    if (email) localStorage.setItem('userEmail', email)
    set({ token, userEmail: email })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    set({ token: null, userEmail: null, threads: [], activeThread: null, blueprint: null, factoryKit: null, downloadUrl: null, messages: [] })
  },

  // Threads (sidebar history)
  threads: [],
  setThreads: (threads) => set({ threads }),
  addThread: (thread) => set((s) => ({
    threads: [thread, ...s.threads.filter(t => t._id !== thread._id)]
  })),

  // Active session
  activeThread: null,
  setActiveThread: (thread) => set({
    activeThread: thread,
    blueprint: thread?.blueprint || null,
    factoryKit: thread?.factoryKit || null,
    downloadUrl: thread?.downloadUrl || null,
    messages: []
  }),

  // Blueprint from API response (shown in BlueprintViewer)
  blueprint: null,
  setBlueprint: (bp) => set({ blueprint: bp }),

  // FactoryKit from API response (shown in FactoryKitViewer)
  factoryKit: null,
  setFactoryKit: (kit) => set({ factoryKit: kit }),

  // Download URL for the generated project zip
  downloadUrl: null,
  setDownloadUrl: (url) => set({ downloadUrl: url }),

  // Chat messages for current session
  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
  clearSession: () => set({ activeThread: null, blueprint: null, factoryKit: null, downloadUrl: null, messages: [] }),
}))

export default useStore