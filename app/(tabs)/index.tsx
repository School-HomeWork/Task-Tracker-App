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
          <View style={[styles.badge, styles.badgePriority]}>
            <Text style={styles.badgeText}>{item.priority}</Text>
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
                placeholderTextColor="#9BA3B4"
              />
              <TextInput
                placeholder="Task description"
                value={description}
                onChangeText={setDescription}
                style={[styles.input, styles.inputMultiline]}
                placeholderTextColor="#9BA3B4"
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6FB",
  },
  backgroundAccentOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#CDE7FF",
    opacity: 0.4,
    top: -120,
    right: -60,
  },
  backgroundAccentTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#FFE8C7",
    opacity: 0.35,
    bottom: -90,
    left: -40,
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
    color: "#1E1F26",
  },
  subtitle: {
    fontSize: 14,
    color: "#5C6470",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#1F2A44",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2A44",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    gap: 12,
    shadowColor: "#1F2A44",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2A44",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E4E8F0",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#1F2A44",
    backgroundColor: "#FBFCFF",
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
    color: "#6B7280",
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
    borderColor: "#E2E7F1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F7F9FD",
  },
  choiceChipActive: {
    backgroundColor: "#1F5EFF",
    borderColor: "#1F5EFF",
  },
  choiceChipPressed: {
    opacity: 0.8,
  },
  choiceText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600",
  },
  choiceTextActive: {
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    color: "#FFFFFF",
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
    backgroundColor: "#F0F3FA",
  },
  filterChipActive: {
    backgroundColor: "#E7EDFF",
    borderWidth: 1,
    borderColor: "#1F5EFF",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterTextActive: {
    color: "#1F5EFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: "#1F2A44",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: "#F7FAF2",
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
    color: "#1F2A44",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6B7280",
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
    backgroundColor: "#E7F3FF",
  },
  badgePriority: {
    backgroundColor: "#FFF1E0",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E7F1",
    paddingVertical: 10,
    alignItems: "center",
  },
  actionPressed: {
    opacity: 0.8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2A44",
  },
  actionDelete: {
    borderColor: "#F5C2C7",
    backgroundColor: "#FFF4F4",
  },
  actionDeleteText: {
    color: "#B42318",
  },
  textMuted: {
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  emptyState: {
    marginTop: 16,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2A44",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
});
