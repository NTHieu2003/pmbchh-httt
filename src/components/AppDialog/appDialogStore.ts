import { create } from 'zustand';

// `danger` = confirm a destructive action (⚠, red), `error` = something
// failed (⊗, red).
export type AppDialogTone = 'info' | 'success' | 'warning' | 'danger' | 'error';

// Same shape as React Native's AlertButton, so `Alert.alert(...)` call
// sites migrate to `appAlert(...)` without touching their buttons.
export interface AppAlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface AppAlertOptions {
  // Icon/color of the dialog — inferred from the title/buttons if omitted.
  tone?: AppDialogTone;
  // Tap on the backdrop dismisses (runs the `cancel` button's onPress if
  // there is one). Default false — matches Android's Alert default.
  cancelable?: boolean;
}

export interface AppDialogRequest {
  id: number;
  title: string;
  message?: string;
  buttons: AppAlertButton[];
  tone: AppDialogTone;
  cancelable: boolean;
}

interface AppDialogState {
  queue: AppDialogRequest[];
  push: (request: AppDialogRequest) => void;
  shift: () => void;
}

export const useAppDialogStore = create<AppDialogState>((set) => ({
  queue: [],
  push: (request) => set((s) => ({ queue: [...s.queue, request] })),
  shift: () => set((s) => ({ queue: s.queue.slice(1) })),
}));

const ERROR_TITLE = /lỗi|thất bại|không thể/i;
const SUCCESS_TITLE = /thành công|đã lưu|hoàn tất/i;

const inferTone = (title: string, buttons: AppAlertButton[]): AppDialogTone => {
  if (buttons.some((b) => b.style === 'destructive')) return 'danger';
  if (ERROR_TITLE.test(title)) return 'error';
  if (SUCCESS_TITLE.test(title)) return 'success';
  if (buttons.length > 1) return 'warning';
  return 'info';
};

let nextId = 1;

// Drop-in replacement for `Alert.alert(title, message, buttons)` that
// renders the app's styled AppDialog instead of the native OS dialog.
// Requires <AppDialogHost /> mounted once at the app root (App.tsx).
// Dialogs queue — a second call while one is open shows after it closes.
export const appAlert = (
  title: string,
  message?: string,
  buttons?: AppAlertButton[],
  options?: AppAlertOptions
) => {
  const resolvedButtons = buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];
  useAppDialogStore.getState().push({
    id: nextId++,
    title,
    message,
    buttons: resolvedButtons,
    tone: options?.tone ?? inferTone(title, resolvedButtons),
    cancelable: options?.cancelable ?? false,
  });
};
