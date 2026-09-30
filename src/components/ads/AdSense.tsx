'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  client?: string;
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdSense({
  client,
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = { display: 'block' },
}: AdSenseProps) {
  const adClient = client || process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (adClient && slot) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adsbygoogle = (window as any).adsbygoogle || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).adsbygoogle = adsbygoogle;
        adsbygoogle.push({});
      } catch (err) {
        console.warn('AdSense push warning:', err);
      }
    }
  }, [adClient, slot]);

  // If no slot or no client, show a subtle sponsorship indicator or nothing
  if (!adClient || !slot) {
    return (
      <div
        className={`border border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/50 text-center text-xs text-slate-400 select-none ${className}`}
      >
        <span className="font-medium tracking-wider uppercase">Advertisement Space</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden text-center my-4 ${className}`}>
      <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">
        Sponsored
      </span>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
