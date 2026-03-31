import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Brain, Sparkles, FileText, Wrench } from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import ChatPanel from '../components/ChatPanel.jsx'
import BlueprintViewer from '../components/BlueprintViewer.jsx'
import FactoryKitViewer from '../components/FactoryKitViewer.jsx'
import useStore from '../store/useStore.js'

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col items-center justify-center text-center px-8"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-[60px] rounded-full"
          style={{ background: 'rgba(124,109,250,0.2)' }} />
        <div className="relative w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: 'var(--color-surface-high)', border: '1px solid var(--color-border-bright)' }}>
          <Brain size={40} style={{ color: 'var(--color-primary-light)' }} />
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-3"
        style={{ fontFamily: 'var(--font-syne)', color: 'var(--color-text)' }}>
        Ready to architect your vision?
      </h3>
      <p className="text-sm leading-relaxed max-w-sm"
        style={{ color: 'var(--color-muted-bright)' }}>
        Describe any AI use case in the chat panel. I'll evaluate it, generate a complete
        technical blueprint, then build out the full project scaffold after your approval.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-10 w-full max-w-xl">
        {[
          { icon: Sparkles, title: 'RAG Document Assistant', desc: 'Knowledge-based AI agent with vector search' },
          { icon: Brain, title: 'Agentic Workflow', desc: 'React-based multi-step AI task automation' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title}
            className="p-5 rounded-2xl text-left cursor-pointer transition-all duration-200 hover:border-primary"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <Icon size={20} className="mb-3" style={{ color: 'var(--color-primary-light)' }} />
            <h4 className="font-semibold text-sm mb-1"
              style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-text)' }}>{title}</h4>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// View switcher tab
function ViewTab({ id, label, icon: Icon, active, onClick, disabled }) {
  return (
    <button
      onClick={() => !disabled && onClick(id)}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-150"
      style={{
        background: active ? 'var(--color-primary-dim)' : 'transparent',
        color: active ? 'var(--color-primary-light)' : disabled ? 'var(--color-muted)' : 'var(--color-muted-bright)',
        border: active ? '1px solid rgba(124,109,250,0.25)' : '1px solid transparent',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {Icon && <Icon size={12} />}
      {label}
    </button>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { blueprint, factoryKit, downloadUrl, clearSession, logout } = useStore()
  // 'blueprint' | 'factory'
  const [activeView, setActiveView] = useState('blueprint')

  // Auto-switch to factory view when kit arrives
  useEffect(() => {
    if (factoryKit) setActiveView('factory')
  }, [factoryKit])

  // If blueprint arrives but no kit yet, ensure we show blueprint
  useEffect(() => {
    if (blueprint && !factoryKit) setActiveView('blueprint')
  }, [blueprint])

  const handleNewSession = () => {
    clearSession()
    setActiveView('blueprint')
  }

  const hasContent = blueprint || factoryKit

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--color-background)' }}>
      {/* Left Sidebar */}
      <Sidebar onNewSession={handleNewSession} />

      {/* Main Content */}
      <main className="flex-1 ml-[220px] mr-[380px] flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-5 shrink-0"
          style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h2 className="text-xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-syne)', color: 'var(--color-text)' }}>
              Blueprint <span style={{ color: 'var(--color-primary)' }}>Viewer</span>
            </h2>
            <p className="text-xs mt-0.5 uppercase tracking-widest"
              style={{ color: 'var(--color-muted)' }}>
              AI Use Case Evaluation Engine
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View switcher — only shown when there's content */}
            {hasContent && (
              <div className="flex items-center gap-1 p-1 rounded-xl"
                style={{ background: 'var(--color-surface-high)', border: '1px solid var(--color-border)' }}>
                <ViewTab
                  id="blueprint"
                  label="Blueprint"
                  icon={FileText}
                  active={activeView === 'blueprint'}
                  onClick={setActiveView}
                  disabled={!blueprint}
                />
                <ViewTab
                  id="factory"
                  label="Factory Kit"
                  icon={Wrench}
                  active={activeView === 'factory'}
                  onClick={setActiveView}
                  disabled={!factoryKit}
                />
              </div>
            )}

            {/* Status dot */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full pulse-teal"
                style={{ background: 'var(--color-teal)' }} />
              <span className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--color-muted)' }}>System Ready</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <AnimatePresence mode="wait">
            {!hasContent ? (
              <motion.div
                key="empty"
                className="h-full flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState />
              </motion.div>
            ) : activeView === 'blueprint' && blueprint ? (
              <motion.div
                key="blueprint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <BlueprintViewer blueprint={blueprint} />
              </motion.div>
            ) : activeView === 'factory' && factoryKit ? (
              <motion.div
                key="factory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <FactoryKitViewer factoryKit={factoryKit} downloadUrl={downloadUrl} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-3 shrink-0"
          style={{ borderTop: '1px solid var(--color-border)' }}>
          <span className="text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--color-muted)' }}>
            v1.0.0 · BlueprintAI
          </span>
          <span className="text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--color-muted)' }}>
            FastAPI + LangGraph + Groq
          </span>
        </div>
      </main>

      {/* Right Chat Panel */}
      <ChatPanel />
    </div>
  )
}