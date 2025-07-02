'use client'

import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils'
import { getCookie, setCookie } from '@/lib/utils/cookies'
import { Message } from 'ai'
import { ArrowUp, ChevronDown, MessageCirclePlus, Square, Globe, MessageCircle, Image, Code, Paperclip } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { useArtifact } from './artifact/artifact-context'
import { EmptyScreen } from './empty-screen'
import { ModelSelector } from './model-selector'
import { Button } from './ui/button'
import { IconLogo } from './ui/icons'
import { toast } from 'sonner'

interface ChatPanelProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  messages: Message[]
  setMessages: (messages: Message[]) => void
  query?: string
  stop: () => void
  append: (message: any) => void
  models?: Model[]
  /** Whether to show the scroll to bottom button */
  showScrollToBottomButton: boolean
  /** Reference to the scroll container */
  scrollContainerRef: React.RefObject<HTMLDivElement>
}

export function ChatPanel({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  messages,
  setMessages,
  query,
  stop,
  append,
  models,
  showScrollToBottomButton,
  scrollContainerRef
}: ChatPanelProps) {
  const [showEmptyScreen, setShowEmptyScreen] = useState(false)
  const [selectedMode, setSelectedMode] = useState<'search' | 'general' | 'image' | 'code'>('search')
  const [attachedFiles, setAttachedFiles] = useState<Array<{
    file: File
    content: string
    type: string
    name: string
  }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load selected mode from cookie on mount
  useEffect(() => {
    const savedMode = getCookie('chat-mode')
    if (savedMode && ['search', 'general', 'image', 'code'].includes(savedMode)) {
      setSelectedMode(savedMode as 'search' | 'general' | 'image' | 'code')
    }
  }, [])

  // Save selected mode to cookie when it changes
  useEffect(() => {
    setCookie('chat-mode', selectedMode)
  }, [selectedMode])
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isFirstRender = useRef(true)
  const [isComposing, setIsComposing] = useState(false) // Composition state
  const [enterDisabled, setEnterDisabled] = useState(false) // Disable Enter after composition ends
  const { close: closeArtifact } = useArtifact()

  const handleCompositionStart = () => setIsComposing(true)

  const handleCompositionEnd = () => {
    setIsComposing(false)
    setEnterDisabled(true)
    setTimeout(() => {
      setEnterDisabled(false)
    }, 300)
  }

  const handleNewChat = () => {
    setMessages([])
    closeArtifact()
    router.push('/')
  }

  const isToolInvocationInProgress = () => {
    if (!messages.length) return false

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'assistant' || !lastMessage.parts) return false

    const parts = lastMessage.parts
    const lastPart = parts[parts.length - 1]

    return (
      lastPart?.type === 'tool-invocation' &&
      lastPart?.toolInvocation?.state === 'call'
    )
  }

  // File attachment handlers
  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          resolve(result)
        } else {
          reject(new Error('Failed to read file as text'))
        }
      }
      
      reader.onerror = () => reject(new Error('Error reading file'))
      
      // For images, read as data URL; for text files, read as text
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Read content for each file
    const filesWithContent = await Promise.all(
      files.map(async (file) => {
        try {
          const content = await readFileContent(file)
          return {
            file,
            content,
            type: file.type,
            name: file.name
          }
        } catch (error) {
          console.error('Error reading file:', error)
          return {
            file,
            content: '',
            type: file.type,
            name: file.name
          }
        }
      })
    )
    
    setAttachedFiles(prev => [...prev, ...filesWithContent])
  }

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Custom submit handler to include file content
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!input.trim() && attachedFiles.length === 0) return
    
    // Prevent submission in code mode
    if (selectedMode === 'code') {
      return
    }
    
    let messageContent = input.trim()
    
    // Add file content to the message if there are attachments
    if (attachedFiles.length > 0 && selectedMode === 'general') {
      const fileContents = attachedFiles.map(fileData => {
        if (fileData.type.startsWith('image/')) {
          return `[Image: ${fileData.name}]\n${fileData.content}`
        } else {
          return `[File: ${fileData.name}]\n${fileData.content}`
        }
      }).join('\n\n')
      
      messageContent = messageContent ? `${messageContent}\n\n${fileContents}` : fileContents
    }
    
    // Submit the message with file content
    append({
      role: 'user',
      content: messageContent
    })
    
    // Clear attachments after sending
    setAttachedFiles([])
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // if query is not empty, submit the query
  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      append({
        role: 'user',
        content: query
      })
      isFirstRender.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Scroll to the bottom of the container
  const handleScrollToBottom = () => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div
      className={cn(
        'w-full group/form-container shrink-0 relative safe-area-bottom',
        messages.length > 0 ? 'md:sticky md:bottom-0 px-2 pb-4 md:px-2 md:pb-4' : 'px-6 md:px-6',
        'chat-panel'
      )}
    >
      {messages.length === 0 && (
        <div className="mb-6 flex flex-col items-center gap-4 animate-on-load animate-logo-glow delay-200">
          <img 
            src="/images/logo-light.png" 
            alt="Liberty" 
            className="h-[4.5rem] md:h-[4.5rem] sm:h-[3.5rem] w-auto object-contain mt-10 md:mt-10 sm:mt-6 logo-mobile"
          />
        </div>
      )}
      <form
        onSubmit={handleFormSubmit}
        className={cn('max-w-3xl w-full mx-auto relative')}
      >
        {/* Scroll to bottom button - only shown when showScrollToBottomButton is true */}
        {showScrollToBottomButton && messages.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute -top-10 right-4 z-20 size-8 rounded-full shadow-md"
            onClick={handleScrollToBottom}
            title="Scroll to bottom"
          >
            <ChevronDown size={16} />
          </Button>
        )}

        <div className="relative flex flex-col w-full gap-2 backdrop-enhanced rounded-3xl border border-gray-300 animate-on-load animate-fade-in-up delay-600">
          {/* Main input row with model selector, input, and enter button */}
          <div className="flex items-center p-6 md:p-6 sm:p-4 gap-3 md:gap-3 sm:gap-2 min-h-[80px] md:min-h-[80px] sm:min-h-[70px] chat-input-container">
            {/* Left side - Model selector (Normal/Reasoning dropdown) */}
            <div className="animate-on-load animate-slide-in-left delay-800 mobile-hidden">
              <ModelSelector models={models || []} />
            </div>
            
            {/* Center - Main search input */}
            <div className="flex-1 animate-on-load animate-fade-in-up delay-700">
              <Textarea
                ref={inputRef}
                name="input"
                rows={3}
                maxRows={6}
                tabIndex={0}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="Ask a question..."
                spellCheck={false}
                value={input}
                disabled={isLoading || isToolInvocationInProgress()}
                className="w-full resize-none bg-transparent border-0 text-sm md:text-sm sm:text-base placeholder:text-gray-600 text-gray-800 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 py-2 md:py-2 sm:py-3 input-focus-visible"
                onChange={e => {
                  handleInputChange(e)
                  setShowEmptyScreen(e.target.value.length === 0)
                }}
                onKeyDown={e => {
                  if (
                    e.key === 'Enter' &&
                    !e.shiftKey &&
                    !isComposing &&
                    !enterDisabled
                  ) {
                    if (input.trim().length === 0) {
                      e.preventDefault()
                      return
                    }
                    // Prevent submission in code mode
                    if (selectedMode === 'code') {
                      e.preventDefault()
                      return
                    }
                    e.preventDefault()
                    const textarea = e.target as HTMLTextAreaElement
                    textarea.form?.requestSubmit()
                  }
                }}
                onFocus={() => setShowEmptyScreen(true)}
                onBlur={() => setShowEmptyScreen(false)}
              />
            </div>
            
            {/* Attachment button - only show in general mode */}
            {selectedMode === 'general' && (
              <div className="animate-on-load animate-slide-in-right delay-850">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="shrink-0 rounded-full backdrop-enhanced border-gray-300 text-gray-700 hover:bg-white/30 touch-target"
                  onClick={handleFileSelect}
                  disabled={isLoading || isToolInvocationInProgress()}
                >
                  <Paperclip size={20} />
                </Button>
              </div>
            )}
            
            {/* Right side - Enter/Submit button */}
            <div className="animate-on-load animate-slide-in-right delay-900">
              <Button
                type={isLoading ? 'button' : 'submit'}
                size="icon"
                variant="outline"
                className={cn(
                  isLoading && 'animate-pulse',
                  'shrink-0 rounded-full backdrop-enhanced border-gray-300 text-gray-700 hover:bg-white/30 touch-target'
                )}
                disabled={
                  (input.length === 0 && !isLoading) ||
                  isToolInvocationInProgress() ||
                  selectedMode === 'code'
                }
                onClick={isLoading ? stop : undefined}
              >
                {isLoading ? <Square size={20} /> : <ArrowUp size={20} />}
              </Button>
            </div>
            
            {/* New Chat button if there are messages */}
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleNewChat}
                className="shrink-0 rounded-full group touch-target"
                type="button"
                disabled={isLoading || isToolInvocationInProgress()}
              >
                <MessageCirclePlus className="size-4 group-hover:rotate-12 transition-all" />
              </Button>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Attached files display */}
        {attachedFiles.length > 0 && selectedMode === 'general' && (
          <div className="mt-2 p-3 backdrop-enhanced rounded-2xl border border-gray-300">
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2 text-sm"
                >
                  <Paperclip size={14} />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons below the input */}
        <div className="flex gap-2 md:gap-2 sm:gap-1 justify-center flex-wrap mt-4 md:mt-4 sm:mt-3 mode-buttons">
          <div className="animate-on-load animate-scale-in delay-1000">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'rounded-full px-4 py-2 md:px-4 md:py-2 sm:px-3 sm:py-2 text-sm md:text-sm sm:text-xs font-medium gap-2 border transition-all duration-200 touch-target mode-button',
                selectedMode === 'search' 
                  ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-lg' 
                  : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white hover:border-gray-300'
              )}
              type="button"
              disabled={isLoading || isToolInvocationInProgress()}
              onClick={() => {
                setSelectedMode('search')
                setCookie('search-mode', 'true') // Enable search mode
                setCookie('chat-mode', 'search') // Set chat mode
                if (input.length === 0) {
                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }
              }}
            >
              <Globe size={16} />
              <span className="mode-button-text">Search</span>
            </Button>
          </div>
          
          <div className="animate-on-load animate-scale-in delay-1200">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'rounded-full px-4 py-2 md:px-4 md:py-2 sm:px-3 sm:py-2 text-sm md:text-sm sm:text-xs font-medium gap-2 border transition-all duration-200 touch-target mode-button',
                selectedMode === 'general' 
                  ? 'bg-green-100 text-green-800 border-green-300 shadow-lg' 
                  : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white hover:border-gray-300'
              )}
              type="button"
              disabled={isLoading || isToolInvocationInProgress()}
              onClick={() => {
                setSelectedMode('general')
                setCookie('search-mode', 'false') // Disable search mode
                setCookie('chat-mode', 'general') // Set chat mode
                if (input.length === 0) {
                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }
              }}
            >
              <MessageCircle size={16} />
              <span className="mode-button-text">General</span>
            </Button>
          </div>
          
          <div className="animate-on-load animate-scale-in delay-1400">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'rounded-full px-4 py-2 md:px-4 md:py-2 sm:px-3 sm:py-2 text-sm md:text-sm sm:text-xs font-medium gap-2 border transition-all duration-200 touch-target mode-button',
                selectedMode === 'image' 
                  ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-lg' 
                  : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white hover:border-gray-300'
              )}
              type="button"
              disabled={isLoading || isToolInvocationInProgress()}
              onClick={() => {
                setSelectedMode('image')
                setCookie('search-mode', 'false') // Disable search mode for image generation
                setCookie('chat-mode', 'image') // Set chat mode
                if (input.length === 0) {
                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }
              }}
            >
              <Image size={16} />
              <span className="mode-button-text">Image Gen</span>
            </Button>
          </div>
          
          <div className="animate-on-load animate-scale-in delay-1600">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'rounded-full px-4 py-2 md:px-4 md:py-2 sm:px-3 sm:py-2 text-sm md:text-sm sm:text-xs font-medium gap-2 border transition-all duration-200 touch-target mode-button',
                selectedMode === 'code' 
                  ? 'bg-orange-100 text-orange-800 border-orange-300 shadow-lg' 
                  : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white hover:border-gray-300'
              )}
              type="button"
              disabled={isLoading || isToolInvocationInProgress()}
              onClick={() => {
                setSelectedMode('code')
                setCookie('search-mode', 'false') // Disable search mode for code generation
                setCookie('chat-mode', 'code') // Set chat mode
                toast('Coming Soon', {
                  description: 'Code generation features are coming soon!',
                  duration: 3000,
                })
              }}
            >
              <Code size={16} />
              <span className="mode-button-text">Code</span>
            </Button>
          </div>
        </div>

        {messages.length === 0 && (
          <EmptyScreen
            submitMessage={message => {
              handleInputChange({
                target: { value: message }
              } as React.ChangeEvent<HTMLTextAreaElement>)
            }}
            className={cn(showEmptyScreen ? 'visible' : 'invisible')}
            isSearchMode={selectedMode === 'search'}
            selectedMode={selectedMode}
          />
        )}
      </form>
    </div>
  )
}
