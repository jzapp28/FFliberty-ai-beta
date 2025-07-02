'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function AppSidebar() {
  return (
    <Sidebar 
      side="left" 
      variant="sidebar" 
      collapsible="offcanvas" 
      className="backdrop-enhanced border-r-0 md:block hidden lg:block"
    >
      <SidebarHeader className="flex flex-row justify-between items-center bg-transparent">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-2 py-3"
          onClick={() => {
            // Clear messages and navigate to home
            window.location.href = '/'
          }}
        >
          <img 
            src="/images/libertystaronlky.png" 
            alt="Liberty Star" 
            className="w-10 h-10"
          />
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="flex flex-col px-2 py-4 h-full bg-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>New</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex-1 overflow-y-auto">
          {/* Chat history is disabled */}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
