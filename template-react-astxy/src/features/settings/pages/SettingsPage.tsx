import { Section } from '@astryxdesign/core/Section'
import { Stack } from '@astryxdesign/core/Stack'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Card } from '@astryxdesign/core/Card'
import { Divider } from '@astryxdesign/core/Divider'

export function SettingsPage() {
  return (
    <Section padding={6}>
      <Heading level={2}>设置</Heading>

      <Stack direction="vertical" gap={6}>
        <Card padding={5}>
          <Stack direction="vertical" gap={3}>
            <Heading level={4}>个人信息</Heading>
            <Divider />
            <Text>在这里管理你的账户信息和偏好设置。</Text>
          </Stack>
        </Card>

        <Card padding={5}>
          <Stack direction="vertical" gap={3}>
            <Heading level={4}>通知设置</Heading>
            <Divider />
            <Text>配置邮件通知、推送通知和消息提醒。</Text>
          </Stack>
        </Card>

        <Card padding={5}>
          <Stack direction="vertical" gap={3}>
            <Heading level={4}>安全设置</Heading>
            <Divider />
            <Text>修改密码、启用两步验证、管理登录设备。</Text>
          </Stack>
        </Card>
      </Stack>
    </Section>
  )
}
