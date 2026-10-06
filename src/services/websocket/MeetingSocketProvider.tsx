import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import MeetingSocketService from './MeetingSocketService';

type SocketMessageHandler = (data: unknown) => void;

interface MeetingSocketContextValue {
  isSocketConnected: boolean;
  sendMessage: (message: string) => Promise<void>;
  subscribeSocket: (handler: SocketMessageHandler) => () => void;
}

const MeetingSocketContext = createContext<MeetingSocketContextValue | undefined>(undefined);

// Mirrors pmbc_mobile's WebSocketProvider: one shared socket connection for
// the whole authenticated app, fanned out to subscribers via a plain
// Set<callback> rather than React state, since meeting rooms both read
// every incoming frame AND need a stable function identity to
// subscribe/unsubscribe from inside `useFocusEffect`.
export const MeetingSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const handlersRef = useRef<Set<SocketMessageHandler>>(new Set());
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    MeetingSocketService.setOnSocketChange((socket) => {
      setIsSocketConnected(socket?.readyState === WebSocket.OPEN);

      if (socket) {
        socket.onmessage = (event: WebSocketMessageEvent) => {
          let data: unknown;
          try {
            data = JSON.parse(event.data);
          } catch {
            data = event.data;
          }
          handlersRef.current.forEach((handler) => handler(data));
        };
      }
    });

    MeetingSocketService.connect().catch(() => {});

    return () => {
      MeetingSocketService.close();
    };
  }, []);

  // Reconnects on demand (the first group-join send after a drop) before
  // actually sending — same retry-once shape as pmbc_mobile's
  // `sendSocketService`.
  const sendMessage = async (message: string) => {
    if (!MeetingSocketService.isConnected()) {
      await MeetingSocketService.connect().catch(() => {});
    }
    MeetingSocketService.send(message);
  };

  const subscribeSocket = (handler: SocketMessageHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  };

  return (
    <MeetingSocketContext.Provider value={{ isSocketConnected, sendMessage, subscribeSocket }}>
      {children}
    </MeetingSocketContext.Provider>
  );
};

export const useMeetingSocket = (): MeetingSocketContextValue => {
  const context = useContext(MeetingSocketContext);
  if (!context) {
    throw new Error('useMeetingSocket must be used within a MeetingSocketProvider');
  }
  return context;
};
