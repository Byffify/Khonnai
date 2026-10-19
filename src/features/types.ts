import type { Command, State } from '../domain/inventory'
export interface FeatureProps { state: State; act: (command: Command) => Promise<State | false>; report: (message: string, error?: boolean) => void; ask: (message: string, action: string) => Promise<boolean>; leave: (next: () => void) => Promise<void> }
