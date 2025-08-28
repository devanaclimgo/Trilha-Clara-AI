'use client'

import { useState } from 'react'
import {
  BookOpen,
  FileText,
  Settings,
  User,
  HelpCircle,
  Calendar,
  Target,
} from 'lucide-react'
import ProfileScreen from './HomeProfileScreen'
import SupportScreen from './HomeSupportScreen'
import NotesScreen from './HomeNotesScreen'
import TimelineScreen from './HomeTimelineScreen'
import { Badge } from '@/components/ui/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import HomeSettingsScreen from './HomeSettingsScreen'
import ThemeToggle from './HomeThemeToggle'
import DashboardScreen from '../Dashboard/DashboardScreen'

const menuItems = [
  {
    title: 'Anotações',
    icon: FileText,
    id: 'notes',
  },
  {
    title: 'Cronograma',
    icon: Calendar,
    id: 'timeline',
  },
  {
    title: 'Configurações',
    icon: Settings,
    id: 'settings',
  },
  {
    title: 'Perfil',
    icon: User,
    id: 'profile',
  },
  {
    title: 'Suporte',
    icon: HelpCircle,
    id: 'support',
  },
]

export default function TrilhaClara() {
  const [activeScreen, setActiveScreen] = useState<string>('dashboard')

  const renderScreen = () => {
    switch (activeScreen) {
      case 'profile':
        return <ProfileScreen />
      case 'support':
        return <SupportScreen />
      case 'notes':
        return <NotesScreen />
      case 'timeline':
        return <TimelineScreen />
      case 'settings':
        return <HomeSettingsScreen />
      default:
        return <DashboardScreen />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-2xl gradient-bg">
                <BookOpen className="size-4 text-white" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold gradient-text">
                  Trilha Clara
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Guia Acadêmico
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveScreen('dashboard')}
                      isActive={activeScreen === 'dashboard'}
                    >
                      <Target className="size-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveScreen(item.id)}
                        isActive={activeScreen === item.id}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <Badge variant="secondary" className="text-xs">
                v1.0
              </Badge>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>

          <main className="flex-1 overflow-auto p-6">{renderScreen()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
