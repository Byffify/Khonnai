import type { Command, State } from '../domain/inventory'
import type { ConfirmOptions } from '../ConfirmDialog'
export interface FeatureProps { state: State; act: (command: Command) => Promise<State | false>; report: (message: string, error?: boolean) => void; ask: (message: string, action: string, options?: ConfirmOptions) => Promise<boolean>; leave: (next: () => void) => Promise<void> }
