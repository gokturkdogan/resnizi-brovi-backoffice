import { SaltAdminLogo } from '@/components/icons/Icons';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center';
};

const logoSizes = { sm: 22, md: 28, lg: 34 } as const;
const boxSizes = {
  sm: 'h-9 w-9 rounded-lg',
  md: 'h-11 w-11 rounded-xl md:h-12 md:w-12',
  lg: 'h-14 w-14 rounded-2xl',
} as const;

export function BrandLogo({
  size = 'md',
  showTitle = false,
  title,
  subtitle,
  align = 'left',
}: BrandLogoProps) {
  const centered = align === 'center';

  return (
    <div
      className={`flex min-w-0 items-center gap-3 ${centered ? 'flex-col text-center' : ''}`}
    >
      <div
        className={`flex shrink-0 items-center justify-center border border-[var(--line)] bg-[var(--accent-soft)] ${boxSizes[size]}`}
      >
        <SaltAdminLogo size={logoSizes[size]} className="text-[var(--accent)]" />
      </div>

      {showTitle && title ? (
        <div className={`min-w-0 ${centered ? '' : 'flex-1'}`}>
          <p
            className={`font-semibold tracking-tight text-[var(--ink)] ${
              size === 'lg' ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
            }`}
          >
            {title}
          </p>
          {subtitle ? (
            <p
              className={`mt-0.5 text-sm text-[var(--muted)] ${centered ? '' : 'truncate'}`}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
