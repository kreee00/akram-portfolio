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

  function syncToggle(btn) {
    var dark = isDark();
    btn.textContent = dark ? "Light mode" : "Dark mode";
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
  });
})();
