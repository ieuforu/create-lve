import { Switch } from '#/components/ui/switch'
import { SectionCard, FieldGroup, Field } from './settings-ui'
import { useTheme } from '#/hooks/useTheme'
import { preferencesActions, type Theme } from '#/stores/preferences.store'

const themes: { label: string; value: Theme }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
]

export function AppearanceSection() {
  const theme = useTheme()
  return (
    <div className="space-y-4">
      <SectionCard title="Theme" desc="Customize how the app looks">
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.label}
              type="button"
              aria-pressed={theme === t.value}
              onClick={() => preferencesActions.setTheme(t.value)}
              className={`rounded-xl border p-4 text-center text-[13px] font-medium transition-all ${
                theme === t.value
                  ? 'border-foreground/30 bg-foreground/[0.04] text-foreground'
                  : 'border-border/40 text-muted-foreground hover:border-border/70'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Accent color" desc="Choose your highlight color">
        <div className="flex gap-2.5">
          {[
            'oklch(0.55 0.2 260)',
            'oklch(0.55 0.2 150)',
            'oklch(0.55 0.2 30)',
            'oklch(0.55 0.2 0)',
            'oklch(0.55 0.15 300)',
          ].map((c, i) => (
            <button
              key={c}
              className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                i === 0 ? 'ring-2 ring-offset-2 ring-foreground' : ''
              }`}
              aria-label={`Accent color ${i + 1}`}
              style={{ background: c }}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Sidebar" desc="Customize sidebar behavior">
        <FieldGroup>
          <Field htmlFor="compact-mode" label="Compact mode" hint="Show fewer items in sidebar">
            <div className="flex justify-end">
              <Switch id="compact-mode" aria-describedby="compact-mode-description" />
            </div>
          </Field>
        </FieldGroup>
      </SectionCard>
    </div>
  )
}
