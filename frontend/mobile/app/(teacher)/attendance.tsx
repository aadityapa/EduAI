import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { fetchClassAttendance, fetchTeacherClasses } from '../../src/api/services';
import { StitchCard, StitchScreenHeader } from '../../src/components/stitch';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OfflineBanner,
  PrimaryButton,
  Screen,
  themedRefreshControl,
  tokens,
} from '../../src/components/ui';
import { useCachedResource } from '../../src/hooks/useCachedResource';

type ClassRow = { id?: string; name?: string };

export default function AttendanceScreen() {
  const { tokens: authTokens } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const classesFetcher = useCallback(() => {
    if (!authTokens) return Promise.reject(new Error('Not signed in'));
    return fetchTeacherClasses(authTokens.accessToken) as Promise<ClassRow[]>;
  }, [authTokens]);

  const {
    data: classes,
    loading: classesLoading,
    error: classesError,
    offline: classesOffline,
    reload: reloadClasses,
  } = useCachedResource<ClassRow[]>(
    authTokens ? 'teacher_classes' : null,
    authTokens ? classesFetcher : null,
  );

  const classId = selectedId ?? classes?.[0]?.id ?? null;

  const attendanceFetcher = useCallback(() => {
    if (!authTokens || !classId) return Promise.reject(new Error('No class'));
    return fetchClassAttendance(authTokens.accessToken, classId) as Promise<unknown[]>;
  }, [authTokens, classId]);

  const {
    data: rows,
    loading,
    refreshing,
    error,
    offline,
    reload,
  } = useCachedResource<unknown[]>(
    authTokens && classId ? `attendance_${classId}` : null,
    authTokens && classId ? attendanceFetcher : null,
  );

  const attendance = rows ?? [];
  const className = useMemo(
    () => classes?.find((c) => c.id === classId)?.name ?? 'Class',
    [classes, classId],
  );

  if (classesLoading) {
    return (
      <Screen>
        <LoadingState label="Loading attendance…" />
      </Screen>
    );
  }

  if (classesError && !classes?.length) {
    return (
      <Screen>
        <ErrorState title="Couldn't load classes" body={classesError} onRetry={() => void reloadClasses()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <StitchScreenHeader title="Attendance" />
      <FlatList
        data={attendance}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        refreshControl={themedRefreshControl({
          refreshing,
          onRefresh: () => void reload(),
        })}
        ListHeaderComponent={
          <View>
            <OfflineBanner visible={offline || classesOffline} />
            <Text style={styles.subtitle}>{className}</Text>
            {(classes ?? []).length > 1 ? (
              <View style={styles.classPicker}>
                {(classes ?? []).slice(0, 4).map((c) => (
                  <PrimaryButton
                    key={c.id}
                    label={c.name ?? 'Class'}
                    variant={c.id === classId ? 'filled' : 'outline'}
                    onPress={() => setSelectedId(c.id ?? null)}
                  />
                ))}
              </View>
            ) : null}
            {loading && !refreshing ? <LoadingState label="Loading roster…" /> : null}
            {error && attendance.length === 0 && !loading ? (
              <EmptyState title="No attendance data" body={error} actionLabel="Retry" onAction={() => void reload()} />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="No records today"
              body="Attendance for this class will appear after the first mark session."
            />
          ) : null
        }
        renderItem={({ item }) => {
          const row = item as {
            studentName?: string;
            student?: { firstName?: string; lastName?: string };
            status?: string;
          };
          const name =
            row.studentName ??
            [row.student?.firstName, row.student?.lastName].filter(Boolean).join(' ') ??
            'Student';
          return (
            <StitchCard>
              <Text style={styles.title}>{name}</Text>
              <Text style={styles.meta}>{row.status ?? '—'}</Text>
            </StitchCard>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: tokens.spacing.md, paddingBottom: 100, flexGrow: 1 },
  subtitle: {
    fontSize: tokens.fontSize.sm,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.sm,
    fontWeight: '600',
  },
  classPicker: { gap: 4, marginBottom: tokens.spacing.sm },
  title: { fontWeight: '700', color: tokens.colors.text },
  meta: { color: tokens.colors.textMuted, marginTop: 4, fontSize: tokens.fontSize.sm },
});
