export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-stone-700">Profile</h2>
        <p className="mt-1 text-xs text-stone-400">
          /settings/profile — nested child route
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-stone-200 text-sm font-medium text-stone-500">
            IS
          </div>
          <div>
            <p className="text-sm font-medium text-stone-700">Isla</p>
            <p className="text-xs text-stone-400">isla@example.com</p>
          </div>
        </div>

        <div className="h-px bg-stone-100" />

        <div className="grid gap-3">
          {[
            { label: 'Display name', value: 'Isla' },
            { label: 'Bio', value: 'No bio yet' },
            { label: 'Location', value: '—' },
          ].map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3"
            >
              <span className="text-xs text-stone-400">{field.label}</span>
              <span className="text-sm text-stone-600">{field.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
