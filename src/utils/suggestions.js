export const generateSuggestions = (tasks, projects) => {
  const suggestions = [];
  const now = new Date();

  const overdue = tasks.filter(t =>
    !t.isCompleted && t.dueDate && new Date(t.dueDate) < now
  );
  if (overdue.length > 0)
    suggestions.push({ type: 'warning', message: `⚠️ ${overdue.length} task(s) are overdue. Prioritize them today!` });

  const highPriority = tasks.filter(t => !t.isCompleted && t.priority === 'HIGH');
  if (highPriority.length > 0)
    suggestions.push({ type: 'danger', message: `🔴 ${highPriority.length} high-priority task(s) need your attention.` });

  const completed = tasks.filter(t => t.isCompleted).length;
  const total = tasks.length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (rate >= 80)
    suggestions.push({ type: 'success', message: `🎉 Great work! You are at ${rate}% productivity this week.` });
  else if (rate < 50 && total > 0)
    suggestions.push({ type: 'info', message: `📉 Your productivity is at ${rate}%. Try completing smaller tasks first.` });

  const dueSoon = projects.filter(p => {
    if (!p.dueDate) return false;
    const diff = (new Date(p.dueDate) - now) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 3;
  });
  if (dueSoon.length > 0)
    suggestions.push({ type: 'warning', message: `📅 "${dueSoon[0].name}" project is due in 3 days or less!` });

  if (suggestions.length === 0)
    suggestions.push({ type: 'success', message: `✅ Everything looks good! Keep up the great work.` });

  return suggestions;
};