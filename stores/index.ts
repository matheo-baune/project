// Central store index file to avoid duplicate imports and facilitate maintenance
import {useUserStore} from './user';
import {useGroupStore} from './group';
import {useEventStore} from './event';
import {useGiftStore} from './gift';
import {useThemeStore} from './theme';

// Export all stores from a single file
export {
    useUserStore,
    useGroupStore,
    useEventStore,
    useGiftStore,
    useThemeStore
};
