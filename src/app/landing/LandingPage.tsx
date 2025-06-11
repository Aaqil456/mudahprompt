'use client'

import styles from './landing-page.module.css'

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Grid background */}
      <div className={styles.landingBg} />

      <main className={styles.mainContent}>
        {/* Top Section */}
        <section className={styles.topSection}>
          <div className={styles.explanationBox}>
          <h2 className={styles.heroTitle}>EXPLORE THE POWER OF PROMPTING</h2>
          <div className={styles.neonText}>PROMPTING<br />AGENT</div>
            <div className={styles.heroDesc}>
              <p>
                Prompting is the art of crafting instructions that guide AI models to generate desired outputs. It's like having a conversation with an AI, where your words shape the response.
              </p>
              <p>
                Our platform helps you master this art by providing:
          </p>
              <ul className={styles.featureList}>
                <li>Pre-built templates for common AI tasks</li>
                <li>Customizable prompt structures</li>
                <li>Real-time optimization suggestions</li>
                <li>Best practices for effective prompting</li>
              </ul>
            </div>
          </div>

          {/* Right: Robot Card */}
        <section className={styles.robotCard}>
          {/* AI Badge */}
          <div className={styles.aiBadge}>AI</div>
            
          {/* YouTube Video */}
          <iframe
            className={styles.robotImg}
            src="https://www.youtube.com/embed/aAVeOwPbqYw"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
            
            {/* Card corners */}
          <div className={styles.cardCorners}>
            <div className={`${styles.corner} ${styles.tl}`}></div>
            <div className={`${styles.corner} ${styles.tr}`}></div>
            <div className={`${styles.corner} ${styles.bl}`}></div>
            <div className={`${styles.corner} ${styles.br}`}></div>
          </div>
          </section>
        </section>
      </main>
    </div>
  )
} 