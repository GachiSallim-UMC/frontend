import { Panel, StatusBadge } from '@/shared/components'

import AppleIcon from '@/assets/icons/dashboard/shortage/apple.svg?react';
import CleanserIcon from '@/assets/icons/dashboard/shortage/cleanser.svg?react';
import EquipmentIcon from '@/assets/icons/dashboard/shortage/equipment.svg?react';
import EtcIcon from '@/assets/icons/dashboard/shortage/etc.svg?react';
import MedicineIcon from '@/assets/icons/dashboard/shortage/medicine.svg?react';
import PlantIcon from '@/assets/icons/dashboard/shortage/plant.svg?react';
import PotIcon from '@/assets/icons/dashboard/shortage/pot.svg?react';
import ShampooIcon from '@/assets/icons/dashboard/shortage/shampoo.svg?react';
import TissueIcon from '@/assets/icons/dashboard/shortage/tissue.svg?react';

interface Item {
  id: string;
  name: string;
  category: string;
  status: 'short' | 'empty' | string;
  buyer?: { name: string };
}

const getItemIcon = (category: string) => {
    switch (category) {
        case 'grocery':
            return <AppleIcon className="h-7 w-7" />;
        case 'cleaning':
            return <CleanserIcon className="h-7 w-7" />;
        case 'tool':
            return <EquipmentIcon className="h-7 w-7" />;
        case 'medicine':
            return <MedicineIcon className="h-7 w-7" />;
        case 'pet':
            return <PlantIcon className="h-7 w-7" />;
        case 'kitchen':
            return <PotIcon className="h-7 w-7" />;
        case 'bathroom':
            return <ShampooIcon className="h-7 w-7" />;
        case 'daily':
            return <TissueIcon className="h-7 w-7" />;
        default:
            return <EtcIcon className="h-7 w-7" />;
    }
}

export const ShortageItemsPanel = ({ items }: { items: Item[] }) => {
    return (
        <Panel>
            <ul className="flex flex-col gap-5">
                {items.map((item) => {
                    return (
                        <li key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100">
                                    {getItemIcon(item.category)}
                                </div>

                                <div>
                                    <p className="font-bold text-gray-900">{item.name}</p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        상태: {item.status === 'short' ? '부족' : '소진'} | 담당: {item.buyer?.name || '미지정'}
                                    </p>
                                </div>
                            </div>
                            <StatusBadge variant="done" />
                        </li>
                    );
                })}
            </ul>
        </Panel>
    );
};