import { useRef, useState, type ComponentRef } from 'react';
import { Alert, TextInput } from 'react-native';

import { useAuthStore } from '@/stores';

export const useLoginScreen = () => {
  const usernameRef = useRef<ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);

  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);

  const handleLogin = async () => {
    
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu');
      return;
    }

    try {
      await login(username, password);
    } catch (error: any) {
      // Surface what actually failed instead of always blaming the
      // password — a connection/SSL/timeout error has no `error.response`
      // and was previously indistinguishable from a real 401 here.
      if (!error?.response) {
        Alert.alert(
          'Không thể kết nối',
          `Không kết nối được tới máy chủ.\n${error?.message ?? ''}`
        );
        return;
      }

      const status = error.response.status;
      if (status === 400 || status === 401) {
        Alert.alert('Thông báo', 'Tài khoản hoặc mật khẩu không chính xác.');
        return;
      }

      Alert.alert(
        'Lỗi',
        `Máy chủ trả về lỗi (${status}).\n${error.response.data?.message ?? ''}`
      );
    }
  };

  return {
    usernameRef,
    passwordRef,
    username,
    setUsername,
    password,
    setPassword,
    isPasswordVisible,
    togglePasswordVisibility,
    isLoading,
    handleLogin,
  };
};
