(function () {
  var global = window;
  var config = global.COOKIE_CONSENT_CONFIG || {};

  var cookieName = typeof config.cookieName === "string" && config.cookieName.trim() !== "" ? config.cookieName : "cookie_consent";
  var policyUrl = typeof config.policyUrl === "string" && config.policyUrl.trim() !== "" ? config.policyUrl : "/privacy-policy";
  var expiresDays = typeof config.expiresDays === "number" ? config.expiresDays : 180;
  var position = (config.position === "top" ? "top" : "bottom");
  var theme = (config.theme === "dark" ? "dark" : "light");
  var texts = config.texts || {};
  var messageText = typeof texts.message === "string" ? texts.message : "Мы используем файлы cookie для сбора статистики и улучшения работы сайта.";
  var moreText = typeof texts.more === "string" ? texts.more : "Подробнее";
  var acceptText = typeof texts.accept === "string" ? texts.accept : "Согласиться";
  var declineText = typeof texts.decline === "string" ? texts.decline : "Отказаться";

  function getCookie(name) {
    var nameEQ = name + "=";
    var parts = document.cookie.split(";");
    for (var i = 0; i < parts.length; i++) {
      var c = parts[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }

  function setCookie(name, value, days) {
    var expires = "";
    if (typeof days === "number") {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
  }

  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Lax";
  }

  function createStyle() {
    if (document.getElementById("cc-style")) return;
    var style = document.createElement("style");
    style.id = "cc-style";
    style.textContent = (
      ".cc-banner{position:fixed;left:0;right:0;" + (position === "top" ? "top:0;border-bottom:1px solid #e3e3e3;" : "bottom:0;border-top:1px solid #e3e3e3;") +
      "padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;z-index:2147483647;box-shadow:0 2px 8px rgba(0,0,0,.08);font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;line-height:1.4}" +
      ".cc-banner.cc-light{background:#ffffff;color:#222222}" +
      ".cc-banner.cc-dark{background:#222;color:#f0f0f0;border-color:#333}" +
      ".cc-message{flex:1 1 auto;max-width:72%}" +
      ".cc-message a{color:inherit;text-decoration:underline}" +
      ".cc-actions{flex:0 0 auto;display:flex;gap:8px;align-items:center}" +
      ".cc-btn{cursor:pointer;appearance:none;border:1px solid #d0d0d0;background:#f7f7f7;color:#111;padding:8px 12px;border-radius:6px;font-size:14px}" +
      ".cc-btn:hover{background:#ececec}" +
      ".cc-dark .cc-btn{border-color:#444;background:#2f2f2f;color:#f0f0f0}" +
      ".cc-dark .cc-btn:hover{background:#3a3a3a}" +
      ".cc-btn.primary{background:#0b5; border-color:#0b5; color:#fff}" +
      ".cc-btn.primary:hover{background:#0a4c3a;border-color:#0a4c3a}" +
      ".cc-link{margin-left:8px}"
    );
    document.head.appendChild(style);
  }

  function removeBanner() {
    var el = document.getElementById("cc-banner");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function buildBanner() {
    if (document.getElementById("cc-banner")) return;

    var banner = document.createElement("div");
    banner.id = "cc-banner";
    banner.className = "cc-banner cc-" + position + " cc-" + theme;
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Уведомление о cookies");

    var message = document.createElement("div");
    message.className = "cc-message";
    message.innerHTML = (
      escapeHtml(messageText) +
      ' <a class="cc-link" href="' + encodeURI(policyUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(moreText) + "</a>"
    );

    var actions = document.createElement("div");
    actions.className = "cc-actions";

    var declineBtn = document.createElement("button");
    declineBtn.type = "button";
    declineBtn.className = "cc-btn";
    declineBtn.textContent = declineText;

    var acceptBtn = document.createElement("button");
    acceptBtn.type = "button";
    acceptBtn.className = "cc-btn primary";
    acceptBtn.textContent = acceptText;

    actions.appendChild(declineBtn);
    actions.appendChild(acceptBtn);

    banner.appendChild(message);
    banner.appendChild(actions);

    acceptBtn.addEventListener("click", function () {
      setCookie(cookieName, "accepted", expiresDays);
      removeBanner();
    });

    declineBtn.addEventListener("click", function () {
      setCookie(cookieName, "declined", expiresDays);
      removeBanner();
    });

    document.body.appendChild(banner);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function init() {
    if (getCookie(cookieName)) return; // Уже есть выбор — ничего не показываем
    createStyle();
    buildBanner();
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  // Публичный API на всякий случай
  global.CookieConsent = {
    show: function () {
      createStyle();
      removeBanner();
      buildBanner();
    },
    reset: function () {
      deleteCookie(cookieName);
      this.show();
    },
    getStatus: function () {
      return getCookie(cookieName); // "accepted" | "declined" | null
    } 

  };

  onReady(init);
})();
