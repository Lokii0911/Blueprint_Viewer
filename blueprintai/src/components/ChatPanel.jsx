import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUp, Sparkles, Brain, AlertCircle, Settings, CheckCircle2, XCircle, RefreshCw, Download } from 'lucide-react'
import api from '../lib/api.js'
import useStore from '../store/useStore.js'

function getFinalResponse(result) {
  if (result?.final_response) return result.final_response
  const messages = result?.messages
  if (!Array.isArray(messages)) return 'Done.'
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    const t = msg?.type || msg?.role
    if (t === 'ai' || t === 'assistant') {
      return typeof msg.content === 'string' ? msg.content : 'Blueprint generated.'
    }
  }
  return 'Done.'
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3 rounded-2xl rounded-tl-none w-fit"
      style={{ background: 'var(--color-surface-high)', border: '1px solid var(--color-border)' }}>
      <div className="w-1.5 h-1.5 rounded-full dot-1" style={{ background: 'var(--color-muted)' }} />
      <div className="w-1.5 h-1.5 rounded-full dot-2" style={{ background: 'var(--color-muted)' }} />
      <div className="w-1.5 h-1.5 rounded-full dot-3" style={{ background: 'var(--color-muted)' }} />
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: 'var(--color-primary-dim)', border: '1px solid rgba(124,109,250,0.2)' }}>
          <Sparkles size={12} style={{ color: 'var(--color-primary-light)' }} />
        </div>
      )}
      <div
        className="max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={isUser ? {
          background: 'linear-gradient(135deg, var(--color-primary), #5b4ef7)',
          color: '#fff',
          borderBottomRightRadius: '4px',
        } : {
          background: 'var(--color-surface-high)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderTopLeftRadius: '4px',
        }}
      >
        {msg.content}
      </div>
    </motion.div>
  )
}

// Human-in-the-loop approval card shown when graph is interrupted
function ApprovalCard({ blueprint, onApprove, onReject, loading }) {
  const usecaseName = blueprint?.step1?.usecasename || 'this blueprint'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: 'var(--color-primary-dim)', border: '1px solid rgba(124,109,250,0.2)' }}>
        <Sparkles size={12} style={{ color: 'var(--color-primary-light)' }} />
      </div>

      <div className="flex-1 rounded-2xl rounded-tl-none overflow-hidden"
        style={{
          background: 'var(--color-surface-high)',
          border: '1px solid var(--color-border-bright)',
        }}>

        {/* Header */}
        <div className="px-4 py-3"
          style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(124,109,250,0.05)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5"
            style={{ color: 'var(--color-primary-light)' }}>
            Human Review Required
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text)' }}>
            Blueprint generated for <span className="font-semibold">{usecaseName}</span>
          </p>
        </div>

        {/* Summary preview */}
        {blueprint?.step5?.executiveSummary && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-muted)' }}>
              Executive Summary
            </p>
            <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--color-muted-bright)' }}>
              {blueprint.step5.executiveSummary}
            </p>
          </div>
        )}

        {/* Quick stats */}
        <div className="px-4 py-3 grid grid-cols-3 gap-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
          {[
            { label: 'Action', value: blueprint?.step4?.remmendationAction },
            { label: 'Confidence', value: blueprint?.step3?.OverallConfidence },
            { label: 'Reuse', value: blueprint?.step2?.reuserecommendation },
          ].map(({ label, value }) => value && (
            <div key={label} className="text-center">
              <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>{label}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'var(--color-surface-highest)',
                  color: 'var(--color-primary-light)',
                  border: '1px solid rgba(124,109,250,0.2)'
                }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="px-4 py-3 flex gap-2">
          <button
            onClick={onApprove}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
            }}
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Approve & Build
          </button>
          <button
            onClick={onReject}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{
              background: 'var(--color-surface-highest)',
              color: 'var(--color-muted-bright)',
              border: '1px solid var(--color-border-bright)',
            }}
          >
            <XCircle size={14} />
            Reject & Redo
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function ChatPanel() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [error, setError] = useState('')
  // pendingApproval holds { blueprint, thread_id } when graph is interrupted
  const [pendingApproval, setPendingApproval] = useState(null)

  const { messages, addMessage, setMessages, activeThread, setActiveThread, addThread, setBlueprint, downloadUrl } = useStore()
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const threadIdRef = useRef(activeThread?._id || null)

  useEffect(() => {
    threadIdRef.current = activeThread?._id || null
    if (activeThread) {
      const stored = activeThread.messages || []
      setMessages(stored)
      // Restore pending approval if thread was in that state
      if (activeThread.status === 'pending_approval' && activeThread.blueprint) {
        setPendingApproval({
          blueprint: activeThread.blueprint,
          thread_id: activeThread._id
        })
      } else {
        setPendingApproval(null)
      }
    }
  }, [activeThread])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, pendingApproval])

  const sendMessage = async () => {
    const query = input.trim()
    if (!query || loading) return

    setInput('')
    setError('')
    setPendingApproval(null)
    addMessage({ role: 'user', content: query })
    setLoading(true)

    try {
      const payload = { query }
      if (threadIdRef.current) {
        payload.thread_id = threadIdRef.current
      }

      const { data } = await api.post('/api/chat', payload)

      if (data.thread_id) {
        threadIdRef.current = data.thread_id
      }

      // ── Interrupted: graph paused for human review ──
      if (data.status === 'pending_approval') {
        addMessage({
          role: 'assistant',
          content: data.message || 'Blueprint generated. Please review and approve or reject to proceed.'
        })

        // Set blueprint in viewer immediately so user can see it
        if (data.blueprint) {
          setBlueprint({ blueprint: data.blueprint, status: { Blueprintcreation: 'Completed' } })
        }

        setPendingApproval({
          blueprint: data.blueprint,
          thread_id: data.thread_id
        })

        addThread({
          _id: data.thread_id,
          blueprint: { blueprint: data.blueprint },
          status: 'pending_approval',
          updated_at: new Date().toISOString(),
          usecasename: data.blueprint?.step1?.usecasename,
        })

        setActiveThread({
          _id: data.thread_id,
          blueprint: data.blueprint,
          status: 'pending_approval',
          updated_at: new Date().toISOString(),
        })

        return
      }

      // ── Completed run ──
      const blueprint = data.blueprint
      if (blueprint) {
        setBlueprint({ blueprint, status: { Blueprintcreation: 'Completed' } })
      }

      const reply = data.response ? getFinalResponse(data.response) : 'Project kit generated successfully.'
      addMessage({ role: 'assistant', content: reply })

      if (data.download_url) {
        addMessage({
          role: 'assistant',
          content: `✅ Project scaffold ready! Download: ${data.download_url}`
        })
      }

      addThread({
        _id: data.thread_id,
        blueprint: blueprint ? { blueprint } : null,
        status: 'completed',
        updated_at: new Date().toISOString(),
        usecasename: blueprint?.step1?.usecasename,
      })

      setActiveThread({
        _id: data.thread_id,
        blueprint: blueprint ? { blueprint } : null,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })

    } catch (err) {
      const msg = err.response?.data?.detail || 'Something went wrong. Check your backend is running.'
      setError(msg)
      addMessage({ role: 'assistant', content: `⚠️ ${msg}` })
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (action) => {
    if (!pendingApproval?.thread_id || approvalLoading) return

    setApprovalLoading(true)
    setError('')

    addMessage({
      role: 'user',
      content: action === 'approve' ? '✅ Approved — proceed with building.' : '❌ Rejected — please regenerate.'
    })

    try {
      const { data } = await api.post('/api/chat/resume', {
        thread_id: pendingApproval.thread_id,
        action
      })

      // Interrupted again (rejection looped back to blueprint regen)
      if (data.status === 'pending_approval') {
        addMessage({
          role: 'assistant',
          content: data.message || 'Blueprint regenerated. Please review again.'
        })

        if (data.blueprint) {
          setBlueprint({ blueprint: data.blueprint, status: { Blueprintcreation: 'Completed' } })
        }

        setPendingApproval({
          blueprint: data.blueprint,
          thread_id: data.thread_id
        })

        return
      }

      // Completed after approval
      setPendingApproval(null)

      const blueprint = data.blueprint
      const factoryKit = data.response?.FactoryKit || data.FactoryKit
      const downloadUrl = data.download_url

      // 🔥 store in global state (you must have this in zustand)
      useStore.getState().setFactoryKit(factoryKit)
      useStore.getState().setDownloadUrl(downloadUrl)
      if (blueprint) {
        setBlueprint({ blueprint, status: { Blueprintcreation: 'Completed', KitGeneration: 'Completed' } })
      }

      addMessage({
        role: 'assistant',
        content: '🚀 Blueprint approved! Generating your full project scaffold...'
      })

      if (data.download_url) {
        addMessage({
          role: 'assistant',
          content: `✅ Project scaffold ready! Download: ${data.download_url}`
        })
      }

      addThread({
        _id: data.thread_id,
        blueprint: blueprint ? { blueprint } : null,
        status: 'completed',
        updated_at: new Date().toISOString(),
        usecasename: blueprint?.step1?.usecasename,
      })

      setActiveThread({
      _id: data.thread_id,
      blueprint: blueprint ? { blueprint } : null,
      factoryKit: factoryKit,
      downloadUrl: downloadUrl,
      status: 'completed',
      updated_at: new Date().toISOString(),
    })

    } catch (err) {
      const msg = err.response?.data?.detail || 'Resume failed. Try again.'
      setError(msg)
      addMessage({ role: 'assistant', content: `⚠️ ${msg}` })
    } finally {
      setApprovalLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Input disabled while waiting for approval decision
  const inputDisabled = loading || !!pendingApproval

  return (
    <aside className="w-[380px] h-full fixed right-0 top-0 flex flex-col z-40"
      style={{ background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full pulse-teal" style={{ background: 'var(--color-teal)' }} />
          <h3 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-text)' }}>
            Blueprint Assistant
          </h3>
        </div>
        {/* Show pending badge when awaiting review */}
        {pendingApproval ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Awaiting Review
          </span>
        ) : (
          <Settings size={16} style={{ color: 'var(--color-muted)' }} className="cursor-pointer hover:opacity-80 transition-opacity" />
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.length === 0 && !pendingApproval && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'var(--color-primary-dim)', border: '1px solid rgba(124,109,250,0.2)' }}>
                <Sparkles size={12} style={{ color: 'var(--color-primary-light)' }} />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-none text-sm leading-relaxed"
                style={{ background: 'var(--color-surface-high)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                Welcome. Describe an AI use case or system you want to build and I'll generate a full evaluation blueprint for you.
              </div>
            </div>
            <div className="flex flex-wrap gap-2 ml-10 mt-2">
              {[
                'Build a RAG-based document assistant',
                'Design an MLOps pipeline',
                'Create an AI customer support agent',
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); textareaRef.current?.focus() }}
                  className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:opacity-80"
                  style={{
                    background: 'var(--color-surface-highest)',
                    color: 'var(--color-muted-bright)',
                    border: '1px solid var(--color-border-bright)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'var(--color-primary-dim)', border: '1px solid rgba(124,109,250,0.2)' }}>
              <Brain size={12} style={{ color: 'var(--color-primary-light)' }} />
            </div>
            <TypingIndicator />
          </motion.div>
        )}

        {/* Human-in-the-loop approval card */}
        <AnimatePresence>
          {pendingApproval && !loading && (
            <ApprovalCard
              blueprint={pendingApproval.blueprint}
              onApprove={() => handleApproval('approve')}
              onReject={() => handleApproval('reject')}
              loading={approvalLoading}
            />
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-4 mb-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ background: 'var(--color-red-dim)', color: 'var(--color-red)', border: '1px solid rgba(244,63,94,0.2)' }}
          >
            <AlertCircle size={12} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download ZIP button — shown after project generation completes */}
      {downloadUrl && !pendingApproval && (
        <div className="px-4 pb-0 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          <a
            href={downloadUrl}
            download
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), #5b4ef7)',
              color: '#fff',
              textDecoration: 'none',
            }}
          >
            <Download size={15} />
            Download Project ZIP
          </a>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
        {pendingApproval && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs mb-2 px-2 py-1.5 rounded-lg"
            style={{
              background: 'rgba(245,158,11,0.08)',
              color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.2)'
            }}
          >
            Use the Approve / Reject buttons above to continue
          </motion.p>
        )}
        <div className="relative">
          <textarea
            ref={textareaRef}
            className="input-field resize-none pr-12 py-3.5 text-sm"
            placeholder={pendingApproval ? 'Waiting for your review decision...' : 'Describe your use case...'}
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={inputDisabled}
            style={{ opacity: inputDisabled ? 0.4 : 1 }}
          />
          <button
            onClick={sendMessage}
            disabled={inputDisabled || !input.trim()}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: input.trim() && !inputDisabled ? 'linear-gradient(135deg, var(--color-primary), #5b4ef7)' : 'var(--color-surface-highest)',
              opacity: !input.trim() || inputDisabled ? 0.5 : 1,
            }}
          >
            <ArrowUp size={15} style={{ color: input.trim() && !inputDisabled ? '#fff' : 'var(--color-muted)' }} />
          </button>
        </div>
        <p className="text-[10px] text-center mt-2 uppercase tracking-widest"
          style={{ color: 'var(--color-muted)' }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </aside>
  )
}