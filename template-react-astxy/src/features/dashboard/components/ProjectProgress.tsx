import { Card } from '@astryxdesign/core/Card'
import { Stack } from '@astryxdesign/core/Stack'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { ProgressBar } from '@astryxdesign/core/ProgressBar'
import { projects } from '../../../shared/data/projects'

export function ProjectProgress() {
  return (
    <Card padding={5}>
      <Stack direction="vertical" gap={4}>
        <Heading level={4}>项目进度</Heading>
        <Stack direction="vertical" gap={4}>
          {projects.map((project) => (
            <Stack key={project.name} direction="vertical" gap={2}>
              <Stack direction="horizontal" justify="between">
                <Text>{project.name}</Text>
                <Text type="supporting" color="secondary">
                  {project.progress}%
                </Text>
              </Stack>
              <ProgressBar
                label={project.name}
                value={project.progress}
                max={100}
                variant={project.progress === 100 ? 'success' : 'accent'}
                isLabelHidden
                hasValueLabel
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}
