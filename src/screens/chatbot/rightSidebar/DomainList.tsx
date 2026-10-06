import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { APP_COLORS } from '@/theme';

import DomainListItem from './DomainListItem';
import { domainListStyles as styles } from './DomainList.styles';

import type { QlChuyenNganhDacThu } from '@/types';

export interface DomainListProps {
  items: QlChuyenNganhDacThu[];
  isLoading: boolean;
  isError: boolean;
  isDomainSelected: (gid: number) => boolean;
  onToggleDomain: (gid: number) => void;
}

const DomainList: React.FC<DomainListProps> = ({
  items,
  isLoading,
  isError,
  isDomainSelected,
  onToggleDomain,
}) => {
  if (isLoading) {
    return (
      <View style={styles.messageBox}>
        <ActivityIndicator color={APP_COLORS.chatBrandRed} />
        <Text style={styles.messageText}>Đang tải ngành đặc thù...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>
          Không tải được danh sách ngành đặc thù.
        </Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>
          Không tìm thấy ngành đặc thù nào.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.gid)}
      renderItem={({ item }) => (
        <DomainListItem
          item={item}
          isSelected={isDomainSelected(item.gid)}
          onPress={onToggleDomain}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default DomainList;
