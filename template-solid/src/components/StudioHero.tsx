import styles from './StudioHero.module.css'
import Icon from './Icon'

export default function StudioHero(props: { onExplore: () => void }) {
  return (
    <section aria-labelledby="hero-title" class={styles.hero}>
      <div class={styles.art} aria-hidden="true" />
      <div class={styles.copy}>
        <div class={styles.eyebrow}>
          <span class={styles.dot} />
          Solid 2 × ui-sdk
        </div>
        <h1 lang="en" id="hero-title" class={styles.title}>
          Component
          <br />
          Playground<span>.</span>
        </h1>
        <p class={styles.description}>动手试用界面组件，收藏你的常用交互。</p>
        <a href="#catalog" class={styles.link} onClick={() => props.onExplore()}>
          探索组件
          <Icon name="arrowDown" />
        </a>
      </div>
    </section>
  )
}
