import profile from '../data/profile.json'
import SectionTag from './SectionTag'
import Doodle from './Doodle'

const { experience } = profile

function ExperienceRow({ exp, index }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-16 py-14">
      {/* Left: index + company + role + tags */}
      <div className="w-full md:w-[40%] md:flex-shrink-0">
        <div className="label mb-5">{exp.index} of 04</div>
        <h2
          className="font-syne font-bold mb-2 relative inline-block"
          style={{ fontSize: 'clamp(24px, 3vw, 42px)', color: '#241c10', lineHeight: 1.05 }}
        >
          {exp.company}
          {index === 0 && (
            <span className="note" style={{
              position: 'absolute', top: -14, right: '-3.2em',
              transform: 'rotate(8deg)', color: '#a85e12', fontSize: '15px', whiteSpace: 'nowrap',
            }}>
              still here!
            </span>
          )}
        </h2>
        <p className="font-grotesk text-sm mb-8" style={{ color: '#6b5d46' }}>{exp.role}</p>
        <div className="flex flex-wrap gap-2">
          {exp.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>

      {/* Right: period + summary + bullets */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="label">{exp.period}</span>
          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#ddd0ae' }} />
          <span className="label">{exp.location}</span>
        </div>
        <p className="font-grotesk text-sm leading-relaxed mb-8" style={{ color: '#6b5d46', maxWidth: '400px' }}>
          {exp.summary}
        </p>
        <ul className="space-y-4">
          {exp.bullets.map((b, bi) => (
            <li key={bi} className="flex items-start gap-4">
              <span className="font-mono text-sm mt-0.5 flex-shrink-0" style={{ color: '#d6870f' }}>
                {String(bi + 1).padStart(2, '0')}
              </span>
              <span className="font-grotesk text-sm leading-relaxed" style={{ color: '#6b5d46' }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden" style={{ background: '#fdf9f0' }}>
      <div className="absolute cyber-grid pointer-events-none" aria-hidden="true" />
      <div className="hidden lg:block absolute pointer-events-none" style={{ right: '4%', top: '8%' }}>
        <Doodle type="brackets" size={74} rotate={-6} opacity={0.34} />
      </div>
      <div className="hidden lg:block absolute pointer-events-none" style={{ left: '3%', top: '38%' }}>
        <Doodle type="chip" size={76} rotate={-5} opacity={0.33} />
      </div>
      <div className="hidden lg:block absolute pointer-events-none" style={{ right: '8%', bottom: '10%' }}>
        <Doodle type="neuralnet" size={70} rotate={6} opacity={0.32} />
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 relative">
        <div className="divider mb-8" />
        <div className="lg:hidden flex items-center justify-between mb-14">
          <span className="label">02 — Work History</span>
        </div>
        <div className="lg:grid lg:grid-cols-[160px_1fr] lg:gap-x-12">
          <SectionTag number="02" label="Work" />
          <div>
            {experience.map((e, i) => (
              <div key={e.company}>
                <ExperienceRow exp={e} index={i} />
                {i < experience.length - 1 && <div className="divider" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
