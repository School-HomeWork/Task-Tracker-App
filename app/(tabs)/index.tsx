import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";

type Priority = "Low" | "Medium" | "High";
type Filter = "All" | "Active" | "Completed";

type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
};

const categories = ["Math", "Science", "History", "Language", "Other"];
const priorities: Priority[] = ["Low", "Medium", "High"];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState<Priority>("Medium");
  const [filter, setFilter] = useState<Filter>("All");
  const [tasks, setTasks] = useState<Task[]>([]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    return { total, completed, active: total - completed };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (filter === "Active") {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === "Completed") {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  }, [filter, tasks]);

  const addTask = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert("Missing title", "Please enter a task title before adding.");
      return;
    }

    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: trimmedTitle,
      description: description.trim(),
      category,
      priority,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((current) => [newTask, ...current]);
    setTitle("");
    setDescription("");
  };

  const toggleTask = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const getPriorityBadgeStyle = (value: Priority) => {
    if (value === "High") return styles.badgePriorityHigh;
    if (value === "Medium") return styles.badgePriorityMedium;
    return styles.badgePriorityLow;
  };

  const getPriorityTextStyle = (value: Priority) => {
    if (value === "High") return styles.badgePriorityHighText;
    if (value === "Medium") return styles.badgePriorityMediumText;
    return styles.badgePriorityLowText;
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={[styles.card, item.completed && styles.cardCompleted]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitles}>
          <Text style={[styles.cardTitle, item.completed && styles.textMuted]}>
            {item.title}
          </Text>
          {!!item.description && (
            <Text
              style={[styles.cardSubtitle, item.completed && styles.textMuted]}
            >
              {item.description}
            </Text>
          )}
        </View>
        <View style={styles.badges}>
          <View style={[styles.badge, styles.badgeCategory]}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
          <View style={[styles.badge, getPriorityBadgeStyle(item.priority)]}>
            <Text
              style={[styles.badgeText, getPriorityTextStyle(item.priority)]}
            >
              {item.priority}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.cardActions}>
        <Pressable
          onPress={() => toggleTask(item.id)}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionPressed,
          ]}
        >
          <Text style={styles.actionText}>
            {item.completed ? "Mark Active" : "Mark Done"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => deleteTask(item.id)}
          style={({ pressed }) => [
            styles.actionButton,
            styles.actionDelete,
            pressed && styles.actionPressed,
          ]}
        >
          <Text style={[styles.actionText, styles.actionDeleteText]}>
            Delete
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundAccentOne} />
      <View style={styles.backgroundAccentTwo} />

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Study Task Tracker</Text>
            <Text style={styles.subtitle}>
              Track lessons, priorities, and completion status.
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.active}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.completed}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Add a new task</Text>
              <TextInput
                placeholder="Task title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                placeholderTextColor={theme.muted}
              />
              <TextInput
                placeholder="Task description"
                value={description}
                onChangeText={setDescription}
                style={[styles.input, styles.inputMultiline]}
                placeholderTextColor={theme.muted}
                multiline
              />

              <View style={styles.selectionRow}>
                <Text style={styles.selectionLabel}>Category</Text>
                <View style={styles.choiceRow}>
                  {categories.map((item) => (
                    <Pressable
                      key={item}
                      onPress={() => setCategory(item)}
                      style={({ pressed }) => [
                        styles.choiceChip,
                        category === item && styles.choiceChipActive,
                        pressed && styles.choiceChipPressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          category === item && styles.choiceTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.selectionRow}>
                <Text style={styles.selectionLabel}>Priority</Text>
                <View style={styles.choiceRow}>
                  {priorities.map((item) => (
                    <Pressable
                      key={item}
                      onPress={() => setPriority(item)}
                      style={({ pressed }) => [
                        styles.choiceChip,
                        priority === item && styles.choiceChipActive,
                        pressed && styles.choiceChipPressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          priority === item && styles.choiceTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                onPress={addTask}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.addButtonPressed,
                ]}
              >
                <Text style={styles.addButtonText}>Add Task</Text>
              </Pressable>
            </View>

            <View style={styles.filterRow}>
              {(["All", "Active", "Completed"] as Filter[]).map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setFilter(item)}
                  style={({ pressed }) => [
                    styles.filterChip,
                    filter === item && styles.filterChipActive,
                    pressed && styles.choiceChipPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === item && styles.filterTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tasks yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first lesson task to get started.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

type ThemeTokens = {
  background: string;
  card: string;
  cardMuted: string;
  text: string;
  textMuted: string;
  muted: string;
  border: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  shadow: string;
  chip: string;
  chipActive: string;
  input: string;
  backgroundAccentOne: string;
  backgroundAccentTwo: string;
};

const lightTheme: ThemeTokens = {
  background: "#F4F6FB",
  card: "#FFFFFF",
  cardMuted: "#F6F9F2",
  text: "#1E1F26",
  textMuted: "#5C6470",
  muted: "#9BA3B4",
  border: "#E4E8F0",
  accent: "#1F5EFF",
  accentSoft: "#E7EDFF",
  accentStrong: "#111827",
  success: "#1A7F37",
  successSoft: "#E7F6EC",
  warning: "#D97706",
  warningSoft: "#FFF1E0",
  danger: "#B42318",
  dangerSoft: "#FFF4F4",
  shadow: "#1F2A44",
  chip: "#F7F9FD",
  chipActive: "#1F5EFF",
  input: "#FBFCFF",
  backgroundAccentOne: "#B7D9FF",
  backgroundAccentTwo: "#FFD8A8",
};

const darkTheme: ThemeTokens = {
  background: "#0E1117",
  card: "#161B22",
  cardMuted: "#12201A",
  text: "#F1F5F9",
  textMuted: "#9CA3AF",
  muted: "#6B7280",
  border: "#263041",
  accent: "#7C9DFF",
  accentSoft: "#1F2A52",
  accentStrong: "#F8FAFC",
  success: "#4ADE80",
  successSoft: "#0F2A1A",
  warning: "#F59E0B",
  warningSoft: "#2A1F12",
  danger: "#FB7185",
  dangerSoft: "#2A1218",
  shadow: "#000000",
  chip: "#1F2530",
  chipActive: "#7C9DFF",
  input: "#0F172A",
  backgroundAccentOne: "#2A3E7A",
  backgroundAccentTwo: "#55332B",
};

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    backgroundAccentOne: {
      position: "absolute",
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: theme.backgroundAccentOne,
      opacity: 0.35,
      top: -130,
      right: -80,
    },
    backgroundAccentTwo: {
      position: "absolute",
      width: 230,
      height: 230,
      borderRadius: 115,
      backgroundColor: theme.backgroundAccentTwo,
      opacity: 0.3,
      bottom: -90,
      left: -50,
    },
    listContent: {
      padding: 20,
      paddingBottom: 32,
      gap: 16,
    },
    header: {
      gap: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textMuted,
    },
    statsRow: {
      flexDirection: "row",
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOpacity: 0.2,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 10 },
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 4,
    },
    formCard: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 18,
      gap: 12,
      shadowColor: theme.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.border,
    },
    formTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 12,
      fontSize: 14,
      color: theme.text,
      backgroundColor: theme.input,
    },
    inputMultiline: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    selectionRow: {
      gap: 8,
    },
    selectionLabel: {
      fontSize: 13,
      color: theme.textMuted,
      fontWeight: "600",
    },
    choiceRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    choiceChip: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: theme.chip,
    },
    choiceChipActive: {
      backgroundColor: theme.chipActive,
      borderColor: theme.chipActive,
    },
    choiceChipPressed: {
      opacity: 0.8,
    },
    choiceText: {
      fontSize: 12,
      color: theme.textMuted,
      fontWeight: "600",
    },
    choiceTextActive: {
      color: theme.card,
    },
    addButton: {
      backgroundColor: theme.accentStrong,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
    },
    addButtonPressed: {
      opacity: 0.85,
    },
    addButtonText: {
      color: theme.background,
      fontWeight: "700",
      fontSize: 14,
    },
    filterRow: {
      flexDirection: "row",
      gap: 10,
    },
    filterChip: {
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 14,
      backgroundColor: theme.chip,
    },
    filterChipActive: {
      backgroundColor: theme.accentSoft,
      borderWidth: 1,
      borderColor: theme.accent,
    },
    filterText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.textMuted,
    },
    filterTextActive: {
      color: theme.accent,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 18,
      padding: 16,
      gap: 12,
      shadowColor: theme.shadow,
      shadowOpacity: 0.15,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardCompleted: {
      backgroundColor: theme.cardMuted,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    cardTitles: {
      flex: 1,
      gap: 4,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
    },
    cardSubtitle: {
      fontSize: 13,
      color: theme.textMuted,
    },
    badges: {
      alignItems: "flex-end",
      gap: 6,
    },
    badge: {
      borderRadius: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    badgeCategory: {
      backgroundColor: theme.accentSoft,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.text,
    },
    badgePriorityLow: {
      backgroundColor: theme.successSoft,
    },
    badgePriorityMedium: {
      backgroundColor: theme.warningSoft,
    },
    badgePriorityHigh: {
      backgroundColor: theme.dangerSoft,
    },
    badgePriorityLowText: {
      color: theme.success,
    },
    badgePriorityMediumText: {
      color: theme.warning,
    },
    badgePriorityHighText: {
      color: theme.danger,
    },
    cardActions: {
      flexDirection: "row",
      gap: 10,
    },
    actionButton: {
      flex: 1,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 10,
      alignItems: "center",
      backgroundColor: theme.card,
    },
    actionPressed: {
      opacity: 0.8,
    },
    actionText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.text,
    },
    actionDelete: {
      borderColor: theme.danger,
      backgroundColor: theme.dangerSoft,
    },
    actionDeleteText: {
      color: theme.danger,
    },
    textMuted: {
      color: theme.textMuted,
      textDecorationLine: "line-through",
    },
    emptyState: {
      marginTop: 16,
      padding: 20,
      backgroundColor: theme.card,
      borderRadius: 16,
      alignItems: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
    },
    emptySubtitle: {
      fontSize: 13,
      color: theme.textMuted,
      textAlign: "center",
    },
  });
