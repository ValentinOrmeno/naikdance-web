export default function Hero() {
  return (
    <section className="nd-hero" id="inicio">
      <img className="nd-hero-fallback" src="/hero.png" alt="" />
      <video
        className="nd-hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero.png"
      >
        <source src="/intro2.mp4" type="video/mp4" />
      </video>
      <h1 className="nd-hero-title">NAIK DANCE STUDIO</h1>
      <div className="nd-scroll">↓</div>
    </section>
  );
}
