import { BattleStatePlayer } from 'app/types/battles';
import clsx from 'clsx';
import { Icon } from 'components/ui/icon';
import { TamagotchiAvatar } from 'components/common/tamagotchi-avatar';
import { useEffect, useState } from 'react';

type TamagotchiBattleInfoCardProps = {
  tamagotchi: BattleStatePlayer;
  isActive: boolean;
};
export const TamagotchiBattleInfoCard = ({ tamagotchi, isActive }: TamagotchiBattleInfoCardProps) => {
  const [dead, setDead] = useState(false);

  useEffect(() => {
    setDead(!tamagotchi.health);
    return () => setDead(false);
  }, [tamagotchi]);

  return (
    <div className="relative grid gap-1.5 xxl:gap-4 justify-center w-fit pt-7 xxl:pt-13 pb-6 px-5">
      <svg
        className="absolute inset-x-0 top-0 -z-1 w-full transition-opacity duration-1000 opacity-100"
        viewBox="0 0 160 246"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 39.7723C0 33.0257 4.23198 27.004 10.5797 24.7184L79.2308 0L149.329 24.7586C155.724 27.0174 160 33.0628 160 39.8452V246H0V39.7723Z"
          fill={`url(#${tamagotchi.tmgId})`}
        />
        <defs>
          <linearGradient id={tamagotchi.tmgId} x1="80" y1="0" x2="80" y2="246" gradientUnits="userSpaceOnUse">
            <stop stopColor={dead ? '#1852ff' : isActive ? '#16b768' : '#1852ff'} />
            <stop offset="1" stopColor="#29292B" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {dead && (
        <Icon name="message-rip" className="absolute top-6 right-3 xxl:top-10 xxl:right-2 w-5 xxl:w-6 h-5 xxl:h-6" />
      )}
      <div
        className={clsx(
          'relative w-15 xxl:w-24 aspect-square m-auto rounded-full overflow-hidden ring-4 ring-opacity-10',
          dead ? 'bg-error ring-error' : 'bg-white ring-white',
        )}>
        <TamagotchiAvatar
          className="w-30 xxl:w-48 aspect-square -left-1/2"
          age={tamagotchi.dateOfBirth}
          color={tamagotchi.color}
          isDead={dead}
        />
      </div>
      <h3 className="flex justify-center text-center tracking-[0.03em] text-lg font-medium leading-7">
        <span className="block truncate max-w-[10ch]">{tamagotchi?.name ? tamagotchi.name : 'Geary'}</span>
      </h3>
      <div
        className={clsx('relative w-full xxl:w-30 px-4 rounded-xl overflow-hidden', dead ? 'bg-error' : 'bg-white/10')}>
        {!dead && (
          <div className="absolute inset-0 rounded-xl bg-primary" style={{ width: `${tamagotchi.health / 25}%` }} />
        )}
        <div className="relative flex gap-2 items-center justify-center">
          <Icon name="health" className="w-3 xxl:w-3.5 aspect-square" />
          <span className="font-kanit text-xs font-medium leading-5">{Math.round(tamagotchi.health / 25)} / 100</span>
        </div>
      </div>
    </div>
  );
};
