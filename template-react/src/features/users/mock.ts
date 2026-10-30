import type { User } from './types'

// Deterministic PRNG for consistent mock data
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const firstNames = [
  'Emma',
  'Liam',
  'Olivia',
  'Noah',
  'Ava',
  'Elijah',
  'Sophia',
  'James',
  'Isabella',
  'Lucas',
  'Mia',
  'Mason',
  'Charlotte',
  'Ethan',
  'Amelia',
  'Logan',
  'Harper',
  'Alexander',
  'Evelyn',
  'Sebastian',
  'Aria',
  'Jack',
  'Chloe',
  'Aiden',
  'Abigail',
  'Owen',
  'Emily',
  'Samuel',
  'Ella',
  'Ryan',
  'Scarlett',
  'Nathan',
  'Grace',
  'Caleb',
  'Lily',
  'Hunter',
  'Victoria',
  'Henry',
  'Riley',
  'Daniel',
  'Zoey',
  'Matthew',
  'Nora',
  'Wyatt',
  'Layla',
  'Carter',
  'Penelope',
  'Michael',
  'Hannah',
  'David',
]

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
  'Harris',
  'Sanchez',
  'Clark',
  'Ramirez',
  'Lewis',
  'Robinson',
  'Walker',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Torres',
  'Nguyen',
  'Hill',
  'Flores',
  'Green',
  'Adams',
  'Nelson',
  'Baker',
  'Hall',
  'Rivera',
  'Campbell',
  'Mitchell',
]

const departments = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Product',
  'Operations',
  'Finance',
  'Legal',
  'HR',
  'Data Science',
]

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Seattle, WA',
  'London, UK',
  'Berlin, DE',
  'Tokyo, JP',
  'Toronto, CA',
  'Sydney, AU',
  'Singapore, SG',
  'Paris, FR',
  'Seoul, KR',
]

const bios = [
  'Passionate about building products that make a difference.',
  'Coffee enthusiast and full-stack developer.',
  'Designing the future, one pixel at a time.',
  'Data-driven decision maker with a creative edge.',
  'Remote work advocate and async communication fan.',
  'Turning complex problems into simple solutions.',
  'Building bridges between engineering and design.',
  'Always learning, always shipping.',
]

const roles: User['role'][] = ['admin', 'editor', 'viewer']
const statuses: User['status'][] = ['active', 'inactive', 'suspended']

const roleWeights = [0.08, 0.32, 0.6]
const statusWeights = [0.75, 0.18, 0.07]

function pick<T>(items: readonly T[], rand: () => number): T {
  const item = items[Math.floor(rand() * items.length)]
  if (item === undefined) throw new Error('Cannot pick from an empty fixture')
  return item
}

function weightedPick<T>(items: readonly T[], weights: readonly number[], rand: () => number): T {
  const r = rand()
  let sum = 0
  for (const [index, item] of items.entries()) {
    sum += weights[index] ?? 0
    if (r < sum) return item
  }
  const last = items.at(-1)
  if (last === undefined) throw new Error('Cannot pick from an empty fixture')
  return last
}

function userProfile(id: number, rand: () => number) {
  const firstName = pick(firstNames, rand)
  const lastName = pick(lastNames, rand)
  return {
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@example.com`,
    department: pick(departments, rand),
  }
}

const referenceTime = Date.now()
const TOTAL = 100_000

// Generate only requested rows. Per-ID seeds keep list and detail data consistent.
function generateUser(id: number): User {
  const rand = mulberry32(id)
  const profile = userProfile(id, rand)
  const threeYears = 3 * 365 * 24 * 60 * 60 * 1000
  const joinTimestamp = referenceTime - Math.floor(rand() * threeYears)
  const lastActiveTimestamp = joinTimestamp + Math.floor(rand() * (referenceTime - joinTimestamp))

  return {
    id,
    ...profile,
    role: weightedPick(roles, roleWeights, rand),
    status: weightedPick(statuses, statusWeights, rand),
    avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${id}`,
    joinDate: new Date(joinTimestamp).toISOString().slice(0, 10),
    lastActive: new Date(lastActiveTimestamp).toISOString().slice(0, 10),
    location: pick(locations, rand),
    bio: pick(bios, rand),
  }
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  signal?.throwIfAborted()
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer)
      reject(signal?.reason)
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve()
    }, ms)
    signal?.addEventListener('abort', abort, { once: true })
  })
}

// Build a lightweight text index only when searching, yielding so typing stays responsive.
const searchIndex: string[] = []
async function matchingIds(search: string, signal?: AbortSignal) {
  const query = search.trim().toLowerCase()
  if (!query) return undefined
  const matches: number[] = []
  for (let index = 0; index < TOTAL; index++) {
    if (index % 2_000 === 0) await delay(0, signal)
    let text = searchIndex[index]
    if (text === undefined) {
      const profile = userProfile(index + 1, mulberry32(index + 1))
      text = `${profile.name} ${profile.email} ${profile.department}`.toLowerCase()
      searchIndex[index] = text
    }
    if (text.includes(query)) matches.push(index + 1)
  }
  return matches
}

export async function fetchUsers({
  page = 1,
  pageSize = 50,
  search = '',
  signal,
}: {
  page?: number
  pageSize?: number
  search?: string
  signal?: AbortSignal
}) {
  await delay(200, signal)
  const ids = await matchingIds(search, signal)
  signal?.throwIfAborted()
  const total = ids?.length ?? TOTAL
  const start = (page - 1) * pageSize
  const pageIds = ids
    ? ids.slice(start, start + pageSize)
    : Array.from(
        { length: Math.max(0, Math.min(pageSize, total - start)) },
        (_, index) => start + index + 1,
      )
  return {
    data: pageIds.map(generateUser),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function fetchUserById(id: number, signal?: AbortSignal) {
  await delay(150, signal)
  if (!Number.isSafeInteger(id) || id < 1 || id > TOTAL) throw new Error(`User ${id} not found`)
  return generateUser(id)
}
