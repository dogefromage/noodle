import * as lang from '@fluss/language';
import { ConsumerInputSignal, ConsumerState, DocumentConsumer } from '@fluss/shared';
// import OfflineWorker from './offlineInterpreter?worker';
import { wrap } from 'comlink';

type State = ConsumerState 
    | { type: 'running', worker: Worker };

export class OfflineConsumer extends DocumentConsumer {

    private _state: State = { type: 'idle' };
    private document: lang.FlowDocument | null = null;

    get state(): State {
        return this._state;
    }

    private updateState(next: State) {
        this._state = next;
        this.emit('state-changed', next);
    }

    setDocument(document: lang.FlowDocument): void {
        this.document = document;
    }

    signalInput(input: ConsumerInputSignal): void {
        switch (input) {
            case 'run':
                this.runInterpreter();
                return;
            case 'abort':
                this.abortInterpreter();
                return;
        }
        throw new Error(`Input signal not implemented '${input}'`);
    }

    private async runInterpreter() {
        if (!this.document) {
            return console.error(`No document set.`);
        }

        if (this.state.type != 'idle') {
            return;
        }
        const worker = new Worker(
            new URL('./interpreterWorker.js', import.meta.url),
            { type: 'module' }
        );
        this.updateState({ type: 'running', worker });

        const { validateAndInterpret } = wrap<import('./interpreterWorker').InterpreterWorker>(worker);
        try {
            const result = await validateAndInterpret(this.document, { args: {} });
            this.emit('output', result);
        }
        finally {
            this.updateState({ type: 'idle' });
        }
    }

    private abortInterpreter() {
        const worker: Worker = (this.state as any).worker;
        if (worker == null) {
            return;
        }
        worker?.terminate();
        this.emit('output', { data: 'Program aborted.\n' });
        this.updateState({ type: 'idle' });
    }
}