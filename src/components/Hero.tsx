export default function Hero() {
  return (
    <section className="nd-hero" id="inicio">
      <video
        className="nd-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='100%25' height='100%25' fill='%23080808'/%3E%3C/svg%3E"
      >
        <source src="/intro2.mp4" type="video/mp4" />
        <source src="/about-vertical.mp4" type="video/mp4" />
      </video>
      <h1 className="nd-hero-title">NAIK DANCE STUDIO</h1>
      <div className="nd-scroll">↓</div>
    </section>
  );
}
