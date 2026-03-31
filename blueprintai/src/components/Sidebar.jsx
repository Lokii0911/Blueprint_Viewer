import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LayoutGrid, Plus, LogOut, MessageSquare, Clock, Compass } from 'lucide-react'
import { cn } from '../lib/utils.js'
import useStore from '../store/useStore.js'

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function getUseCaseName(thread) {
  // Try to get use case name from blueprint step1
  const name = thread?.blueprint?.blueprint?.step1?.usecasename
  if (name) return name
  // Fallback to thread id truncated
  return `Session ${thread._id?.slice(0, 8) || '...'}`
}

export default function Sidebar({ onNewSession }) {
  const { threads, activeThread, setActiveThread, logout, userEmail } = useStore()

  return (
    <aside className="w-[220px] h-full fixed left-0 top-0 flex flex-col py-6 px-3 z-50"
      style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>

      {/* Logo */}
      <div className="mb-6 px-3">
        <div className="flex items-center gap-2 mb-1">
          <Compass size={18} style={{ color: 'var(--color-primary)' }} />
          <h1 className="text-base font-bold tracking-tight" style={{ fontFamily: 'var(--font-syne)', color: 'var(--color-text)' }}>
            Blueprint<span style={{ color: 'var(--color-primary)' }}>AI</span>
          </h1>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-muted)' }}>
          Evaluation Engine
        </p>
      </div>

      {/* New Session */}
      <button
        onClick={onNewSession}
        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl mb-6 text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), #5b4ef7)', color: '#fff', fontFamily: 'var(--font-headline)' }}
      >
        <Plus size={15} />
        New Session
      </button>

      {/* Nav */}
      <nav className="mb-6">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
          style={{ color: 'var(--color-muted)' }}>Menu</p>
        <button
          className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-all duration-200"
          style={{ color: 'var(--color-primary-light)', background: 'var(--color-primary-dim)' }}
        >
          <LayoutGrid size={16} />
          Dashboard
        </button>
      </nav>

      {/* Thread History */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
          style={{ color: 'var(--color-muted)' }}>Sessions</p>

        {threads.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <MessageSquare size={20} className="mx-auto mb-2" style={{ color: 'var(--color-muted)' }} />
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>No sessions yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence>
              {threads.map((thread) => {
                const isActive = activeThread?._id === thread._id
                const name = getUseCaseName(thread)
                return (
                  <motion.button
                    key={thread._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setActiveThread(thread)}
                    className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group"
                    style={{
                      background: isActive ? 'var(--color-primary-dim)' : 'transparent',
                      border: isActive ? '1px solid rgba(124,109,250,0.2)' : '1px solid transparent',
                    }}
                  >
                    <p className="text-xs font-medium truncate leading-snug"
                      style={{ color: isActive ? 'var(--color-primary-light)' : 'var(--color-muted-bright)' }}>
                      {name}
                    </p>
                    {thread.updated_at && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={10} style={{ color: 'var(--color-muted)' }} />
                        <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                          {formatTime(thread.updated_at)}
                        </span>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* User + Logout */}
      <div className="pt-4 mt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
        {userEmail && (
          <p className="px-3 text-xs truncate mb-3" style={{ color: 'var(--color-muted)' }}>
            {userEmail}
          </p>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-all duration-200 hover:bg-surface-high"
          style={{ color: 'var(--color-muted)' }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
