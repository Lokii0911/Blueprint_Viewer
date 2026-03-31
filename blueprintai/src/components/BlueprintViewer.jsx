import React from 'react'
import { motion } from 'motion/react'
import {
  CheckCircle2, XCircle, ShieldCheck, Zap, Target, TrendingUp,
  GitBranch, Clock, Users, AlertTriangle, Layers, Database,
  ChevronRight, Package, ArrowRight
} from 'lucide-react'
import { cn } from '../lib/utils.js'

// Badge component — maps High/Medium/Low and Build/Extend/Defer to colors
function Badge({ value }) {
  if (!value) return null
  const v = value.toLowerCase()
  if (v === 'high' || v === 'build' || v === 'as-is') return <span className="badge-high">{value}</span>
  if (v === 'medium' || v === 'extend') return <span className="badge-medium">{value}</span>
  if (v === 'low' || v === 'defer' || v === 'build new') return <span className="badge-low">{value}</span>
  // action badge
  return <span className="badge-build">{value}</span>
}

// Section wrapper with animation
function Section({ title, icon: Icon, children, delay = 0, accent = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card p-6"
      style={accent ? { borderColor: 'rgba(124,109,250,0.3)', background: 'rgba(124,109,250,0.03)' } : {}}
    >
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={15} style={{ color: 'var(--color-primary-light)' }} />}
        <h3 className="text-xs font-bold uppercase tracking-[0.15em]"
          style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-primary-light)' }}>
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  )
}

// Metric row for feasibility
function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2"
      style={{ borderBottom: '1px solid var(--color-border)' }}>
      <span className="text-sm" style={{ color: 'var(--color-muted-bright)' }}>{label}</span>
      <Badge value={value} />
    </div>
  )
}

// Numbered list item
function NumberedItem({ index, text }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
        style={{ background: 'var(--color-primary-dim)', color: 'var(--color-primary-light)', border: '1px solid rgba(124,109,250,0.2)' }}>
        {index + 1}
      </span>
      <span className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-bright)' }}>{text}</span>
    </div>
  )
}

// Bullet list item
function BulletItem({ text, color = 'var(--color-primary)' }) {
  return (
    <div className="flex gap-2.5 items-start">
      <ChevronRight size={13} className="shrink-0 mt-0.5" style={{ color }} />
      <span className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-bright)' }}>{text}</span>
    </div>
  )
}

export default function BlueprintViewer({ blueprint }) {
  // blueprint prop is: { blueprint: Usecaseeval, status: { Blueprintcreation: "Completed" } }
  const bp = blueprint?.blueprint
  if (!bp) return null

  const { step1, step2, step3, step4, step5 } = bp

  return (
    <div className="w-full max-w-4xl mx-auto py-2 pb-12">

      {/* Title bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="badge-build">
            {blueprint?.status?.Blueprintcreation === 'Completed' ? '✓ Generated' : 'Processing'}
          </span>
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
            {step1?.businessDomain}
          </span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight leading-tight"
          style={{ fontFamily: 'var(--font-syne)', color: 'var(--color-text)' }}>
          {step1?.usecasename}
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-muted-bright)', maxWidth: '680px' }}>
          {step1?.problemstatement}
        </p>
      </motion.div>

      {/* Top stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="card-high px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-muted)' }}>Action</p>
            <Badge value={step4?.remmendationAction} />
          </div>
          <Target size={18} style={{ color: 'var(--color-primary-light)', opacity: 0.5 }} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="card-high px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-muted)' }}>Confidence</p>
            <Badge value={step3?.OverallConfidence} />
          </div>
          <TrendingUp size={18} style={{ color: 'var(--color-teal)', opacity: 0.5 }} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="card-high px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--color-muted)' }}>Reuse</p>
            <Badge value={step2?.reuserecommendation} />
          </div>
          <GitBranch size={18} style={{ color: 'var(--color-primary-light)', opacity: 0.5 }} />
        </motion.div>
      </div>

      {/* Main 2-col grid */}
      <div className="grid grid-cols-12 gap-3">

        {/* Use Case Overview — full width */}
        <div className="col-span-12">
          <Section title="Use Case Overview" icon={Target} delay={0.1} accent>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>Target Users</p>
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>{step1?.targetUsers}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>Business Domain</p>
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>{step1?.businessDomain}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>Desired Outcome</p>
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>{step1?.desiredoutcome}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>Key Constraints</p>
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>{step1?.keyconstraints}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>Key Assumptions</p>
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>{step1?.Keyassumptions}</p>
              </div>
            </div>
          </Section>
        </div>

        {/* Feasibility — 5 cols */}
        <div className="col-span-12 md:col-span-5">
          <Section title="Feasibility Assessment" icon={TrendingUp} delay={0.15}>
            <div className="space-y-0 divide-y" style={{ '--tw-divide-opacity': 1 }}>
              <MetricRow label="Business Value" value={step3?.Buisnessvalue} />
              <MetricRow label="Technical Feasibility" value={step3?.TechnicalFeasibility} />
              <MetricRow label="Overall Confidence" value={step3?.OverallConfidence} />
              <MetricRow label="Reuse Confidence" value={step2?.reuseConfidence} />
            </div>
            {step2?.rationale && (
              <p className="text-xs mt-4 leading-relaxed" style={{ color: 'var(--color-muted-bright)' }}>
                <span className="font-semibold" style={{ color: 'var(--color-muted)' }}>Rationale: </span>
                {step2.rationale}
              </p>
            )}
          </Section>
        </div>

        {/* Risks — 7 cols */}
        <div className="col-span-12 md:col-span-7">
          <Section title="Risks" icon={AlertTriangle} delay={0.2}>
            <div className="space-y-2">
              {step3?.risks?.map((r, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <AlertTriangle size={12} className="shrink-0 mt-0.5" style={{ color: 'var(--color-amber)' }} />
                  <span className="text-sm" style={{ color: 'var(--color-muted-bright)' }}>{r}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Executive Summary — full */}
        <div className="col-span-12">
          <Section title="Executive Summary" icon={Zap} delay={0.25}>
            <p className="text-sm leading-loose" style={{ color: 'var(--color-muted-bright)' }}>
              {step5?.executiveSummary}
            </p>
          </Section>
        </div>

        {/* Solution Pattern — 6 cols */}
        <div className="col-span-12 md:col-span-6">
          <Section title="Solution Pattern" icon={Layers} delay={0.3}>
            <div className="px-4 py-3 rounded-lg mb-3"
              style={{ background: 'var(--color-surface-highest)', borderLeft: '3px solid var(--color-primary)' }}>
              <p className="text-xs font-mono mb-1" style={{ color: 'var(--color-primary-light)' }}>
                PATTERN: {step4?.recommendationPattern}
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-bright)' }}>
              {step5?.solutionPattern}
            </p>
          </Section>
        </div>

        {/* Effort & Timeline — 6 cols */}
        <div className="col-span-12 md:col-span-6">
          <Section title="Effort & Timeline" icon={Clock} delay={0.3}>
            <div className="flex items-center justify-center py-4">
              <p className="text-2xl font-bold text-center" style={{ fontFamily: 'var(--font-syne)', color: 'var(--color-text)' }}>
                {step5?.effortAndTimeline}
              </p>
            </div>
          </Section>
        </div>

        {/* Conceptual Workflow — 7 cols */}
        <div className="col-span-12 md:col-span-7">
          <Section title="Conceptual Workflow" icon={GitBranch} delay={0.35}>
            <div className="space-y-4 relative">
              <div className="absolute left-[9px] top-3 bottom-3 w-px"
                style={{ background: 'var(--color-border-bright)' }} />
              {step5?.conceptualWorkflow?.map((step, i) => (
                <div key={i} className="flex gap-4 relative z-10">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: 'var(--color-surface-highest)', border: '1px solid var(--color-primary)', color: 'var(--color-primary-light)' }}>
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed pt-0.5" style={{ color: 'var(--color-muted-bright)' }}>{step}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Marketplace Potential — 5 cols */}
        <div className="col-span-12 md:col-span-5">
          <Section title="Marketplace Potential" icon={Package} delay={0.35}>
            <div className="flex items-center gap-2 mb-3">
              {step5?.marketplacepotential?.reusableAsset
                ? <CheckCircle2 size={16} style={{ color: 'var(--color-teal)' }} />
                : <XCircle size={16} style={{ color: 'var(--color-red)' }} />
              }
              <span className="font-semibold text-sm uppercase tracking-tight"
                style={{ color: 'var(--color-text)' }}>
                Reusable: {step5?.marketplacepotential?.reusableAsset ? 'Yes' : 'No'}
              </span>
              <Badge value={step5?.marketplacepotential?.confidence} />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-bright)' }}>
              {step5?.marketplacepotential?.notes}
            </p>
          </Section>
        </div>

        {/* Conceptual Architecture */}
        <div className="col-span-12 md:col-span-6">
          <Section title="Conceptual Architecture" icon={Layers} delay={0.4}>
            <div className="space-y-2">
              {step5?.conceptualArchitecture?.map((item, i) => (
                <BulletItem key={i} text={item} />
              ))}
            </div>
          </Section>
        </div>

        {/* Target Architecture */}
        <div className="col-span-12 md:col-span-6">
          <Section title="Target Architecture" icon={Database} delay={0.4}>
            <div className="space-y-2">
              {step5?.targetArchitecture?.map((item, i) => (
                <BulletItem key={i} text={item} color="var(--color-teal)" />
              ))}
            </div>
          </Section>
        </div>

        {/* Data Integration */}
        <div className="col-span-12 md:col-span-6">
          <Section title="Data Integration" icon={Database} delay={0.45}>
            <div className="space-y-2">
              {step5?.dataIntegration?.map((item, i) => (
                <BulletItem key={i} text={item} color="var(--color-amber)" />
              ))}
            </div>
          </Section>
        </div>

        {/* Governance & Control Points */}
        <div className="col-span-12 md:col-span-6">
          <Section title="Governance & Control Points" icon={ShieldCheck} delay={0.45}>
            <div className="space-y-2">
              {step5?.governancecontrolpoints?.map((item, i) => (
                <BulletItem key={i} text={item} color="var(--color-primary-light)" />
              ))}
            </div>
          </Section>
        </div>

        {/* Risks & Guardrails */}
        <div className="col-span-12 md:col-span-6">
          <Section title="Risks & Guardrails" icon={ShieldCheck} delay={0.5}>
            <div className="space-y-2">
              {step5?.risksAndguardrails?.map((item, i) => (
                <BulletItem key={i} text={item} color="var(--color-red)" />
              ))}
            </div>
          </Section>
        </div>

        {/* Scope & Boundaries */}
        <div className="col-span-12 md:col-span-6">
          <Section title="Scope & Boundaries" icon={Target} delay={0.5}>
            <div className="space-y-2">
              {step5?.scopeAndBoundaries?.map((item, i) => (
                <BulletItem key={i} text={item} />
              ))}
            </div>
          </Section>
        </div>

        {/* Factory Readiness */}
        <div className="col-span-12 md:col-span-6">
          <Section title="Factory Readiness" icon={Zap} delay={0.52}>
            <div className="space-y-2">
              {step5?.factoryreadiness?.map((item, i) => (
                <BulletItem key={i} text={item} color="var(--color-teal)" />
              ))}
            </div>
          </Section>
        </div>

        {/* Validation Summary */}
        <div className="col-span-12 md:col-span-6">
          <Section title="Validation Summary" icon={CheckCircle2} delay={0.52}>
            <div className="space-y-2">
              {step5?.validationSumaary?.map((item, i) => (
                <BulletItem key={i} text={item} color="var(--color-teal)" />
              ))}
            </div>
          </Section>
        </div>

        {/* Next Steps — full width, highlighted */}
        <div className="col-span-12">
          <Section title="Next Steps" icon={ArrowRight} delay={0.55} accent>
            <div className="space-y-3">
              {step5?.nextsteps?.map((item, i) => (
                <NumberedItem key={i} index={i} text={item} />
              ))}
            </div>
          </Section>
        </div>

        {/* Marketplace References */}
        {step5?.marketplacereference?.length > 0 && (
          <div className="col-span-12">
            <Section title="Marketplace References" icon={Package} delay={0.58}>
              <div className="space-y-2">
                {step5.marketplacereference.map((item, i) => (
                  <BulletItem key={i} text={item} />
                ))}
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  )
}
