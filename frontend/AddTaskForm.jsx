import React, { useState } from 'react'

function AddTaskForm() {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('Title cannot be empty or contain only spaces.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: trimmedTitle,
          priority,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task')
      }

      setTitle('')
      setPriority('Medium')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '420px', margin: '20px auto' }}>
      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="task-title" style={{ display: 'block', marginBottom: '6px' }}>
          Title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: error ? '1px solid #d93025' : '1px solid #ccc',
            borderRadius: '6px',
            boxSizing: 'border-box',
          }}
        />
        {error && (
          <div style={{ color: '#d93025', fontSize: '14px', marginTop: '6px' }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="task-priority" style={{ display: 'block', marginBottom: '6px' }}>
          Priority
        </label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxSizing: 'border-box',
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '10px 16px',
          backgroundColor: isSubmitting ? '#999' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? 'Saving...' : 'Add Task'}
      </button>
    </form>
  )
}

export default AddTaskForm