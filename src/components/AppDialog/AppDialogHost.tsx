import React from 'react';
import { Text, View } from 'react-native';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react-native';

import { AppModal, AppModalButton, MODAL_TONES, type AppModalButtonVariant } from '@/components/AppModal';

import { appDialogHostStyles as styles } from './AppDialogHost.styles';
import { useAppDialogStore, type AppAlertButton, type AppDialogTone } from './appDialogStore';

const TONE_ICON: Record<AppDialogTone, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertTriangle,
  error: XCircle,
};

const TONE_TO_MODAL = {
  info: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  error: 'danger',
} as const;

const buttonVariant = (button: AppAlertButton, tone: AppDialogTone): AppModalButtonVariant => {
  if (button.style === 'cancel') return 'secondary';
  if (button.style === 'destructive') return 'danger';
  return tone === 'success' ? 'success' : 'primary';
};

// Renders the head of the `appAlert` queue. Mount exactly once, at the app
// root (App.tsx) — every screen/hook then calls `appAlert(...)`.
const AppDialogHost: React.FC = () => {
  const current = useAppDialogStore((s) => s.queue[0]);
  const shift = useAppDialogStore((s) => s.shift);

  if (!current) return null;

  const { title, message, buttons, tone, cancelable } = current;
  const Icon = TONE_ICON[tone];
  const colors = MODAL_TONES[TONE_TO_MODAL[tone]];
  const cancelButton = buttons.find((b) => b.style === 'cancel');

  // Close first, then run the handler — a handler that opens another
  // appAlert gets queued behind an empty queue, not behind itself.
  const press = (button?: AppAlertButton) => {
    shift();
    button?.onPress?.();
  };

  // Android back / backdrop tap: behaves like the cancel button; a single
  // "OK" notice is also dismissible.
  const dismiss = () => {
    if (cancelButton) press(cancelButton);
    else if (buttons.length === 1) press(buttons[0]);
  };

  return (
    <AppModal
      key={current.id}
      visible
      onClose={cancelable || cancelButton || buttons.length === 1 ? dismiss : () => {}}
      dismissOnBackdrop={cancelable}
      hideCloseButton
      size="sm"
      footer={
        <View style={styles.buttonRow}>
          {buttons.map((button, index) => (
            <AppModalButton
              key={`${button.text}-${index}`}
              label={button.text}
              variant={buttonVariant(button, tone)}
              onPress={() => press(button)}
              block
            />
          ))}
        </View>
      }
    >
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.soft }]}>
          <Icon size={28} color={colors.strong} />
        </View>
        <Text style={styles.title}>{title}</Text>
        {!!message && <Text style={styles.message}>{message}</Text>}
      </View>
    </AppModal>
  );
};

export default AppDialogHost;
