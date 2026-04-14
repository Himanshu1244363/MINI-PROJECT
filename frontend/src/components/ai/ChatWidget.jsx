import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiX, FiSend, FiZap } from 'react-icons/fi'
import { toggleChat } from '../../store/slices/uiSlice'
import api from '../../utils/api'

const QUICK_REPLIES = [
  'Track my order',
  'Return policy',
  'Payment methods',
  'Free shipping?',
]

const BOT_AVATAR = (
  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-orange-400 flex items-center justify-center text-white shrink-0">
    <FiZap size={13} />
  </div>
)

export default function ChatWidget() {
  const dispatch = useDispatch()
  const { chatOpen } = useSelector(s => s.ui)
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: "👋 Hi! I'm **ShopBot**, your AI assistant. How can I help you today?", time: new Date() }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg) return

    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: userMsg, time: new Date() }])
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/ai/chat', { message: userMsg })
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: res.data.message, time: new Date() }])
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: "Sorry, I'm having trouble connecting. Please try again.", time: new Date() }])
    } finally {
      setLoading(false)
    }
  }

  // Simple markdown-like bold render
  const renderText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-glow hover:shadow-glow-lg flex items-center justify-center text-white transition-all hover:scale-110"
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          {chatOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FiX size={22} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <FiMessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!chatOpen && (
          <span className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-30" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-40 w-[340px] max-h-[520px] flex flex-col card shadow-2xl overflow-hidden"
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <FiZap className="text-white" size={16} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">ShopBot AI</p>
                <p className="text-primary-100 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                  Always online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-dark-bg">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.from === 'bot' && BOT_AVATAR}
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                    ${msg.from === 'user'
                      ? 'bg-primary-500 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-dark-card text-gray-800 dark:text-gray-200 shadow-sm rounded-tl-sm'
                    }`}
                  >
                    {renderText(msg.text)}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  {BOT_AVATAR}
                  <div className="bg-white dark:bg-dark-card px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div className="px-3 pt-2.5 pb-1 flex gap-1.5 overflow-x-auto no-scrollbar bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border">
              {QUICK_REPLIES.map(qr => (
                <button key={qr} onClick={() => sendMessage(qr)}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors bg-white dark:bg-dark-card">
                  {qr}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-dark-surface">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="input flex-1 text-sm py-2 h-10"
                />
                <button type="submit" disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shrink-0">
                  <FiSend size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
