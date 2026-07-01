// DentIQ site interactions
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("siteNav");
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 4) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
});
