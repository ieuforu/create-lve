import { Switch } from '#/components/ui/switch'
import { Label } from '#/components/ui/label'
import { SectionCard } from './settings-ui'

export function NotificationsSection() {
  return (
    <div className="space-y-4">
      <SectionCard title="Email notifications" desc="Choose what you receive via email">
        <div className="space-y-4">
          {[
            { label: 'Product updates', desc: 'News about features and improvements', on: true },
            { label: 'Security alerts', desc: 'Important security notifications', on: true },
            { label: 'Marketing', desc: 'Tips, offers, and promotions', on: false },
            { label: 'Weekly digest', desc: 'Summary of your account activity', on: true },
          ].map((item, index) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <Label htmlFor={`notification-${index}`}>{item.label}</Label>
                <p
                  id={`notification-${index}-description`}
                  className="text-[12px] text-muted-foreground/60"
                >
                  {item.desc}
                </p>
              </div>
              <Switch
                id={`notification-${index}`}
                aria-describedby={`notification-${index}-description`}
                defaultChecked={item.on}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-all hover:opacity-90 active:scale-[0.99]">
          Save preferences
        </button>
      </div>
    </div>
  )
}
