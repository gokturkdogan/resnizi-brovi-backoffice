import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function Icon({ size = 16, className, children, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconQr({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 14h2v2h-2zM18 14h3v3h-3zM14 18h2v3h-2zM18 18h1v1h-1zM20 18h1v1h-1z" />
    </Icon>
  );
}

export function IconRefresh({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </Icon>
  );
}

export function IconClock({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

export function IconTrend({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 8h6v6" />
    </Icon>
  );
}

export function IconPeak({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M4 18 9.5 8.5 13 14l3.5-5.5L20 18" />
      <path d="M4 18h16" />
    </Icon>
  );
}

export function IconGlobe({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </Icon>
  );
}

export function IconMonitor({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </Icon>
  );
}

export function IconBrowser({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.7 4 5.8 4 9s-1.5 6.3-4 9c-2.5-2.7-4-5.8-4-9s1.5-6.3 4-9z" />
    </Icon>
  );
}

export function IconDevice({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </Icon>
  );
}

export function IconActivity({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M4 14h3l2-6 4 12 2-6h5" />
    </Icon>
  );
}

export function IconWebsite({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5z" />
      <path d="M4 9h16M9 4v16" />
    </Icon>
  );
}

export function IconDatabase({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </Icon>
  );
}

export function IconDashboard({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </Icon>
  );
}

export function IconMapPin({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

export function IconMenu({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function IconClose({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

export function IconLogout({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M10 7V5.5A1.5 1.5 0 0 1 11.5 4h7A1.5 1.5 0 0 1 20 5.5v13A1.5 1.5 0 0 1 18.5 20h-7A1.5 1.5 0 0 1 10 18.5V17" />
      <path d="M14 12H4m0 0 3-3M4 12l3 3" />
    </Icon>
  );
}

export function IconLock({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </Icon>
  );
}

export function IconLanguages({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M5 8h8M9 4v16" />
      <path d="m5 16 3-4 3 4" />
      <path d="M14 8h5M16.5 4v16" />
      <path d="m14 16 2.5-4 2.5 4" />
    </Icon>
  );
}

export function IconAlert({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16.5h.01" strokeWidth="2.5" />
    </Icon>
  );
}

export function IconChartEmpty({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15l3-4 3 2 4-6" />
    </Icon>
  );
}

export function SaltAdminLogo({
  size = 32,
  className,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      <rect
        x="2.5"
        y="2.5"
        width="27"
        height="27"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="6"
        y="6"
        width="10"
        height="10"
        rx="2.5"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M8.5 13.5 10.2 11.2 11.8 12.5 14.8 9"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="18"
        y="6"
        width="8"
        height="5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M19.5 8.2h5M19.5 9.8h3.2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
      <rect
        x="6"
        y="18"
        width="10"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M8.5 22.5h5M8.5 24h7"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
      <rect
        x="18"
        y="13"
        width="8"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M20 21.5v-5.5M22 23v-7.5M24 19.5v-3"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function chartKindIcon(kind: 'country' | 'os' | 'browser' | 'device') {
  switch (kind) {
    case 'country':
      return IconGlobe;
    case 'os':
      return IconMonitor;
    case 'browser':
      return IconBrowser;
    case 'device':
      return IconDevice;
  }
}

export function healthItemIcon(id: 'website' | 'qr' | 'database' | 'backoffice' | 'geo') {
  switch (id) {
    case 'website':
      return IconWebsite;
    case 'qr':
      return IconQr;
    case 'database':
      return IconDatabase;
    case 'backoffice':
      return IconDashboard;
    case 'geo':
      return IconMapPin;
  }
}
