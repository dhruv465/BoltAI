import { useState, useEffect } from 'react';
import { Plus, Trash2, Send, Loader2, Menu, History, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { generateResponse } from '../../lib/gemini';
import { DeleteConfirmDialog } from '../../components/DeleteConfirmDialog';

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-3 md:p-4 ${
          isUser
            ? 'bg-blue-600 text-white'
            : isError
            ? 'bg-red-600/20 text-red-200'
            : 'bg-gray-700/80 text-white'
        }`}
      >
        <ReactMarkdown className="prose prose-invert prose-sm break-words">
          {message.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}

function AutoResizingInput({ value, onChange, maxLength = 40, ...props }) {
  const measureWidth = (text) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '16px sans-serif'; // Match your input's font
    return context.measureText(text).width + 32; // Add padding
  };

  const width = value ? Math.min(Math.max(100, measureWidth(value)), 300) : 100;

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      style={{ width: `${width}px` }}
      maxLength={maxLength}
      {...props}
    />
  );
}

function Chat({ script, chatHistory, setChatHistory }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update last accessed timestamp whenever chat is opened or message is sent
  useEffect(() => {
    script.lastAccessed = Date.now();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setChatHistory(script.id, prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    script.lastAccessed = Date.now();

    try {
      const response = await generateResponse(userMessage);
      setChatHistory(script.id, prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setChatHistory(script.id, prev => [...prev, { 
        role: 'error', 
        content: 'Sorry, there was an error generating the response.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-[calc(100vh-12rem)] md:h-[600px] bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50"
    >
      <div className="p-3 md:p-4 border-b border-gray-700/50">
        <h2 className="text-lg font-semibold truncate">{script.name}</h2>
        <div className="text-xs text-gray-400 flex items-center mt-1">
          <Clock className="w-3 h-3 mr-1" />
          Last active: {new Date(script.lastAccessed).toLocaleString()}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        <AnimatePresence mode="popLayout">
          {chatHistory.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-700/80 rounded-2xl p-3 md:p-4">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </motion.div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 md:p-4 border-t border-gray-700/50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700/50 rounded-xl px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-600/50 text-sm md:text-base"
          />
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl disabled:opacity-50 transition-all"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

function ScriptsList() {
  const [scripts, setScripts] = useState([
    { 
      id: '1', 
      name: 'Customer Support',
      lastAccessed: Date.now() 
    },
    { 
      id: '2', 
      name: 'Product Expert',
      lastAccessed: Date.now() - 3600000 
    },
  ]);
  const [activeScript, setActiveScript] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, script: null });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState('all'); // 'all' or 'recent'

  const addScript = () => {
    const newScript = {
      id: Date.now().toString(),
      name: 'New Script',
      lastAccessed: Date.now(),
    };
    setScripts([...scripts, newScript]);
    setChatHistories(prev => ({ ...prev, [newScript.id]: [] }));
    setActiveScript(newScript);
    setIsSidebarOpen(false);
  };

  const deleteScript = (script) => {
    setDeleteDialog({ open: true, script });
  };

  const handleDeleteConfirm = () => {
    const id = deleteDialog.script.id;
    setScripts(scripts.filter(script => script.id !== id));
    if (activeScript?.id === id) {
      setActiveScript(null);
    }
    setChatHistories(prev => {
      const newHistories = { ...prev };
      delete newHistories[id];
      return newHistories;
    });
    setDeleteDialog({ open: false, script: null });
  };

  const setChatHistory = (scriptId, updater) => {
    setChatHistories(prev => ({
      ...prev,
      [scriptId]: updater(prev[scriptId] || [])
    }));
  };

  // Get recent scripts (accessed in the last 24 hours)
  const recentScripts = scripts
    .filter(script => Date.now() - script.lastAccessed < 24 * 60 * 60 * 1000)
    .sort((a, b) => b.lastAccessed - a.lastAccessed);

  const displayedScripts = view === 'recent' ? recentScripts : scripts;

  const Sidebar = () => (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-6">
        <motion.button
          onClick={() => setView('all')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-2 px-4 rounded-xl transition-all ${
            view === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700/50 text-gray-300'
          }`}
        >
          All Scripts
        </motion.button>
        <motion.button
          onClick={() => setView('recent')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-2 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 ${
            view === 'recent' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700/50 text-gray-300'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Recent</span>
        </motion.button>
      </div>

      <AnimatePresence mode="popLayout">
        {displayedScripts.map(script => (
          <motion.div
            key={script.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-gray-800/50 rounded-xl p-3 md:p-4 backdrop-blur-sm cursor-pointer transition-all border border-gray-700/50 ${
              activeScript?.id === script.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              setActiveScript(script);
              setIsSidebarOpen(false);
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <AutoResizingInput
                  value={script.name}
                  onChange={(e) => {
                    const updated = scripts.map(s =>
                      s.id === script.id ? { ...s, name: e.target.value } : s
                    );
                    setScripts(updated);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-transparent font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1 transition-all"
                />
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteScript(script);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all"
                  title="Delete script"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
              
              {chatHistories[script.id]?.length > 0 && (
                <div className="text-xs text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(script.lastAccessed).toLocaleString()}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="relative">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Scripts</h1>
        <div className="flex space-x-2">
          <motion.button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-700 p-2 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={addScript}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl flex items-center space-x-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Script</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Sidebar for larger screens */}
        <div className="hidden md:block md:col-span-4 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Scripts</h1>
            <motion.button
              onClick={addScript}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>New Script</span>
            </motion.button>
          </div>
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="fixed inset-0 z-50 md:hidden"
            >
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-gray-900 p-4 overflow-y-auto">
                <Sidebar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            {activeScript ? (
              <Chat 
                key={activeScript.id}
                script={activeScript} 
                chatHistory={chatHistories[activeScript.id] || []}
                setChatHistory={setChatHistory}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[calc(100vh-12rem)] md:h-[600px] bg-gray-800/50 rounded-xl backdrop-blur-sm flex items-center justify-center text-gray-400 border border-gray-700/50"
              >
                <span className="text-center px-4">
                  {isSidebarOpen ? 'Select a script to start chatting' : 'Select a script from the menu to start chatting'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, script: null })}
        onConfirm={handleDeleteConfirm}
        scriptName={deleteDialog.script?.name}
      />
    </div>
  );
}

export function Scripts() {
  return <ScriptsList />;
}