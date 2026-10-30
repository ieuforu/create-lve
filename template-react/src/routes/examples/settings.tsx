import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '#/features/settings/components/SettingsPage'
import { validateSettingsSearch } from '#/features/settings/search'

export const Route = createFileRoute('/examples/settings')({
  validateSearch: validateSettingsSearch,
  component: SettingsRoute,
})

function SettingsRoute() {
  const { section = 'profile' } = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <SettingsPage
      section={section}
      onSectionChange={(value) => {
        void navigate({ search: value === 'profile' ? {} : { section: value } })
      }}
    />
  )
}
