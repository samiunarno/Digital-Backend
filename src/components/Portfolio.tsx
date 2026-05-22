      {/* 2. Hero Section */}
      <section ref={heroRef} className="min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-[10%] pt-44 sm:pt-36 lg:pt-24 pb-20 relative z-10 overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-10 md:opacity-20 pointer-events-none hero-reveal z-0">
          <div className="absolute inset-0 bg-accent/5 [mask-image:linear-gradient(to_left,black,transparent)]" />
          
          {/* Geometric Accents */}
          <div className="absolute top-[20%] right-[10%] w-48 h-48 md:w-64 md:h-64 border border-accent/10 rotate-45 animate-[spin_30s_linear_infinite]" />
          <div className="absolute bottom-[20%] right-[30%] w-24 h-24 md:w-32 md:h-32 border border-accent/5 -rotate-12 animate-[pulse_6s_infinite]" />
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 hidden xl:block hero-reveal">
          <div className="writing-vertical-rl rotate-180 font-mono text-[10px] uppercase tracking-[0.5em] text-muted/40">
            {content[language].ui.hero.system} // v2.5.0 // {new Date().getFullYear()}
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative">
          <div className="mono-label hero-reveal mb-6 flex items-center gap-4">
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-accent animate-[pulse_1.5s_infinite]" />
              <div className="w-1 h-4 bg-accent/40 animate-[pulse_1.5s_infinite_0.3s]" />
              <div className="w-1 h-4 bg-accent/20 animate-[pulse_1.5s_infinite_0.6s]" />
            </div>
            <span className="tracking-[0.3em] text-[8px] sm:text-[10px]">{content[language].ui.hero.status}</span>
            <span className="text-muted/40 ml-4 hidden md:inline">{content[language].ui.hero.node}</span>
          </div>

          <h1 className="hero-reveal font-display font-bold text-[clamp(2rem,10vw,9rem)] leading-[0.85] tracking-tight md:tracking-[-0.04em] mb-4 md:mb-6 uppercase relative z-10">
            <span className="block">
              <span className="block">{firstName}</span>
            </span>
            <span className="block mt-1">
              <span className={cn(
                "block", 
                theme === 'dark' ? "text-stroke" : "text-accent font-serif italic normal-case tracking-tight"
              )}>
                {lastName}
              </span>
            </span>
          </h1>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start lg:items-center relative z-10">
            <div className="flex-1 w-full">
              <p className="hero-reveal text-lg sm:text-xl md:text-2xl font-light text-muted max-w-xl leading-relaxed mb-12">
                {t.hero?.tagline || ""}
              </p>
              
              <div className="hero-reveal flex flex-wrap gap-4 sm:gap-6">
                <a href="#work" className="group relative px-8 py-4 sm:px-10 sm:py-5 overflow-hidden border border-accent w-full sm:w-auto text-center">
                  <div className="absolute inset-0 bg-accent transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
                  <span className="relative z-10 text-accent group-hover:text-bg font-bold uppercase text-[10px] tracking-[0.3em] transition-colors duration-500">{content[language].ui.hero.viewProjects}</span>
                </a>
                <a href="#contact" className="group relative px-8 py-4 sm:px-10 sm:py-5 border border-border overflow-hidden w-full sm:w-auto text-center">
                  <div className="absolute inset-0 bg-ink translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-0" />
                  <span className="relative z-10 uppercase text-[10px] tracking-[0.3em] group-hover:text-bg transition-colors duration-500">{content[language].ui.hero.contact}</span>
                </a>
              </div>
            </div>

            {/* Code Terminal Animation */}
            <div className="w-full lg:w-[450px] hero-reveal relative">
              <div className="absolute -inset-4 border border-accent/10 -z-10 translate-x-2 translate-y-2" />
              <CodeTerminal />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-accent text-bg p-3 sm:p-4 font-mono text-[8px] sm:text-[10px] uppercase tracking-widest z-20 shadow-2xl">
                {content[language].ui.hero.systemBadge.split('<br/>').map((txt: string, i: number) => <React.Fragment key={i}>{txt}{i === 0 && <br/>}</React.Fragment>)}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hero-reveal hidden md:block">
          <div className="flex flex-col items-center gap-4">
            <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent animate-bounce" />
            <span className="mono-label text-[8px] opacity-40">{content[language].ui.hero.scroll}</span>
          </div>
        </div>
      </section>

      {/* GitHub Commits Section */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-[10%] relative z-10 border-y border-border bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mono-label mb-12">{content[language].ui.hero.system} // RECENT_ACTIVITY</div>
          <GitHubCommits limit={5} showAuthor={true} compact={false} />
        </div>
      </section>