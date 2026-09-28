import { useState, useEffect } from 'react';
import './App.css'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('daily_planner_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('Work')
  const [filter, setFilter] = useState('All')
  const [newTaskTime, setNewTaskTime] = useState('12:00');
  const [newTaskDate, setNewTaskDate] = useState('')
  useEffect(() => {
    localStorage.setItem('daily_planner_tasks', JSON.stringify(tasks));
  }, [tasks]);


  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  const completedCount = tasks.filter(t => t.completed).length;
  // Fetch tasks from your backend when the page loads
  // Fetch tasks from your backend when the page loads
// useEffect(() => {
//   console.log("useEffect is running!");
//   fetch("http://localhost:5000/api/tasks")
//     .then((res) => res.json())
//     .then((data) => {
//       const formattedTasks = data.map(task => ({
//         ...task,
//         id: task._id,
//         text: task.title,
//         completed: task.completed || false,
//         category: task.category || "Work",
//         time: task.time || "12:00 PM"
//       }));
//       setTasks(formattedTasks);
//     })
//     .catch((err) => console.error("Error fetching tasks:", err));
// }, []);
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0
  const formatTime = (timeStr) => {
    if (!timeStr) return "12:00 PM";
    const [hourStr, minute] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!newTaskText.trim()) return
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      category: newTaskCategory,
      completed: false,
      time: formatTime(newTaskTime),
      date: newTaskDate,
    }
    setTasks([newTask, ...tasks])
    setNewTaskText('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const filteredTasks = tasks.filter(t => {
    if (filter === 'All') return true
    if (filter === 'Active') return !t.completed
    if (filter === 'Completed') return t.completed
    return t.category === filter
  })

  return (
    <div className="planner-container">
      <header className="planner-header">
        <span className="date-badge">{today}</span>
        <h1>Daily Planner</h1>
        <p>Organize your day, achieve your goals.</p>
      </header>

      <div className="progress-card">
        <div className="progress-info">
          <span>Today's Progress</span>
          <span>{completedCount} of {tasks.length} completed ({progressPercent}%)</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="task-form">
        <input 
          type="text" 
          placeholder="Add a new task..." 
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <select value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)}>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Health">Health</option>
          <option value="Study">Study</option>
        </select>
        {/* <--- PASTE THE TIME INPUT HERE: */}
  <input 
    type="time" 
    value={newTaskTime} 
    onChange={(e) => setNewTaskTime(e.target.value)} 
  />
  <input
    type="date"
    value={newTaskDate}
    onChange={(e) => setNewTaskDate(e.target.value)}
  />
        <button type="submit">+ Add Task</button>
      </form>

      <div className="filter-buttons">
        {['All', 'Active', 'Completed', 'Work', 'Personal', 'Health', 'Study'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? 'active-filter' : ''}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks found in this category. 🎉</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-left">
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <div>
                  <p className="task-text">{task.text}</p>
                  <div className="task-meta">
                    <span className="badge">{task.category}</span>
                    <span>{task.time}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="delete-btn">✕</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}