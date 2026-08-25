import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Flame, Award, Target, Activity } from 'lucide-react-native';
import { useLogs } from '../store';
import { format, parseISO, differenceInDays } from 'date-fns';
import { theme } from '../theme';

export default function DailyAchievement() {
  const { logs } = useLogs();

  const stats = useMemo(() => {
    if (!logs.length) return { streak: 0, todayCompleted: false, totalDays: 0, totalCalories: 0 };

    // Get unique sorted dates based on local time
    const uniqueDays = Array.from(
      new Set(logs.map((log) => format(parseISO(log.date), 'yyyy-MM-dd')))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const yesterdayStr = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

    const todayCompleted = uniqueDays.includes(todayStr);
    let streak = 0;

    if (uniqueDays[0] === todayStr || uniqueDays[0] === yesterdayStr) {
      streak = 1;
      let currentDate = parseISO(uniqueDays[0]);

      for (let i = 1; i < uniqueDays.length; i++) {
        const nextDate = parseISO(uniqueDays[i]);
        if (differenceInDays(currentDate, nextDate) === 1) {
          streak++;
          currentDate = nextDate;
        } else {
          break;
        }
      }
    }

    return {
      streak,
      todayCompleted,
      totalDays: uniqueDays.length,
      totalCalories: Math.round(
        logs.reduce((acc, log) => acc + ((log.sets * log.durationReps) / 60) * 5, 0)
      ),
    };
  }, [logs]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Daily Session Card */}
        <View style={styles.card}>
          <View
            style={[
              styles.iconWrapper,
              stats.todayCompleted ? styles.iconWrapperSuccess : styles.iconWrapperDefault,
            ]}
          >
            <Target
              size={22}
              color={stats.todayCompleted ? theme.colors.success : theme.colors.textSubtle}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Daily Session</Text>
            <Text style={styles.value}>
              {stats.todayCompleted ? 'Completed' : 'Pending'}
            </Text>
          </View>
        </View>

        {/* Streak Card */}
        <View style={styles.card}>
          <View
            style={[
              styles.iconWrapper,
              stats.streak > 0 ? styles.iconWrapperWarning : styles.iconWrapperDefault,
            ]}
          >
            <Flame
              size={22}
              color={stats.streak > 0 ? theme.colors.warning : theme.colors.textSubtle}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Current Streak</Text>
            <Text style={styles.value}>
              {stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}
            </Text>
          </View>
        </View>

        {/* Total Training Days */}
        <View style={styles.card}>
          <View
            style={[
              styles.iconWrapper,
              stats.totalDays > 0 ? styles.iconWrapperPrimary : styles.iconWrapperDefault,
            ]}
          >
            <Award
              size={22}
              color={stats.totalDays > 0 ? theme.colors.primary : theme.colors.textSubtle}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Training Days</Text>
            <Text style={styles.value}>
              {stats.totalDays} {stats.totalDays === 1 ? 'Day' : 'Days'}
            </Text>
          </View>
        </View>

        {/* Total Calories */}
        <View style={styles.card}>
          <View
            style={[
              styles.iconWrapper,
              stats.totalCalories > 0 ? styles.iconWrapperInfo : styles.iconWrapperDefault,
            ]}
          >
            <Activity
              size={22}
              color={stats.totalCalories > 0 ? theme.colors.info : theme.colors.textSubtle}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Total Calories</Text>
            <Text style={styles.value}>{stats.totalCalories} kcal</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  iconWrapperDefault: {
    backgroundColor: theme.colors.cardLight,
  },
  iconWrapperSuccess: {
    backgroundColor: theme.colors.successBg,
  },
  iconWrapperWarning: {
    backgroundColor: theme.colors.warningBg,
  },
  iconWrapperPrimary: {
    backgroundColor: theme.colors.primaryBg,
  },
  iconWrapperInfo: {
    backgroundColor: theme.colors.infoBg,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
