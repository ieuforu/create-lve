import { useState } from 'react'
import { ArrowRight, Folder } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useModal } from '#/stores/modal.store'

export function ProjectPlayground() {
  const [name, setName] = useState('a little idea')
  const [project, setProject] = useState('a little idea')
  const [confirmed, setConfirmed] = useState(false)
  const { open } = useModal()

  return (
    <section className="lve-playground" aria-label="Interactive project example">
      <div className="lve-playground-caption">
        <p className="lve-section-index" aria-hidden="true">
          <span>02</span>
          <span className="lve-index-rule" />
        </p>
        <h2>CREATE YOUR PROJECT</h2>
      </div>
      <form
        className="lve-project-form"
        onSubmit={(event) => {
          event.preventDefault()
          const nextProject = name.trim()
          if (!nextProject) return
          setProject(nextProject)
          setConfirmed(false)
        }}
      >
        <Label htmlFor="project-name">Project name</Label>
        <div className="lve-project-input-row">
          <Input
            id="project-name"
            name="projectName"
            maxLength={40}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Button type="submit" disabled={!name.trim()}>
            Create
          </Button>
          <ArrowRight className="lve-project-arrow" aria-hidden="true" />
        </div>
        <p className="lve-project-hint">Click the project to try the dialog.</p>
      </form>
      <Button
        variant="ghost"
        className="lve-project-result"
        aria-label={`Open ${project} project preview`}
        onClick={() =>
          open('confirm', {
            title: `Start ${project}?`,
            description: 'A small example of the global dialog. No files will be created.',
            confirmLabel: 'Confirm',
            onConfirm: () => setConfirmed(true),
          })
        }
      >
        <Folder className="lve-project-folder" strokeWidth={1} aria-hidden="true" />
        <span className="lve-project-details">
          <span className="lve-project-title">{project}</span>
          <span className="lve-project-status" role="status" aria-live="polite" aria-atomic="true">
            {confirmed ? 'Example confirmed.' : 'Ready to begin'}
          </span>
        </span>
      </Button>
    </section>
  )
}
