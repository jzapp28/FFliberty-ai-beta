import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const searchMessages = [
  {
    heading: 'What happened with Coreweave in this past month?',
    message: 'What happened with Coreweave in this past month?'
  },
  {
    heading: 'Recent tech earnings reports',
    message: 'What are the recent tech earnings reports this quarter?'
  },
  {
    heading: 'Current global economic trends',
    message: 'What are the current global economic trends?'
  },
  {
    heading: 'Breaking news in technology',
    message: 'What is the breaking news in technology today?'
  }
]

const generalMessages = [
  {
    heading: 'Explain quantum computing simply',
    message: 'Can you explain quantum computing in simple terms?'
  },
  {
    heading: 'Write a creative story',
    message: 'Write a short creative story about a time traveler'
  },
  {
    heading: 'Help with coding problem',
    message: 'Help me debug this Python function that sorts a list'
  },
  {
    heading: 'Plan a healthy meal',
    message: 'Create a healthy meal plan for the week'
  }
]

const imageMessages = [
  {
    heading: 'Realistic sunset over mountains',
    message: 'realistic sunset over mountains'
  },
  {
    heading: 'Drawing of a cute cat',
    message: 'drawing of a cute cat'
  },
  {
    heading: 'Realistic portrait of a person',
    message: 'realistic portrait of a person'
  },
  {
    heading: 'Sketch of a modern building',
    message: 'sketch of a modern building'
  }
]

const codeMessages = [
  {
    heading: 'Coming Soon',
    message: 'Code generation features are coming soon! Stay tuned for updates.'
  }
]

export function EmptyScreen({
  submitMessage,
  className,
  isSearchMode = false,
  selectedMode = 'search'
}: {
  submitMessage: (message: string) => void
  className?: string
  isSearchMode?: boolean
  selectedMode?: 'search' | 'general' | 'image' | 'code'
}) {
  let exampleMessages = searchMessages
  
  if (selectedMode === 'search') {
    exampleMessages = searchMessages
  } else if (selectedMode === 'general') {
    exampleMessages = generalMessages
  } else if (selectedMode === 'image') {
    exampleMessages = imageMessages
  } else if (selectedMode === 'code') {
    // Return a placeholder with same height to prevent layout shift
    return (
      <div className={`mx-auto w-full transition-all ${className}`}>
        <div className="p-2">
          <div className="mt-2 flex flex-col items-start space-y-2 mb-4" style={{ minHeight: '120px' }}>
            {/* Empty placeholder to maintain layout */}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="p-2">
        <div className="mt-2 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                // @ts-ignore - TypeScript issue with mode comparison
                if (selectedMode === 'code') {
                  // For code mode, just show the coming soon message without submitting
                  return
                }
                submitMessage(message.message)
              }}
              // @ts-ignore - TypeScript issue with mode comparison
              disabled={selectedMode === 'code'}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
