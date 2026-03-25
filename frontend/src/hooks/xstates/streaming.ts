import { createMachine, assign } from 'xstate';
import { produce } from 'immer'; // v4 wymaga ręcznego użycia produce z immer

// Typy wyciągnięte z Twojego kodu v5
export interface StreamingContext {
  messages: any[];
  streamingMessage: string;
  reasoningMessage: string;
}

export type StreamingEvent =
  | { type: 'START' }
  | { type: 'RECEIVE_CHUNK'; chunk: string }
  | { type: 'RECEIVE_REASONING_CHUNK'; chunk: string }
  | { type: 'ERROR'; error: any }
  | { type: 'FINISH' };

export const streamingMachine = createMachine<StreamingContext, StreamingEvent>(
  {
    id: 'streaming',
    initial: 'idle',
    context: {
      messages: [],
      streamingMessage: '',
      reasoningMessage: '',
    },
    states: {
      idle: {
        on: { START: 'streaming' },
      },
      streaming: {
        on: {
          RECEIVE_CHUNK: {
            actions: 'assignChunk',
          },
          RECEIVE_REASONING_CHUNK: {
            actions: 'assignReasoningChunk',
          },
          ERROR: 'error',
          FINISH: 'finished',
        },
      },
      error: {
        on: { START: 'streaming' },
      },
      finished: {
        on: { START: 'streaming' },
      },
    },
  },
  {
    actions: {
      // W v4 argumenty to (context, event). Używamy produce z immer ręcznie.
      assignChunk: assign((context, event) => {
        if (event.type !== 'RECEIVE_CHUNK') return context;
        return produce(context, (draft) => {
          draft.streamingMessage += event.chunk;
        });
      }),
      assignReasoningChunk: assign((context, event) => {
        if (event.type !== 'RECEIVE_REASONING_CHUNK') return context;
        return produce(context, (draft) => {
          draft.reasoningMessage += event.chunk;
        });
      }),
    },
  }
);