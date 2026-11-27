import styles from './Icon.module.css'
import arrowDown from 'lucide-static/icons/arrow-down.svg?url'
import arrowUpRight from 'lucide-static/icons/arrow-up-right.svg?url'
import bell from 'lucide-static/icons/bell.svg?url'
import bookmarkCheck from 'lucide-static/icons/bookmark-check.svg?url'
import bookmark from 'lucide-static/icons/bookmark.svg?url'
import check from 'lucide-static/icons/check.svg?url'
import chevronDown from 'lucide-static/icons/chevron-down.svg?url'
import grid from 'lucide-static/icons/layout-grid.svg?url'
import plus from 'lucide-static/icons/plus.svg?url'
import reset from 'lucide-static/icons/rotate-ccw.svg?url'
import search from 'lucide-static/icons/search.svg?url'
import volume from 'lucide-static/icons/volume-2.svg?url'

import more from 'lucide-static/icons/ellipsis.svg?url'

import menu from 'lucide-static/icons/menu.svg?url'
import rows from 'lucide-static/icons/rows-3.svg?url'

const icons = {
  menu,
  rows,
  more,
  arrowDown,
  arrowUpRight,
  bell,
  bookmark,
  bookmarkCheck,
  check,
  chevronDown,
  grid,
  plus,
  reset,
  search,
  volume,
}

export default function Icon(props: { name: keyof typeof icons }) {
  return (
    <span
      aria-hidden="true"
      class={styles.icon}
      style={{ 'mask-image': `url("${icons[props.name]}")` }}
    />
  )
}
