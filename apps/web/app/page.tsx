import homeContent from "@/content/home.json";

const heroGradient = "bg-[radial-gradient(circle_at_top_right,_rgba(243,182,53,0.22),_transparent_42%),linear-gradient(135deg,_#2f2a24_0%,_#403830_45%,_#2f2a24_100%)]";
const cardGradient = "bg-[linear-gradient(145deg,_rgba(243,182,53,0.2),_rgba(236,233,219,0.95))]";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <main className="flex-1 pt-20">
        <nav className="fixed top-0 z-50 w-full border-b border-text/10 bg-background/95 backdrop-blur-md">
          <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-6">
            <div className="font-serif text-2xl font-bold tracking-tighter text-text sm:text-[1.5rem] display-accent">
              {homeContent.site.brand}
            </div>

            <ul className="hidden items-center gap-8 md:flex">
              {homeContent.site.nav.map((item) => (
                <li key={item}>
                  <a className="font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-text/75 transition-colors hover:text-primary" href="#">
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            <a className="rounded-full bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-accent transition-opacity hover:opacity-90" href={homeContent.site.shopHref}>
              Shop
            </a>
          </div>
        </nav>

        <section className="min-h-[60vh] bg-accent text-background">
          <div className="mx-auto grid min-h-[60vh] max-w-[1280px] items-stretch lg:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)]">
            <div className={`relative flex items-center overflow-hidden px-4 py-16 sm:px-6 md:py-24 ${heroGradient}`}>
              <div className="relative z-10 max-w-2xl">
                <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.24em] text-primary display-accent">{homeContent.hero.eyebrow}</p>
                <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-inherit">
                  {homeContent.hero.title.split("\n").map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="mt-6 max-w-xl text-[18px] leading-8 text-background/80">{homeContent.hero.body}</p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <a className="inline-flex items-center justify-center rounded-full border border-background/30 px-8 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-background transition-colors hover:bg-background/10" href="#beers">
                    {homeContent.hero.secondaryCta}
                  </a>
                  <a className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-accent transition-opacity hover:opacity-90" href={homeContent.site.shopHref}>
                    {homeContent.hero.primaryCta}
                  </a>
                </div>
              </div>
            </div>

            <aside className="flex items-center justify-center bg-surface px-6 py-12 text-accent">
              <div className="w-full max-w-sm text-center">
                <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.24em] text-primary display-accent">{homeContent.hero.eyebrow}</p>
                <h2 className="font-serif text-[clamp(2rem,3vw,3rem)] font-bold leading-tight">{homeContent.hero.featuredTitle}</h2>
                <div className={`mt-8 flex h-64 items-center justify-center rounded-[12px] border border-text/10 ${cardGradient} shadow-[0_6px_18px_rgba(47,42,36,0.08)]`}>
                  <div className="space-y-3 px-6">
                    <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-secondary">{homeContent.hero.featuredLabel}</div>
                    <div className="text-xl font-semibold text-accent">{homeContent.hero.featuredTitle}</div>
                    <p className="text-sm leading-6 text-accent/75">{homeContent.hero.featuredBody}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-background py-16 md:py-24" id="beers">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-6">
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <h2 className="font-serif text-[clamp(2rem,3vw,2.5rem)] font-bold leading-tight text-text">Currently Pouring</h2>
                <p className="mt-2 text-[16px] leading-7 text-text/70">Small batches, big character.</p>
              </div>
              <a className="hidden text-[12px] font-bold uppercase tracking-[0.08em] text-primary md:inline-flex" href="#">
                View All
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {homeContent.beers.map((beer) => (
                <article key={beer.name} className="flex h-full flex-col border border-text/10 bg-surface p-6 shadow-[0_1px_3px_rgba(47,42,36,0.06)] transition-transform duration-300 hover:-translate-y-0.5">
                  <div className={`mb-6 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[12px] border border-text/10 ${cardGradient}`}>
                    <div className="px-5 text-center">
                      <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.24em] text-secondary display-accent">{beer.tag}</div>
                      <div className="text-[1.25rem] font-semibold text-accent">{beer.name}</div>
                      <p className="mt-2 text-sm leading-6 text-accent/75">Placeholder visual</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="font-serif text-[1.375rem] font-semibold leading-tight text-text">{beer.name}</h3>
                    <p className="mt-1 text-[16px] leading-7 text-text/70">{beer.style}</p>
                    <p className="mt-4 flex-1 text-[16px] leading-7 text-text/70">{beer.body}</p>
                  </div>
                  <a className="mt-6 inline-flex items-center justify-center border border-text/20 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-text transition-colors hover:bg-text hover:text-background" href={homeContent.site.shopHref}>
                    Add to cart - {beer.price}
                  </a>
                </article>
              ))}
            </div>

            <a className="mt-8 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-primary md:mt-10" href={homeContent.site.shopHref}>
              See full catalogue →
            </a>
          </div>
        </section>

        <section className="bg-surface py-16 md:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-6">
            <div className="relative lg:col-span-7">
              <div className={`aspect-[4/3] rounded-[12px] border border-text/10 ${cardGradient} shadow-[0_6px_18px_rgba(47,42,36,0.08)]`}>
                <div className="flex h-full items-center justify-center px-10 text-center">
                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-secondary">Placeholder</div>
                    <div className="mt-3 font-serif text-[clamp(2rem,3vw,3rem)] font-bold leading-tight text-text">Brewing kettles / editorial photo</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 hidden h-48 w-48 bg-surface-container-high lg:block" />
            </div>

            <div className="lg:col-span-5 lg:pl-8">
              <span className="mb-4 block text-[12px] font-bold uppercase tracking-[0.24em] text-primary">{homeContent.story.eyebrow}</span>
              <h2 className="font-serif text-[clamp(2rem,3vw,2.5rem)] font-bold leading-tight text-text">{homeContent.story.title}</h2>
              <div className="mt-6 space-y-6 text-[16px] leading-8 text-text/70">
                {homeContent.story.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <a className="mt-8 inline-flex items-center gap-2 border-b border-primary pb-1 text-[12px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:border-text hover:text-text" href="#">
                {homeContent.story.cta} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-accent pb-8 pt-16 text-background md:pt-24">
        <div className="mx-auto mb-12 grid max-w-[1280px] gap-10 px-4 sm:px-6 md:grid-cols-4 lg:px-6">
          <div>
            <div className="font-serif text-2xl font-bold tracking-tighter text-background display-accent">{homeContent.site.brand}</div>
            <p className="mt-4 max-w-xs text-[16px] leading-7 text-background/75">{homeContent.footer.tagline}</p>
          </div>

          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.24em] text-background">Visit Us</h3>
            <address className="not-italic text-[16px] leading-7 text-background/75">
              {homeContent.footer.addressLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </address>
          </div>

          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.24em] text-background">Legal</h3>
            <ul className="space-y-2 text-[16px] leading-7 text-background/75">
              {homeContent.footer.legalLinks.map((item) => (
                <li key={item}>
                  <a className="underline decoration-background/20 underline-offset-4 transition-colors hover:text-primary" href="#">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.24em] text-background">Newsletter</h3>
            <form className="flex flex-col gap-3">
              <input
                className="border-b border-background/30 bg-transparent py-2 text-[16px] text-background placeholder:text-background/45 focus:outline-none focus:border-primary"
                placeholder="Email address"
                type="email"
              />
              <button className="text-left text-[12px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:text-background" type="submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 border-t border-background/10 px-4 pt-8 text-[12px] font-medium uppercase tracking-[0.08em] text-background/65 md:flex-row md:items-center md:justify-between sm:px-6 lg:px-6">
          <p>{homeContent.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
