import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AlertCircle, ExternalLink } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { SavedItem } from '../../types';
import GradientBox from './GradientBox';
import { platformGradient, timeAgo } from '../cards/ReelCard';

type Props = {
  visible: boolean;
  existingItem: SavedItem;
  onOpenExisting: () => void;
  onSaveAnyway: () => void;
  onClose: () => void;
};

export default function DuplicateAlertSheet({ visible, existingItem, onOpenExisting, onSaveAnyway, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

      <View style={styles.sheet}>
        <View style={styles.dragHandle} />

        <View style={styles.titleBlock}>
          <View style={styles.iconBadge}>
            <AlertCircle size={26} color={Palette.accent} />
          </View>
          <Text style={styles.title}>Already saved!</Text>
          <Text style={styles.subtitle}>You saved this link before. Open the existing save or add it again.</Text>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.thumb}>
            {existingItem.thumbnailUri ? (
              <Image source={{ uri: existingItem.thumbnailUri }} style={styles.thumbImage} />
            ) : (
              <GradientBox colors={platformGradient[existingItem.platform]} width={44} height={44} />
            )}
          </View>
          <View style={styles.previewInfo}>
            <Text style={styles.previewTitle} numberOfLines={1}>{existingItem.title}</Text>
            <Text style={styles.previewMeta}>
              Saved {timeAgo(existingItem.savedAt)}
              {existingItem.collection ? ` · ${existingItem.collection}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={onOpenExisting}>
            <ExternalLink size={16} color="#0C0C0C" />
            <Text style={styles.primaryBtnText}>Open Existing Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8} onPress={onSaveAnyway}>
            <Text style={styles.secondaryBtnText}>Save Anyway</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  sheet: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: Radius.xxl + 4,
    borderTopRightRadius: Radius.xxl + 4,
    borderTopWidth: 1,
    borderTopColor: Palette.borderAccent,
    padding: Spacing.xl,
    paddingBottom: 40,
    gap: 18,
  },
  dragHandle: { width: 36, height: 4, backgroundColor: Palette.border, borderRadius: 2, alignSelf: 'center' },

  titleBlock: { alignItems: 'center', gap: 12 },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.accentDim,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 22, color: Palette.textPrimary, textAlign: 'center' },
  subtitle: { fontFamily: 'DMSans-Regular', fontSize: 13, color: Palette.textMuted, textAlign: 'center', lineHeight: 20 },

  previewCard: {
    backgroundColor: Palette.bg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
  },
  thumb: { width: 44, height: 44, borderRadius: Radius.md, overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%' },
  previewInfo: { flex: 1, minWidth: 0, justifyContent: 'center' },
  previewTitle: { fontFamily: 'DMSans-SemiBold', fontSize: 12, color: Palette.textPrimary, marginBottom: 3 },
  previewMeta: { fontFamily: 'DMSans-Regular', fontSize: 10, color: Palette.textMuted },

  actions: { gap: 8 },
  primaryBtn: {
    height: 52,
    backgroundColor: Palette.accent,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryBtnText: { fontFamily: 'DMSans-Bold', fontSize: 15, color: '#0C0C0C' },
  secondaryBtn: {
    height: 52,
    backgroundColor: Palette.bg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted },
});
