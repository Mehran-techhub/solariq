import { Link } from 'react-router-dom';
import { Sun, Code2, Briefcase, Mail, MessageCircle } from 'lucide-react';

const links = {
  Product: ['Features', 'Analytics', 'Reports', 'Simulation', 'Dashboard'],
  Resources: ['Documentation', 'API Reference', 'Privacy Policy', 'Terms of Service'],
  Company: ['About SolarIQ', 'Contact Us', 'Changelog', 'Roadmap'],
};

const team = [
  { name: 'M. Mehran Amjad', role: 'Full-Stack Developer' },
  { name: 'Ali Hassan', role: 'Backend Engineer' },
  { name: 'Waqar Ali', role: 'Frontend Developer' },
];

const socials = [
  { Icon: Code2, href: '#', label: 'GitHub' },
  { Icon: Briefcase, href: '#', label: 'LinkedIn' },
  { Icon: MessageCircle, href: '#', label: 'Twitter' },
  { Icon: Mail, href: 'mailto:contact@solariq.app', label: 'Email' },
];

export default function Footer() {
  return (
    <footer
      className="relative pt-16 pb-8"
      style={{
        background: 'rgba(2,11,20,0.99)',
        borderTop: '1px solid rgba(14,165,233,0.08)',
      }}
    >
      <div className="solar-container">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #0F766E, #0EA5E9)',
                  boxShadow: '0 4px 14px rgba(15,118,110,0.3)',
                }}
              >
                <Sun className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold font-display text-white">
                Solar<span className="solar-gradient-text">IQ</span>
              </span>
            </div>

            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: '#64748B' }}>
              Smart Solar Energy Prediction, Monitoring & Optimization System. 
              Built for modern solar professionals.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(14,165,233,0.06)',
                    border: '1px solid rgba(14,165,233,0.12)',
                    color: '#64748B',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)';
                    e.currentTarget.style.color = '#0EA5E9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(14,165,233,0.12)';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Team */}
            <div className="mt-8">
              <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#475569' }}>
                Development Team
              </p>
              <div className="flex flex-col gap-2">
                {team.map((member) => (
                  <div key={member.name} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #0F766E, #0EA5E9)' }}
                    >
                      {member.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-white">{member.name}</span>
                      <span className="text-[10px] ml-2" style={{ color: '#475569' }}>{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#475569' }}>
                {section}
              </p>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: '#64748B' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#0EA5E9'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4"
          style={{ borderTop: '1px solid rgba(14,165,233,0.07)' }}
        >
          <p className="text-xs" style={{ color: '#334155' }}>
            © 2025 SolarIQ — Smart Solar Energy Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors duration-200"
                style={{ color: '#334155' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#64748B'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#334155'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
