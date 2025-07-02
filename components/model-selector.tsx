'use client'

import { Model } from '@/lib/types/models'
import { getCookie, setCookie } from '@/lib/utils/cookies'
import { Brain, ChevronDown, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface ModelSelectorProps {
  models: Model[]
}

export function ModelSelector({ models }: ModelSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<'normal' | 'reasoning'>('normal')
  const [chatMode, setChatMode] = useState<string>('search')

  useEffect(() => {
    const savedModel = getCookie('selectedModel')
    if (savedModel) {
      try {
        const model = JSON.parse(savedModel) as Model
        const isReasoning = model.mode === 'reasoning' || model.id === 'deepseek-reasoner'
        setSelectedMode(isReasoning ? 'reasoning' : 'normal')
      } catch (e) {
        console.error('Failed to parse saved model:', e)
        setSelectedMode('normal')
      }
    } else {
      const normalModel = models.find(m => m.mode === 'normal' || m.id === 'deepseek-chat')
      if (normalModel) {
        setCookie('selectedModel', JSON.stringify(normalModel))
        setSelectedMode('normal')
      }
    }
  }, [models])

  // Monitor chat mode changes
  useEffect(() => {
    const savedChatMode = getCookie('chat-mode')
    if (savedChatMode) {
      setChatMode(savedChatMode)
    }
  }, [])

  // Listen for chat mode changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentChatMode = getCookie('chat-mode')
      if (currentChatMode !== chatMode) {
        setChatMode(currentChatMode || 'search')
      }
    }, 100)

    return () => clearInterval(interval)
  }, [chatMode])

  const handleModeChange = (newMode: 'normal' | 'reasoning') => {
    setSelectedMode(newMode)

    const selectedModel = models.find(model => 
      newMode === 'reasoning' 
        ? (model.mode === 'reasoning' || model.id === 'deepseek-reasoner')
        : (model.mode === 'normal' || model.id === 'deepseek-chat')
    )

    if (selectedModel) {
      setCookie('selectedModel', JSON.stringify(selectedModel))
    }
  }

  // Hide model selector for image generation mode
  if (chatMode === 'image') {
    return null
  }

  if (selectedMode === 'reasoning') {
    return (
      <Button
        variant="outline"
        onClick={() => handleModeChange('normal')}
        className="text-sm rounded-full shadow-none focus:ring-0 gap-2 backdrop-enhanced border-gray-300 text-gray-700 hover:bg-white/30"
      >
        <Brain size={16} className="text-blue-600" />
        <span className="text-xs font-medium">Reasoning</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="text-sm rounded-full shadow-none focus:ring-0 gap-2 backdrop-enhanced border-gray-300 text-gray-700 hover:bg-white/30"
        >
          <Zap size={16} className="text-green-600" />
          <span className="text-xs font-medium">Normal</span>
          <ChevronDown size={12} className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40 backdrop-enhanced border-gray-300">
        <DropdownMenuItem
          onClick={() => handleModeChange('reasoning')}
          className="flex items-center gap-2 cursor-pointer text-gray-700 hover:bg-white/30"
        >
          <Brain size={16} className="text-blue-600" />
          <span className="text-sm">Reasoning</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
