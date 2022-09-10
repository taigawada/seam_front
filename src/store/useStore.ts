import { SetupContext } from '@vue/composition-api';
export const useStore = (context: SetupContext) => context.root.$store;
