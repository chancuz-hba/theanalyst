(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Year in footer */
  $("#yr").textContent = new Date().getFullYear();

  /* Typing headline — edit these phrases to change the rotating text */
  var phrases = [
    "clear requirements.",
    "measurable outcomes.",
    "executive-ready insight.",
    "better patient experiences.",
    "sustainable process improvement."
  ];
  (function () {
    var el = $("#typed"), i = 0, pos = 0, del = false;
    if (!el) return;
    if (reduce) { el.textContent = phrases[0]; return; }
    el.textContent = "";
    (function tick() {
      var w = phrases[i];
      pos += del ? -1 : 1;
      el.textContent = w.slice(0, pos);
      var t = del ? 28 : 55;
      if (!del && pos === w.length) { del = true; t = 1800; }
      else if (del && pos === 0) { del = false; i = (i + 1) % phrases.length; t = 350; }
      setTimeout(tick, t);
    })();
  })();

  /* Theme toggle */
  $("#theme").addEventListener("click", function () {
    var root = document.documentElement;
    var cur = root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* Mobile menu */
  var burger = $("#burger"), menu = $("#menu");
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("#menu a").forEach(function (a) {
    a.addEventListener("click", function () { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); });
  });

  /* Nav border on scroll + active link */
  var nav = $("#nav");
  window.addEventListener("scroll", function () { nav.classList.toggle("scrolled", window.scrollY > 8); }, { passive: true });
  if ("IntersectionObserver" in window) {
    var links = $$("#menu a");
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });

    /* Reveal on scroll */
    if (!reduce) {
      var rev = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rev.unobserve(e.target); } });
      }, { threshold: 0.12 });
      $$(".sec .wrap > *, .card, .skill-group, .job").forEach(function (el) { el.classList.add("reveal"); rev.observe(el); });
    }
  }

  /* Project filters */
  $$(".f").forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filter");
      $$(".f").forEach(function (x) { x.classList.toggle("on", x === b); });
      $$(".card").forEach(function (c) {
        var tags = (c.getAttribute("data-tags") || "").split(" ");
        c.hidden = !(f === "all" || tags.indexOf(f) > -1);
      });
    });
  });

  /* Contact form: opens the visitor's email app with the message filled in */
  var form = $("#form"), status = $("#status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    $$("input, textarea", form).forEach(function (f) {
      var bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.setAttribute("aria-invalid", bad); if (bad) ok = false;
    });
    if (!ok) { status.className = "status bad"; status.textContent = "Please complete all fields with a valid email."; return; }
    var body = form.message.value + "\n\n— " + form.name.value + " (" + form.email.value + ")";
    window.location.href = "mailto:chanique.cousins@gmail.com?subject=" +
      encodeURIComponent(form.subject.value) + "&body=" + encodeURIComponent(body);
    status.className = "status";
    status.textContent = "Opening your email app… If nothing happens, email chanique.cousins@gmail.com directly.";
  });
})();
