// 1. Theme Switch
const btn = document.getElementById("theme-toggle");
const KEY = "theme";

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
}

function safeSave(t) {
  try {
    localStorage.setItem(KEY, t);
  } catch (e) {}
}

if (btn) {
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    safeSave(next);
  });
}

const mq = window.matchMedia("(prefers-color-scheme: dark)");
mq.addEventListener("change", (e) => {
  if (!localStorage.getItem(KEY)) {
    applyTheme(e.matches ? "dark" : "light");
  }
});

// 2. Back to Top
const backTop = document.getElementById("back-top");

if (backTop) {
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    backTop.classList.toggle("visible", scrollTop > 150);
  }, { passive: true });

  backTop.addEventListener("click", (e) => {
    e.preventDefault();
    const duration = 500;
    const start = window.scrollY || document.documentElement.scrollTop;
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      window.scrollTo(0, start * (1 - eased));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  });
}

// 3. Calculate Build Days
const dateBegin = new Date("2015/01/03 23:15:15");
const dateEnd = new Date();
const dayDiff = Math.floor((dateEnd - dateBegin) / (1000 * 60 * 60 * 24));
document.getElementById("runtime").textContent = `${dayDiff} days`;

// 4. Bookshelf Collapsible
const bookshelfTitle = document.getElementById("bookshelf-title");
const bookshelfContent = document.getElementById("bookshelf-content");

if (bookshelfTitle && bookshelfContent) {
  bookshelfTitle.addEventListener("click", () => {
    bookshelfContent.classList.toggle("expand");
  });
}

// 5. Post TOC
const toc = document.getElementById("TableOfContents");
const tocWrapper = document.querySelector(".content-wrapper");
const headers = document.querySelectorAll(".post h2, .post h3, .post h4, .post h5");
const tocLinks = document.querySelectorAll("#TableOfContents a");

if (toc && tocWrapper && headers.length > 0) {
  
  let isTicking = false;

  const toggleTocVisibility = () => {
    const clientHeight = window.innerHeight;
    const rootClientWidth = document.documentElement.clientWidth;
    const wrapperWidth = tocWrapper.clientWidth;
    const tocWidth = toc.clientWidth;
    const tocHeight = toc.clientHeight;
    const leftMargin = (rootClientWidth - wrapperWidth) / 2 - tocWidth - 50;
    const shouldShow = tocHeight < clientHeight * 0.6 && leftMargin >= 50;

    const isCurrentlyVisible = toc.classList.contains("visible");
    if (shouldShow !== isCurrentlyVisible) {
      toc.classList.toggle("visible", shouldShow);
    }
    
    isTicking = false;
  };

  const onResize = () => {
    if (!isTicking) {
      window.requestAnimationFrame(toggleTocVisibility);
      isTicking = true;
    }
  };

  let activeLink = null;
  
  const observer = new IntersectionObserver((entries) => {
    const visibleEntries = entries.filter(entry => entry.isIntersecting);

    if (visibleEntries.length > 0) {
      const highestEntry = visibleEntries.reduce((prev, curr) => {
        return (prev.boundingClientRect.top < curr.boundingClientRect.top) ? prev : curr;
      });

      const id = highestEntry.target.id;
      const safeId = CSS.escape(id);
      const newActiveLink = toc.querySelector(`a[href="#${safeId}"]`);

      if (newActiveLink && newActiveLink !== activeLink) {
        window.requestAnimationFrame(() => {
          if (activeLink) activeLink.classList.remove("active");
          newActiveLink.classList.add("active");
          activeLink = newActiveLink;
        });
      }
    }
  }, {
    rootMargin: "0px 0px -80% 0px",
    threshold: 0
  });

  headers.forEach((header) => {
    if (header.id) {
      observer.observe(header);
    }
  });

  window.addEventListener("resize", onResize);
  
  toggleTocVisibility();
}
