import { Card } from '@astryxdesign/core/Card'
import { Stack } from '@astryxdesign/core/Stack'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Avatar } from '@astryxdesign/core/Avatar'
import { StatusDot } from '@astryxdesign/core/StatusDot'
import { team } from '../../../shared/data/team'

const statusVariant = {
  online: 'success' as const,
  away: 'warning' as const,
  offline: 'neutral' as const,
}

export function TeamMembers() {
  return (
    <Card padding={5}>
      <Stack direction="vertical" gap={4}>
        <Heading level={4}>团队成员</Heading>
        <Stack direction="vertical" gap={3}>
          {team.map((member) => (
            <Stack key={member.name} direction="horizontal" align="center" gap={3}>
              <Avatar name={member.name} size="sm" />
              <Stack direction="vertical" gap={0}>
                <Text>{member.name}</Text>
                <Text type="supporting" color="secondary">
                  {member.role}
                </Text>
              </Stack>
              <StatusDot
                variant={statusVariant[member.status]}
                label={`${member.name} is ${member.status}`}
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}
