import React from 'react';

const glyphs = {
  ArrowLeft: '←', ArrowRight: '→', Box: '□', Building2: '▥', CalendarDays: '◷',
  Check: '✓', CheckCircle2: '✓', ChevronRight: '›', Clipboard: '▣', Clock3: '◷',
  Edit3: '✎', ExternalLink: '↗', FileText: '▤', Home: '⌂', Info: 'i',
  LineChart: '⌁', MapPin: '●', MessageCircle: '◌', PackageCheck: '▧', Phone: '⌕',
  Plus: '+', ShieldCheck: '✓', Sparkles: '✦', Star: '★', Trash2: '×',
  Truck: '▰', Upload: '↑', X: '×'
};

const createIcon = name => function Icon({ size = 18, className = '', ...props }) {
  const circle = name === 'CheckCircle2';
  return <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {circle && <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />}
    <text x="12" y="12.5" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize={name === 'Info' ? 15 : 17} fontFamily="system-ui, sans-serif" fontWeight="700">{glyphs[name]}</text>
  </svg>;
};

export const ArrowLeft = createIcon('ArrowLeft');
export const ArrowRight = createIcon('ArrowRight');
export const Box = createIcon('Box');
export const Building2 = createIcon('Building2');
export const CalendarDays = createIcon('CalendarDays');
export const Check = createIcon('Check');
export const CheckCircle2 = createIcon('CheckCircle2');
export const ChevronRight = createIcon('ChevronRight');
export const Clipboard = createIcon('Clipboard');
export const Clock3 = createIcon('Clock3');
export const Edit3 = createIcon('Edit3');
export const ExternalLink = createIcon('ExternalLink');
export const FileText = createIcon('FileText');
export const Home = createIcon('Home');
export const Info = createIcon('Info');
export const LineChart = createIcon('LineChart');
export const MapPin = createIcon('MapPin');
export const MessageCircle = createIcon('MessageCircle');
export const PackageCheck = createIcon('PackageCheck');
export const Phone = createIcon('Phone');
export const Plus = createIcon('Plus');
export const ShieldCheck = createIcon('ShieldCheck');
export const Sparkles = createIcon('Sparkles');
export const Star = createIcon('Star');
export const Trash2 = createIcon('Trash2');
export const Truck = createIcon('Truck');
export const Upload = createIcon('Upload');
export const X = createIcon('X');
