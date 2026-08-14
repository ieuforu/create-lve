import { Section } from '@astryxdesign/core/Section'
import { Stack } from '@astryxdesign/core/Stack'
import { Heading } from '@astryxdesign/core/Heading'
import { Button } from '@astryxdesign/core/Button'
import { Divider } from '@astryxdesign/core/Divider'
import { Grid } from '@astryxdesign/core/Grid'
import { KpiCards } from '../components/KpiCards'
import { OrdersTable } from '../components/OrdersTable'
import { TeamMembers } from '../components/TeamMembers'
import { ProjectProgress } from '../components/ProjectProgress'

export function DashboardPage() {
  return (
    <>
      <Section padding={6}>
        <Stack direction="horizontal" justify="between" align="center" gap={4}>
          <Heading level={2}>仪表盘</Heading>
          <Button label="下载报告" variant="secondary" size="sm" />
        </Stack>
        <KpiCards />
      </Section>

      <Divider />

      <Section padding={6}>
        <OrdersTable />
      </Section>

      <Divider />

      <Section padding={6}>
        <Grid gap={6} columns={{ minWidth: 320, repeat: 'fit' }}>
          <TeamMembers />
          <ProjectProgress />
        </Grid>
      </Section>
    </>
  )
}
