import { Shield, Flag, Lock } from 'lucide-react'

export default function LibertyBanner() {
  return (
    <div className="w-full text-gray-600 py-3 md:py-3 sm:py-2 px-4 md:px-4 sm:px-2 liberty-banner safe-area-top safe-area-left safe-area-right" style={{ background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 md:gap-8 sm:gap-4 text-sm md:text-sm sm:text-xs font-medium">
        <div className="flex items-center gap-2 md:gap-2 sm:gap-1">
          <Shield className="w-4 h-4 md:w-4 md:h-4 sm:w-3 sm:h-3 text-red-600" />
          <span>100% Private</span>
        </div>
        
        <div className="hidden sm:block w-px h-4 md:h-4 sm:h-3 bg-gray-300"></div>
        
        <div className="flex items-center gap-2 md:gap-2 sm:gap-1">
          <Lock className="w-4 h-4 md:w-4 md:h-4 sm:w-3 sm:h-3 text-red-600" />
          <span className="hidden xs:inline">Zero Censorship</span>
          <span className="xs:hidden">No Censorship</span>
        </div>
        
        <div className="hidden sm:block w-px h-4 md:h-4 sm:h-3 bg-gray-300"></div>
        
        <div className="flex items-center gap-2 md:gap-2 sm:gap-1">
          <Flag className="w-4 h-4 md:w-4 md:h-4 sm:w-3 sm:h-3 text-red-600" />
          <span>US Hosted</span>
        </div>
        
        <div className="hidden md:block w-px h-4 bg-gray-300"></div>
        
        <div className="hidden md:flex items-center gap-2">
          <span className="text-gray-400 font-normal">America&apos;s AI</span>
        </div>
      </div>
    </div>
  )
}
