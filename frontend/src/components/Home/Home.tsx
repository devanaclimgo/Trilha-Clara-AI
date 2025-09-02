'use client'

import { useState } from 'react'
import ProfileScreen from './HomeProfileScreen'
import SupportScreen from './HomeSupportScreen'
import NotesScreen from './HomeNotesScreen'
import TimelineScreen from './HomeTimelineScreen'
import HomeSettingsScreen from './HomeSettingsScreen'
import DashboardStartScreen from '../Dashboard/DashboardStartScreen'

export default function TrilhaClara() {
  const [activeScreen ] = useState<string>('dashboard')

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
        return <DashboardStartScreen />
    }
  }

  return (
    <div>
      {renderScreen()}
    </div>
  )
}
