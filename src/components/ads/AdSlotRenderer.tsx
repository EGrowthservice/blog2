import Image from 'next/image';
import Link from 'next/link';
import AdSense from './AdSense';
import { IAdvertisement } from '@/types';

interface AdSlotRendererProps {
  ad?: IAdvertisement | null;
  positionName?: string;
  className?: string;
}

export default function AdSlotRenderer({ ad, positionName, className = '' }: AdSlotRendererProps) {
  if (!ad || !ad.isActive) {
    return null;
  }

  return (
    <div className={`my-6 text-center ${className}`}>
      <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1.5">
        Advertisement {positionName ? `· ${positionName}` : ''}
      </span>

      {ad.type === 'adsense' && (
        <AdSense
          client={ad.adClient}
          slot={ad.adSlot}
          className="mx-auto"
        />
      )}

      {ad.type === 'image' && ad.imageUrl && (
        <div className="relative inline-block max-w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          {ad.linkUrl ? (
            <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer nofollow" className="block relative">
              <div className="relative w-full max-w-[970px] h-[120px] md:h-[180px]">
                <Image
                  src={ad.imageUrl}
                  alt={ad.name || 'Sponsor'}
                  fill
                  className="object-cover"
                />
              </div>
              {ad.content && (
                <div className="p-2.5 bg-slate-900/90 text-white text-xs font-medium text-left truncate">
                  {ad.content}
                </div>
              )}
            </Link>
          ) : (
            <div className="relative w-full max-w-[970px] h-[120px] md:h-[180px]">
              <Image
                src={ad.imageUrl}
                alt={ad.name || 'Sponsor'}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      )}

      {ad.type === 'html' && ad.content && (
        <div
          className="inline-block max-w-full overflow-hidden"
          dangerouslySetInnerHTML={{ __html: ad.content }}
        />
      )}
    </div>
  );
}
