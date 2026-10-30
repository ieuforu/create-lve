export type SettingsSection = 'profile' | 'appearance' | 'notifications' | 'security'

export interface SettingsSearch {
  section?: SettingsSection
}

export function validateSettingsSearch(search: Record<string, unknown>): SettingsSearch {
  const section = search.section
  return section === 'appearance' || section === 'notifications' || section === 'security'
    ? { section }
    : {}
}
