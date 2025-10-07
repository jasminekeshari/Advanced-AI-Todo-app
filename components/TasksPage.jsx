'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { translations } from '@/lib/translations'
import { 
  CheckCircle2, Circle, Plus, Edit2, Trash2, LogOut, Globe, 
  Sparkles, Search, Calendar, X 
} from 'lucide-react'
import { toast } from 'sonner'

export default function TasksPage({ user }) {
  const [lang, setLang] = useState('en')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState({ title: '', notes: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAI, setShowAI] = useState(false)
  const [aiGoal, setAiGoal] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const t = translations[lang]

  useEffect(() => {
    const savedLang = localStorage.getItem('appLang') || 'en'
    setLang(savedLang)
    fetchTasks()
  }, [])

  const changeLang = (newLang) => {
    setLang(newLang)
    localStorage.setItem('appLang', newLang)
  }

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      toast.error(t.error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTask.title.trim()) {
      toast.error(t.titleRequired)
      return
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: newTask.title,
            notes: newTask.notes,
            user_id: user.id,
            completed: false
          }
        ])
        .select()

      if (error) throw error
      
      setTasks([data[0], ...tasks])
      setNewTask({ title: '', notes: '' })
      setShowAddTask(false)
      toast.success(t.taskAdded)
    } catch (error) {
      toast.error(t.error)
    }
  }

  const updateTask = async () => {
    if (!editingTask.title.trim()) {
      toast.error(t.titleRequired)
      return
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: editingTask.title,
          notes: editingTask.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTask.id)

      if (error) throw error

      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, title: editingTask.title, notes: editingTask.notes }
          : task
      ))
      setEditingTask(null)
      toast.success(t.taskUpdated)
    } catch (error) {
      toast.error(t.error)
    }
  }

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTasks(tasks.filter(task => task.id !== id))
      toast.success(t.taskDeleted)
    } catch (error) {
      toast.error(t.error)
    }
  }

  const toggleComplete = async (task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed: !task.completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id)

      if (error) throw error

      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, completed: !t.completed } : t
      ))
    } catch (error) {
      toast.error(t.error)
    }
  }

  const generateAITasks = async () => {
    if (!aiGoal.trim()) {
      toast.error('Please enter your goal')
      return
    }

    setAiLoading(true)

    // Mock AI generation (you can replace with real API later)
    setTimeout(async () => {
      const suggestions = [
        { 
          title: `Research best practices for ${aiGoal}`, 
          notes: 'Gather information from reliable sources and document findings' 
        },
        { 
          title: `Create detailed action plan for ${aiGoal}`, 
          notes: 'Break down into smaller, manageable steps with deadlines' 
        },
        { 
          title: `Set measurable milestones for ${aiGoal}`, 
          notes: 'Define clear success criteria and tracking methods' 
        },
        { 
          title: `Identify resources needed for ${aiGoal}`, 
          notes: 'List tools, time, budget, and people required' 
        },
      ]

      try {
        const tasksToInsert = suggestions.map(task => ({
          title: task.title,
          notes: task.notes,
          user_id: user.id,
          completed: false
        }))

        const { data, error } = await supabase
          .from('tasks')
          .insert(tasksToInsert)
          .select()

        if (error) throw error

        setTasks([...data, ...tasks])
        setShowAI(false)
        setAiGoal('')
        toast.success(`${data.length} tasks generated successfully!`)
      } catch (error) {
        toast.error(t.error)
      } finally {
        setAiLoading(false)
      }
    }, 1500)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && task.completed) ||
                         (filter === 'pending' && !task.completed)
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t.appTitle}</h1>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'en' ? 'हिं' : 'EN'}</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t.total}</p>
                <p className="text-4xl font-bold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t.completed}</p>
                <p className="text-4xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t.pending}</p>
                <p className="text-4xl font-bold text-orange-600 mt-1">{stats.pending}</p>
              </div>
              <Circle className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'all' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.allTasks}
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'pending' ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.pendingTasks}
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'completed' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.completedTasks}
              </button>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-5 h-5" />
              {t.addTask}
            </button>
            
            <button
              onClick={() => setShowAI(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              {t.aiGenerate}
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <CheckCircle2 className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">{t.noTasks}</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all hover:shadow-md ${
                  task.completed ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(task)}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-purple-600 transition-colors" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-semibold break-words ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}>
                      {task.title}
                    </h3>
                    {task.notes && (
                      <p className="text-gray-600 text-sm mt-1 break-words">{task.notes}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(task.created_at).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{t.addTask}</h2>
              <button
                onClick={() => {
                  setShowAddTask(false)
                  setNewTask({ title: '', notes: '' })
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t.taskTitle}
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
                autoFocus
              />
              
              <textarea
                placeholder={t.taskNotes}
                value={newTask.notes}
                onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all resize-none"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={addTask}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {t.save}
                </button>
                <button
                  onClick={() => {
                    setShowAddTask(false)
                    setNewTask({ title: '', notes: '' })
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{t.editTask}</h2>
              <button
                onClick={() => setEditingTask(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t.taskTitle}
                value={editingTask.title}
                onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
                autoFocus
              />
              
              <textarea
                placeholder={t.taskNotes}
                value={editingTask.notes || ''}
                onChange={(e) => setEditingTask({...editingTask, notes: e.target.value})}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all resize-none"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={updateTask}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {t.save}
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {showAI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{t.aiGenerate}</h2>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t.yourGoal}
                value={aiGoal}
                onChange={(e) => setAiGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                autoFocus
              />
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  💡 {lang === 'en' 
                    ? 'AI will generate 4 personalized tasks to help you achieve your goal!' 
                    : 'AI आपके लक्ष्य को प्राप्त करने में मदद के लिए 4 व्यक्तिगत कार्य उत्पन्न करेगा!'}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={generateAITasks}
                  disabled={aiLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading ? t.generating : t.generate}
                </button>
                <button
                  onClick={() => {
                    setShowAI(false)
                    setAiGoal('')
                  }}
                  disabled={aiLoading}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}