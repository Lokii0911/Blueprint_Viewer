import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Layers, Code2, Database, GitBranch, Zap, Server,
  FolderTree, ArrowRight, ChevronDown, ChevronRight,
  Globe, Terminal, Box, Download, ExternalLink, Cpu,
  FileCode, CheckCircle2, Rocket
} from 'lucide-react'

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, color = 'var(--color-primary-light)' }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon size={14} style={{ color }} />}
      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em]"
        style={{ fontFamily: 'var(--font-headline)', color }}>
        {title}
      </h3>
    </div>
  )
}

function Card({ children, accent = false, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`card p-5 ${className}`}
      style={accent ? { borderColor: 'rgba(124,109,250,0.3)', background: 'rgba(124,109,250,0.03)' } : {}}
    >
      {children}
    </motion.div>
  )
}

function Tag({ children, color = 'var(--color-primary-dim)', textColor = 'var(--color-primary-light)', border = 'rgba(124,109,250,0.2)' }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide mr-1.5 mb-1.5"
      style={{ background: color, color: textColor, border: `1px solid ${border}` }}>
      {children}
    </span>
  )
}

function BulletRow({ text, color = 'var(--color-primary)' }) {
  return (
    <div className="flex gap-2.5 items-start py-1">
      <ChevronRight size={12} className="shrink-0 mt-0.5" style={{ color }} />
      <span className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-bright)' }}>{text}</span>
    </div>
  )
}

function NumberedRow({ index, text }) {
  return (
    <div className="flex gap-3 items-start py-1">
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
        style={{ background: 'var(--color-primary-dim)', color: 'var(--color-primary-light)', border: '1px solid rgba(124,109,250,0.2)' }}>
        {index + 1}
      </span>
      <span className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-bright)' }}>{text}</span>
    </div>
  )
}

// ── Folder Tree ───────────────────────────────────────────────────────────────

function FolderNode({ name, content, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2)
  const isFile = typeof content === 'string' || (typeof content === 'object' && content?.code !== undefined) || name.includes('.')

  if (isFile) {
    return (
      <div className="flex items-start gap-2 py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
        <FileCode size={11} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary-light)', opacity: 0.7 }} />
        <div>
          <span className="text-xs font-mono" style={{ color: 'var(--color-muted-bright)' }}>{name}</span>
          {content?.description && (
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>{content.description}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 py-0.5 w-full text-left hover:opacity-80 transition-opacity"
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {open
          ? <ChevronDown size={11} style={{ color: 'var(--color-muted)' }} />
          : <ChevronRight size={11} style={{ color: 'var(--color-muted)' }} />
        }
        <FolderTree size={11} style={{ color: 'var(--color-amber)', opacity: 0.8 }} />
        <span className="text-xs font-mono font-medium" style={{ color: 'var(--color-text)' }}>{name}/</span>
      </button>
      <AnimatePresence>
        {open && typeof content === 'object' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Object.entries(content).map(([k, v]) => (
              <FolderNode key={k} name={k} content={v} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── API Endpoint Card ─────────────────────────────────────────────────────────

function EndpointCard({ ep }) {
  const [open, setOpen] = useState(false)
  const method = (ep.method || ep.type || 'GET').toUpperCase()
  const methodColors = {
    GET: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)' },
    POST: { bg: 'rgba(124,109,250,0.12)', color: 'var(--color-primary-light)', border: 'rgba(124,109,250,0.25)' },
    PUT: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
    PATCH: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
    DELETE: { bg: 'rgba(244,63,94,0.12)', color: 'var(--color-red)', border: 'rgba(244,63,94,0.25)' },
  }
  const mc = methodColors[method] || methodColors.GET

  return (
    <div className="rounded-xl overflow-hidden mb-2"
      style={{ background: 'var(--color-surface-highest)', border: '1px solid var(--color-border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:opacity-80 transition-opacity"
      >
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0"
          style={{ background: mc.bg, color: mc.color, border: `1px solid ${mc.border}` }}>
          {method}
        </span>
        <code className="text-xs flex-1 truncate" style={{ color: 'var(--color-text)', fontFamily: 'monospace' }}>
          {ep.endpoint || ep.path || ep.route || '—'}
        </code>
        {open
          ? <ChevronDown size={12} style={{ color: 'var(--color-muted)' }} />
          : <ChevronRight size={12} style={{ color: 'var(--color-muted)' }} />
        }
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-3"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            {ep.description && <p className="text-xs mt-2 mb-2" style={{ color: 'var(--color-muted-bright)' }}>{ep.description}</p>}
            {ep.logic_summary || ep.internal_logic_summary ? (
              <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--color-muted-bright)' }}>Logic: </span>
                {ep.logic_summary || ep.internal_logic_summary}
              </p>
            ) : null}
            {ep.request && (
              <div className="mt-2">
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>Request</p>
                <pre className="text-[10px] p-2 rounded-lg overflow-x-auto"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-muted-bright)', fontFamily: 'monospace' }}>
                  {typeof ep.request === 'string' ? ep.request : JSON.stringify(ep.request, null, 2)}
                </pre>
              </div>
            )}
            {ep.response && (
              <div className="mt-2">
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>Response</p>
                <pre className="text-[10px] p-2 rounded-lg overflow-x-auto"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-muted-bright)', fontFamily: 'monospace' }}>
                  {typeof ep.response === 'string' ? ep.response : JSON.stringify(ep.response, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── DB Schema Card ────────────────────────────────────────────────────────────

function SchemaCard({ name, schema }) {
  const fields = schema?.fields || (Array.isArray(schema) ? schema : [])
  return (
    <div className="rounded-xl overflow-hidden mb-3"
      style={{ background: 'var(--color-surface-highest)', border: '1px solid var(--color-border)' }}>
      <div className="px-4 py-2.5 flex items-center gap-2"
        style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(124,109,250,0.04)' }}>
        <Database size={12} style={{ color: 'var(--color-primary-light)' }} />
        <span className="text-xs font-bold font-mono" style={{ color: 'var(--color-text)' }}>{name}</span>
        {schema?.relationships && (
          <span className="text-[9px] ml-auto" style={{ color: 'var(--color-muted)' }}>{schema.relationships}</span>
        )}
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
        {fields.map((f, i) => {
          const fname = typeof f === 'string' ? f : (f.name || f.field || Object.keys(f)[0])
          const ftype = typeof f === 'string' ? '' : (f.type || f.datatype || '')
          const fdesc = typeof f === 'string' ? '' : (f.description || f.desc || '')
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-2">
              <code className="text-xs font-mono" style={{ color: 'var(--color-muted-bright)', minWidth: '100px' }}>{fname}</code>
              {ftype && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--color-primary-dim)', color: 'var(--color-primary-light)' }}>{ftype}</span>}
              {fdesc && <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>{fdesc}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Tab Button ────────────────────────────────────────────────────────────────

function Tab({ id, label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap"
      style={{
        background: active ? 'var(--color-primary-dim)' : 'transparent',
        color: active ? 'var(--color-primary-light)' : 'var(--color-muted)',
        border: active ? '1px solid rgba(124,109,250,0.25)' : '1px solid transparent',
      }}
    >
      {Icon && <Icon size={12} />}
      {label}
    </button>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function FactoryKitViewer({ factoryKit, downloadUrl }) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!factoryKit) return null

  // Normalise keys — LLM output can vary slightly
  const arch = factoryKit.high_level_architecture || factoryKit.architecture || factoryKit.highLevelArchitecture
  const stack = factoryKit.tech_stack || factoryKit.techStack || factoryKit.technology_stack || {}
  const folder = factoryKit.folder_structure || factoryKit.folderStructure || factoryKit.project_structure
  const modules = factoryKit.module_wise_breakdown || factoryKit.modules || factoryKit.moduleBreakdown || []
  const apis = factoryKit.api_design || factoryKit.apis || factoryKit.API_design || []
  const dbSchema = factoryKit.database_schema || factoryKit.databaseSchema || factoryKit.db_schema || {}
  const implPlan = factoryKit.build_plan ||factoryKit.implementation_plan || factoryKit.step_by_step_implementation || factoryKit.implementationPlan || []
  const deployment = factoryKit.deployment_strategy || factoryKit.deployment || factoryKit.deploymentStrategy

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'stack', label: 'Tech Stack', icon: Cpu },
    { id: 'structure', label: 'Structure', icon: FolderTree },
    { id: 'api', label: 'API', icon: Globe },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'plan', label: 'Build Plan', icon: Terminal },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto py-2 pb-12">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-build">✓ Kit Generated</span>
              <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
                Factory Output
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-syne)', color: 'var(--color-text)' }}>
              Project <span style={{ color: 'var(--color-primary)' }}>Scaffold</span>
            </h2>
            <p className="text-xs mt-1 uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
              Production-ready architecture generated by Factory Agent
            </p>
          </div>

          {/* Download button */}
          {downloadUrl && (
            <motion.a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95 no-underline"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
              }}
            >
              <Download size={15} />
              Download ZIP
            </motion.a>
          )}
        </div>
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1"
        style={{ borderBottom: '1px solid var(--color-border)' }}>
        {tabs.map(t => (
          <Tab key={t.id} {...t} active={activeTab === t.id} onClick={setActiveTab} />
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {arch && (
                <Card delay={0}>
                  <SectionHeader icon={Layers} title="High-Level Architecture" />
                  {typeof arch === 'string' ? (
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-bright)' }}>{arch}</p>
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(arch).map(([k, v]) => (
                        <BulletRow key={k} text={`${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`} />
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {modules.length > 0 && (
                <Card delay={0.05}>
                  <SectionHeader icon={Box} title="Module Breakdown" color="var(--color-teal)" />
                  <div className="grid grid-cols-1 gap-3">
                    {(Array.isArray(modules) ? modules : Object.entries(modules).map(([k, v]) => ({ name: k, ...v }))).map((mod, i) => {
                      const name = mod.name || mod.module || mod.module_name || `Module ${i + 1}`
                      const desc = mod.description || mod.purpose || mod.responsibility || ''
                      const funcs = mod.functions || mod.key_functions || mod.responsibilities || []
                      return (
                        <div key={i} className="p-3 rounded-xl"
                          style={{ background: 'var(--color-surface-highest)', border: '1px solid var(--color-border)' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <Code2 size={12} style={{ color: 'var(--color-primary-light)' }} />
                            <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>{name}</span>
                          </div>
                          {desc && <p className="text-xs mb-2" style={{ color: 'var(--color-muted-bright)' }}>{desc}</p>}
                          {Array.isArray(funcs) && funcs.slice(0, 3).map((f, j) => (
                            <BulletRow key={j} text={typeof f === 'string' ? f : f.name || JSON.stringify(f)} color="var(--color-teal)" />
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </Card>
              )}

              {deployment && (
                <Card delay={0.1} accent>
                  <SectionHeader icon={Rocket} title="Deployment Strategy" color="var(--color-teal)" />
                  {typeof deployment === 'string' ? (
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-bright)' }}>{deployment}</p>
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(deployment).map(([k, v]) => (
                        <BulletRow key={k} text={`${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`} color="var(--color-teal)" />
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>
          )}

          {/* TECH STACK */}
          {activeTab === 'stack' && (
            <div className="space-y-4">
              {Object.entries(stack).map(([layer, value], i) => (
                <Card key={layer} delay={i * 0.04}>
                  <SectionHeader
                    icon={layer.toLowerCase().includes('front') ? Globe : layer.toLowerCase().includes('ai') ? Cpu : Server}
                    title={layer.replace(/_/g, ' ')}
                  />
                  <div className="flex flex-wrap mt-1">
                    {Array.isArray(value)
                      ? value.map((v, j) => <Tag key={j}>{typeof v === 'string' ? v : v.name || JSON.stringify(v)}</Tag>)
                      : typeof value === 'string'
                        ? value.split(',').map((v, j) => <Tag key={j}>{v.trim()}</Tag>)
                        : Object.entries(value).map(([k, v]) => (
                          <Tag key={k}>{`${k}: ${v}`}</Tag>
                        ))
                    }
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* FOLDER STRUCTURE */}
          {activeTab === 'structure' && (
            <Card>
              <SectionHeader icon={FolderTree} title="Project Folder Structure" color="var(--color-amber)" />
              {folder ? (
                <div className="font-mono text-xs p-3 rounded-xl overflow-auto"
                  style={{ background: 'var(--color-surface-highest)', maxHeight: '480px' }}>
                  {Object.entries(folder).map(([k, v]) => (
                    <FolderNode key={k} name={k} content={v} depth={0} />
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>No folder structure in kit.</p>
              )}
            </Card>
          )}

          {/* API DESIGN */}
          {activeTab === 'api' && (
            <Card>
              <SectionHeader icon={Globe} title="API Endpoints" />
              {(Array.isArray(apis) ? apis : Object.values(apis)).length > 0 ? (
                (Array.isArray(apis) ? apis : Object.values(apis)).map((ep, i) => (
                  <EndpointCard key={i} ep={ep} />
                ))
              ) : (
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>No API design in kit.</p>
              )}
            </Card>
          )}

          {/* DATABASE */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <Card>
                <SectionHeader icon={Database} title="Database Schema" />
                {Object.keys(dbSchema).length > 0 ? (
                  Object.entries(dbSchema).map(([name, schema]) => (
                    <SchemaCard key={name} name={name} schema={schema} />
                  ))
                ) : (
                  <p className="text-sm" style={{ color: 'var(--color-muted)' }}>No schema defined in kit.</p>
                )}
              </Card>
            </div>
          )}

          {/* BUILD PLAN */}
          {activeTab === 'plan' && (
            <Card accent>
              <SectionHeader icon={Terminal} title="Step-by-Step Implementation Plan" color="var(--color-teal)" />
              <div className="space-y-2">
                {(Array.isArray(implPlan) ? implPlan : Object.values(implPlan)).map((step, i) => (
                  <NumberedRow
                    key={i}
                    index={i}
                    text={typeof step === 'string' ? step : step.step || step.description || step.action || JSON.stringify(step)}
                  />
                ))}
              </div>
            </Card>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  )
}