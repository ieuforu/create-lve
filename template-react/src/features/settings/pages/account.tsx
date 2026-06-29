import { toast } from 'sonner'

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-stone-700">Account</h2>
        <p className="mt-1 text-xs text-stone-400">
          /settings/account — nested child route, toast works here too
        </p>
      </div>

      <div className="space-y-3">
        {[
          { label: 'Email', value: 'isla@example.com', action: 'Change' },
          { label: 'Password', value: '••••••••', action: 'Reset' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3"
          >
            <div>
              <p className="text-sm text-stone-700">{item.value}</p>
              <p className="text-xs text-stone-400">{item.label}</p>
            </div>
            <button
              onClick={() => toast.info(`${item.label} — coming soon`)}
              className="rounded-md border border-stone-200 px-3 py-1 text-xs text-stone-500 transition-colors hover:border-stone-400 hover:text-stone-700"
            >
              {item.action}
            </button>
          </div>
        ))}
      </div>

      <div className="h-px bg-stone-100" />

      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">Danger zone</p>
        <p className="mt-1 text-xs text-red-400">
          Permanently delete your account and all data.
        </p>
        <button
          onClick={() => toast.error('Just a demo — nothing deleted')}
          className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-red-700"
        >
          Delete account
        </button>
      </div>
    </div>
  )
}
