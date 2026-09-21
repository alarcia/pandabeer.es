import homeContent from "@/content/home.json";
import { getHeroFeatured, getCurrentlyPouring, type Beer } from "@/lib/content";
import { getAllContent } from "@/lib/cms";

// ISR: regenerate this page at most once per minute, so admin edits (new beers,
// hero / "pouring" changes, banners, events, instagram) appear within ~60s
// without a rebuild — and without re-rendering on every single request.
export const revalidate = 60;

const heroGradient =
  "bg-[radial-gradient(circle_at_top_right,_rgba(243,182,53,0.22),_transparent_42%),linear-gradient(135deg,_#2f2a24_0%,_#403830_45%,_#2f2a24_100%)]";
const cardGradient =
  "bg-[linear-gradient(145deg,_rgba(243,182,53,0.2),_rgba(236,233,219,0.95))]";

// Normalizes a placeholder beer (home.json) to the Medusa `Beer` shape,
// so the grid renders a single structure no matter where it comes from.
function placeholderBeer(b: (typeof homeContent.beers)[number]): Beer {
  return {
    title: b.name,
    style: b.style,
    tag: b.tag,
    body: b.body,
    imageUrl: null,
    price: b.price,
  };
}

export default async function Home() {
  // Content from Medusa; if there's no connection/items, fall back to home.json.
  const [hero, pouringFromMedusa, cmsContent] = await Promise.all([
    getHeroFeatured(),
    getCurrentlyPouring(),
    getAllContent(),
  ]);

  const pouring: Beer[] =
    pouringFromMedusa.length > 0
      ? pouringFromMedusa
      : homeContent.beers.map(placeholderBeer);

  // Dynamic CMS elements with fallbacks
  const heroData = cmsContent.hero;
  const bannerData = cmsContent.banner;
  const eventData = cmsContent.event;
  const instaData = cmsContent.instagram;

  const heroEyebrow = heroData?.subtitle || homeContent.hero.eyebrow;
  const heroTitle = heroData?.title || homeContent.hero.title;
  const heroBody = heroData?.body || homeContent.hero.body;
  const heroPrimaryCta = heroData?.link_text || homeContent.hero.primaryCta;
  const heroSecondaryCta =
    (heroData?.metadata?.secondary_cta as string) ||
    homeContent.hero.secondaryCta;

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      {/* Dynamic Announcement Banner */}
      {bannerData?.is_active && bannerData.title ? (
        <div className="relative z-50 bg-primary px-4 py-2 text-center text-[12px] font-semibold tracking-wide text-accent transition-all">
          <span>{bannerData.title}</span>
          {bannerData.link_url && bannerData.link_text ? (
            <a
              href={bannerData.link_url}
              className="ml-2 font-bold underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              {bannerData.link_text} →
            </a>
          ) : null}
        </div>
      ) : null}

      <header className="sticky top-0 z-40 w-full border-b border-text/10 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-6">
          <div className="font-serif text-2xl font-bold tracking-tighter text-text sm:text-[1.5rem] display-accent">
            {homeContent.site.brand}
          </div>

          <ul className="hidden items-center gap-8 md:flex">
            {homeContent.site.nav.map((item) => (
              <li key={item}>
                <a
                  className="font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-text/75 transition-colors hover:text-primary"
                  href="#"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <a
            className="rounded-full bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-accent transition-opacity hover:opacity-90"
            href={homeContent.site.shopHref}
          >
            Shop
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-accent text-background">
          <div className="mx-auto grid max-w-[1280px] items-stretch lg:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)]">
            <div
              className={`relative flex items-center overflow-hidden px-4 py-5 sm:px-6 md:py-6 ${heroGradient}`}
            >
              <div className="relative z-10 max-w-2xl">
                <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.24em] text-primary display-accent">
                  {heroEyebrow}
                </p>
                <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-inherit">
                  {heroTitle.split("\n").map((line, idx) => (
                    <span key={`${line}-${idx}`} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="mt-3 max-w-xl text-[16px] leading-7 text-background/80">
                  {heroBody}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <a
                    className="inline-flex items-center justify-center rounded-full border border-background/30 px-8 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-background transition-colors hover:bg-background/10"
                    href="#beers"
                  >
                    {heroSecondaryCta}
                  </a>
                  <a
                    className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-accent transition-opacity hover:opacity-90"
                    href={homeContent.site.shopHref}
                  >
                    {heroPrimaryCta}
                  </a>
                </div>
              </div>
            </div>

            <aside className="flex items-center justify-center bg-surface px-6 py-4 text-accent">
              <div className="w-full max-w-sm text-center">
                <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.24em] text-primary display-accent">
                  {homeContent.hero.eyebrow}
                </p>
                <h2 className="font-serif text-[clamp(2rem,3vw,3rem)] font-bold leading-tight">
                  {hero?.title ?? homeContent.hero.featuredTitle}
                </h2>
                <div
                  className={`mt-4 flex ${hero?.imageUrl ? "aspect-square" : "h-36"} items-center justify-center overflow-hidden rounded-[12px] border border-text/10 ${cardGradient} shadow-[0_6px_18px_rgba(47,42,36,0.08)]`}
                >
                  {hero?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={hero.imageUrl}
                      alt={hero.title}
                      className="h-full w-full object-contain p-6"
                    />
                  ) : (
                    <div className="space-y-3 px-6">
                      <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-secondary">
                        {hero
                          ? (hero.price ?? homeContent.hero.featuredLabel)
                          : homeContent.hero.featuredLabel}
                      </div>
                      <div className="text-xl font-semibold text-accent">
                        {hero?.title ?? homeContent.hero.featuredTitle}
                      </div>
                      <p className="text-sm leading-6 text-accent/75">
                        {hero?.body ?? homeContent.hero.featuredBody}
                      </p>
                    </div>
                  )}
                </div>
                {hero?.imageUrl && hero.price ? (
                  <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.24em] text-secondary">
                    {hero.price}
                  </p>
                ) : null}
              </div>
            </aside>
          </div>
        </section>

        {/* CURRENTLY POURING SECTION */}
        <section className="bg-background py-16 md:py-24" id="beers">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-6">
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <h2 className="font-serif text-[clamp(2rem,3vw,2.5rem)] font-bold leading-tight text-text">
                  Currently Pouring
                </h2>
                <p className="mt-2 text-[16px] leading-7 text-text/70">
                  Small batches, big character.
                </p>
              </div>
              <a
                className="hidden text-[12px] font-bold uppercase tracking-[0.08em] text-primary md:inline-flex"
                href="#"
              >
                View All
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {pouring.map((beer, i) => (
                <article
                  key={`${beer.title}-${i}`}
                  className="flex h-full flex-col border border-text/10 bg-surface p-6 shadow-[0_1px_3px_rgba(47,42,36,0.06)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <div
                    className={`mb-6 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[12px] border border-text/10 ${cardGradient}`}
                  >
                    {beer.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={beer.imageUrl}
                        alt={beer.title}
                        className="h-full w-full object-contain p-4"
                      />
                    ) : (
                      <div className="px-5 text-center">
                        {beer.tag ? (
                          <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.24em] text-secondary display-accent">
                            {beer.tag}
                          </div>
                        ) : null}
                        <div className="text-[1.25rem] font-semibold text-accent">
                          {beer.title}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-accent/75">
                          Placeholder visual
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    {beer.tag ? (
                      <span className="mb-2 text-[12px] font-bold uppercase tracking-[0.24em] text-secondary display-accent">
                        {beer.tag}
                      </span>
                    ) : null}
                    <h3 className="font-serif text-[1.375rem] font-semibold leading-tight text-text">
                      {beer.title}
                    </h3>
                    {beer.style ? (
                      <p className="mt-1 text-[16px] leading-7 text-text/70">
                        {beer.style}
                      </p>
                    ) : null}
                    {beer.body ? (
                      <p className="mt-4 flex-1 text-[16px] leading-7 text-text/70">
                        {beer.body}
                      </p>
                    ) : null}
                  </div>
                  <a
                    className="mt-6 inline-flex items-center justify-center border border-text/20 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-text transition-colors hover:bg-text hover:text-background"
                    href={homeContent.site.shopHref}
                  >
                    {beer.price ? `Add to cart - ${beer.price}` : "View in shop"}
                  </a>
                </article>
              ))}
            </div>

            <a
              className="mt-8 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-primary md:mt-10"
              href={homeContent.site.shopHref}
            >
              See full catalogue →
            </a>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section className="bg-surface py-16 md:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-6">
            <div className="relative lg:col-span-7">
              <div
                className={`aspect-[4/3] rounded-[12px] border border-text/10 ${cardGradient} shadow-[0_6px_18px_rgba(47,42,36,0.08)]`}
              >
                <div className="flex h-full items-center justify-center px-10 text-center">
                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-secondary">
                      Placeholder
                    </div>
                    <div className="mt-3 font-serif text-[clamp(2rem,3vw,3rem)] font-bold leading-tight text-text">
                      Brewing kettles / editorial photo
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 hidden h-48 w-48 bg-surface-container-high lg:block" />
            </div>

            <div className="lg:col-span-5 lg:pl-8">
              <span className="mb-4 block text-[12px] font-bold uppercase tracking-[0.24em] text-primary">
                {homeContent.story.eyebrow}
              </span>
              <h2 className="font-serif text-[clamp(2rem,3vw,2.5rem)] font-bold leading-tight text-text">
                {homeContent.story.title}
              </h2>
              <div className="mt-6 space-y-6 text-[16px] leading-8 text-text/70">
                {homeContent.story.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <a
                className="mt-8 inline-flex items-center gap-2 border-b border-primary pb-1 text-[12px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:border-text hover:text-text"
                href="#"
              >
                {homeContent.story.cta} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* DYNAMIC CMS: UPCOMING EVENT & INSTAGRAM HIGHLIGHT */}
        {(eventData?.is_active && eventData.title) ||
        (instaData?.is_active && instaData.title) ? (
          <section className="border-t border-text/10 bg-background py-16 md:py-24">
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-6">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Event Card */}
                {eventData?.is_active && eventData.title ? (
                  <article className="flex flex-col justify-between rounded-[16px] border border-text/10 bg-surface p-8 shadow-[0_4px_16px_rgba(47,42,36,0.04)]">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[12px] font-bold uppercase tracking-[0.24em] text-primary display-accent">
                          PRÓXIMO EVENTO
                        </span>
                        {eventData.subtitle ? (
                          <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold text-accent">
                            {eventData.subtitle}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="font-serif text-[1.75rem] font-bold leading-tight text-text">
                        {eventData.title}
                      </h3>

                      {eventData.metadata?.location ? (
                        <p className="mt-1 text-[13px] font-medium text-text/60">
                          📍 {String(eventData.metadata.location)}
                        </p>
                      ) : null}

                      {eventData.image_url ? (
                        <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-[10px] border border-text/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={eventData.image_url}
                            alt={eventData.title}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      ) : null}

                      {eventData.body ? (
                        <p className="mt-4 text-[15px] leading-7 text-text/75">
                          {eventData.body}
                        </p>
                      ) : null}
                    </div>

                    {eventData.link_url ? (
                      <div className="mt-8">
                        <a
                          href={eventData.link_url}
                          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-accent transition-opacity hover:opacity-90"
                        >
                          {eventData.link_text || "Más información"} →
                        </a>
                      </div>
                    ) : null}
                  </article>
                ) : null}

                {/* Instagram Highlight Card */}
                {instaData?.is_active && instaData.title ? (
                  <article className="flex flex-col justify-between rounded-[16px] border border-text/10 bg-surface p-8 shadow-[0_4px_16px_rgba(47,42,36,0.04)]">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[12px] font-bold uppercase tracking-[0.24em] text-primary display-accent">
                          INSTAGRAM DESTACADO
                        </span>
                        <span className="text-[12px] font-bold text-text/60">
                          {instaData.subtitle || "@pandabeer.es"}
                        </span>
                      </div>

                      <h3 className="font-serif text-[1.75rem] font-bold leading-tight text-text">
                        {instaData.title}
                      </h3>

                      {instaData.image_url ? (
                        <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-[10px] border border-text/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={instaData.image_url}
                            alt={instaData.title}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      ) : null}

                      {instaData.body ? (
                        <p className="mt-4 text-[15px] leading-7 text-text/75">
                          {instaData.body}
                        </p>
                      ) : null}
                    </div>

                    {instaData.link_url ? (
                      <div className="mt-8">
                        <a
                          href={instaData.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-text/20 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-text transition-colors hover:bg-text hover:text-background"
                        >
                          {instaData.link_text || "Ver en Instagram"} ↗
                        </a>
                      </div>
                    ) : null}
                  </article>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="bg-accent pb-8 pt-16 text-background md:pt-24">
        <div className="mx-auto mb-12 grid max-w-[1280px] gap-10 px-4 sm:px-6 md:grid-cols-4 lg:px-6">
          <div>
            <div className="font-serif text-2xl font-bold tracking-tighter text-background display-accent">
              {homeContent.site.brand}
            </div>
            <p className="mt-4 max-w-xs text-[16px] leading-7 text-background/75">
              {homeContent.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.24em] text-background">
              Visit Us
            </h3>
            <address className="not-italic text-[16px] leading-7 text-background/75">
              {homeContent.footer.addressLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </address>
          </div>

          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.24em] text-background">
              Legal
            </h3>
            <ul className="space-y-2 text-[16px] leading-7 text-background/75">
              {homeContent.footer.legalLinks.map((item) => (
                <li key={item}>
                  <a
                    className="underline decoration-background/20 underline-offset-4 transition-colors hover:text-primary"
                    href="#"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[12px] font-bold uppercase tracking-[0.24em] text-background">
              Newsletter
            </h3>
            <form className="flex flex-col gap-3">
              <input
                className="border-b border-background/30 bg-transparent py-2 text-[16px] text-background placeholder:text-background/45 focus:outline-none focus:border-primary"
                placeholder="Email address"
                type="email"
              />
              <button
                className="text-left text-[12px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:text-background"
                type="submit"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 border-t border-background/10 px-4 pt-8 text-[12px] font-medium uppercase tracking-[0.08em] text-background/65 md:flex-row md:items-center md:justify-between sm:px-6 lg:px-6">
          <p>{homeContent.footer.copyright}</p>
          <a
            className="text-background/40 transition-colors hover:text-background/65"
            href={`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/app`}
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            Admin
          </a>
        </div>
      </footer>
    </div>
  );
}
