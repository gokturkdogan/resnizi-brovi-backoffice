import Image from 'next/image';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center';
};

const imageSizes = { sm: 36, md: 48, lg: 56 } as const;

export function BrandLogo({
  size = 'md',
  showTitle = false,
  title,
  subtitle,
  align = 'left',
}: BrandLogoProps) {
  const centered = align === 'center';
  const imageSize = imageSizes[size];

  return (
    <div
      className={`flex min-w-0 items-center gap-3 ${centered ? 'flex-col text-center' : ''}`}
    >
      <Image
        src="/icons/icon-512.png"
        alt=""
        width={imageSize}
        height={imageSize}
        className={`shrink-0 rounded-xl shadow-sm ${
          size === 'lg' ? 'rounded-2xl' : size === 'sm' ? 'rounded-lg' : 'rounded-xl'
        }`}
        priority
      />

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
