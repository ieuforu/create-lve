import { Card } from '@astryxdesign/core/Card'
import { Grid } from '@astryxdesign/core/Grid'
import { Stack } from '@astryxdesign/core/Stack'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { kpis } from '../data/kpis'

export function KpiCards() {
  return (
    <Grid gap={4} columns={{ minWidth: 240, repeat: 'fit' }}>
      {kpis.map((kpi) => (
        <Card key={kpi.label} padding={5}>
          <Stack direction="vertical" gap={2}>
            <Text type="label" color="secondary">
              {kpi.label}
            </Text>
            <Stack direction="horizontal" align="end" gap={2}>
              <Heading level={3}>{kpi.value}</Heading>
              <Text type="supporting" color={kpi.trend === 'up' ? 'accent' : 'secondary'}>
                {kpi.change}
              </Text>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Grid>
  )
}
