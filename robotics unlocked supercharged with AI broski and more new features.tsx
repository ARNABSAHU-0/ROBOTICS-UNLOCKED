import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
}

export function Chatbot() {
  const ask = useAction(api.chat.askRobotics);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const onAsk = async () => {
    const q = question.trim();
    if (!q) return;
    
    setLoading(true);
    const currentQuestion = q;
    setQuestion(""); // Clear input immediately
    
    try {
      const resp = await ask({ question: currentQuestion });
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        question: currentQuestion,
        answer: resp ?? "Sorry, something went wrong.",
        timestamp: Date.now(),
      };
      setChatHistory(prev => [...prev, newMessage]);
    } catch (e) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        question: currentQuestion,
        answer: "Sorry, something went wrong.",
        timestamp: Date.now(),
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setQuestion("");
  };

  const handleClearChat = () => {
    setChatHistory([]);
    setQuestion("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAsk();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {!isOpen && (
        <div className="relative">
          {/* Pulse animation for attention */}
          <div className="absolute inset-0 bg-indigo-600 rounded-full animate-ping opacity-20"></div>
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl flex items-center space-x-2 group"
            title="Ask Robotics Tutor - Get help with robotics concepts"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="hidden sm:inline font-medium">Ask Robotics Tutor</span>
            <span className="sm:hidden font-medium">Ask AI</span>
            {/* Notification badge for new features */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </button>
        </div>
      )}
      
      {isOpen && (
        <div className={`w-80 sm:w-96 max-w-[95vw] bg-white rounded-lg shadow-xl border transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[500px] sm:h-[600px]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Robotics Tutor</h3>
                <p className="text-xs text-gray-500">AI-powered help</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {!isMinimized && chatHistory.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1 rounded-md hover:bg-gray-200 transition-colors"
                  title="Clear chat history"
                >
                  Clear
                </button>
              )}
              {!isMinimized && (
                <button
                  onClick={handleMinimize}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors"
                  title="Minimize chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              )}
              {isMinimized && (
                <button
                  onClick={() => setIsMinimized(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors"
                  title="Expand chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors"
                title="Close chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-4rem)]">
              {/* Chat History - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Welcome to Robotics Tutor!</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      I can help you with sensors, motors, Arduino, PID control, and more robotics concepts.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">Sensors</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Motors</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Arduino</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">PID Control</span>
                    </div>
                  </div>
                )}
                
                {chatHistory.map((message) => (
                  <div key={message.id} className="space-y-2">
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="bg-indigo-100 text-indigo-800 rounded-lg p-3 max-w-[80%] text-sm">
                        {message.question}
                      </div>
                    </div>
                    
                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%] text-sm whitespace-pre-wrap">
                        {message.answer}
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%] text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area - Fixed at bottom */}
              <div className="border-t p-4 bg-gradient-to-r from-gray-50 to-indigo-50">
                <div className="space-y-3">
                  <div className="relative">
                    <textarea
                      className="w-full h-20 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm transition-colors"
                      placeholder="Ask anything about sensors, motors, control, Arduino, PID, etc."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                    />
                    {loading && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Press Enter to send, Shift+Enter for new line
                    </span>
                    <button
                      onClick={onAsk}
                      disabled={loading || !question.trim()}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          <span>Send</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


