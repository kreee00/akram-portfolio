/* Theme toggle and the email buttons. Loaded in <head> so the saved
   theme is applied before the page paints. */
(function () {
  var root = document.documentElement;
  var KEY = "af-theme";

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  var saved = stored();
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);

  root.classList.add("js");

  function syncToggle(btn) {
    var dark = isDark();
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      syncToggle(btn);
      btn.addEventListener("click", function () {
        var next = isDark() ? "light" : "dark";
        root.setAttribute("data-theme", next);
        store(next);
        syncToggle(btn);
      });
    }

    /* Contact: the real address is decoded only when someone clicks */
    var holder = document.querySelector("[data-email-b64]");
    function realAddr() { try { return atob((holder && holder.getAttribute("data-email-b64")) || ""); } catch (e) { return ""; } }

    document.querySelectorAll(".copy-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var text = realAddr();
        if (!text) return;
        var target = document.getElementById("email");
        var shown = target ? target.textContent : "";
        function reset() { b.textContent = "Copy email"; }
        function showIt() {
          if (!target) return;
          target.textContent = text;
          var r = document.createRange(); r.selectNodeContents(target);
          var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
          b.textContent = "Press Ctrl+C";
          setTimeout(function () { target.textContent = shown; reset(); }, 8000);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { b.textContent = "Copied"; setTimeout(reset, 2400); }, showIt);
        } else { showIt(); }
      });
    });
    document.querySelectorAll(".mail-link").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var t = realAddr();
        if (!t) return;
        e.preventDefault();
        window.location.href = "mailto:" + t;
      });
    });


    /* Leadership tabs (without JS every panel is visible) */
    document.querySelectorAll("[data-tabs]").forEach(function (list) {
      var tabs = list.querySelectorAll("[role=tab]");
      function show(tab, focus) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
        if (focus) tab.focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener("click", function () { show(t); });
        t.addEventListener("keydown", function (e) {
          var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (k) { e.preventDefault(); show(tabs[(i + k + tabs.length) % tabs.length], true); }
        });
      });
      show(list.querySelector("[aria-selected=true]") || tabs[0]);
    });

    /* Mobile menu: open/close, and close after picking a link or pressing Escape */
    var header = document.querySelector(".site-header");
    var menuBtn = document.querySelector(".menu-btn");
    if (header && menuBtn) {
      function setMenu(open) {
        header.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      }
      menuBtn.addEventListener("click", function () { setMenu(!header.classList.contains("open")); });
      header.querySelectorAll(".nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && header.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
    }

    /* Highlight the nav link of the section in view */
    var links = document.querySelectorAll("[data-spy]");
    if (links.length && "IntersectionObserver" in window) {
      var byId = {};
      links.forEach(function (a) { byId[a.getAttribute("data-spy")] = a; });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.removeAttribute("aria-current"); });
          var a = byId[e.target.id];
          if (a) a.setAttribute("aria-current", "true");
        });
      }, { rootMargin: "-35% 0px -60% 0px" });
      Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
    }
  });
})();
