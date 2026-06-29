export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-stone-700">Overview</h2>
        <p className="mt-1 text-xs text-stone-400">
          This is the settings index page — a nested index route.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: 'Profile', desc: 'Name, avatar, bio' },
          { label: 'Account', desc: 'Email, password, delete' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-stone-200 bg-white p-4"
          >
            <p className="text-sm font-medium text-stone-700">{item.label}</p>
            <p className="mt-0.5 text-xs text-stone-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
