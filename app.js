(() => {
  const languageStorageKey = "404ff-language";
  const controls = document.querySelector(".language-switch");
  const tabs = Array.from(document.querySelectorAll("[data-set]"));
  const sections = document.querySelectorAll("[data-lang]");
  const pageLinks = document.querySelectorAll("a[data-page]");
  const pageLabels = document.querySelectorAll("[data-label-pl]");
  const page = document.body;

  const isLanguage = (language) => language === "pl" || language === "en";
  const currentAddress = () => new URL(window.location.href);

  function startingLanguage() {
    // Parametr w linku pozwala przejść na kolejną stronę z tym samym językiem
    const requested = currentAddress().searchParams.get("lang");
    if (isLanguage(requested)) return requested;

    try {
      const saved = window.localStorage.getItem(languageStorageKey);
      if (isLanguage(saved)) return saved;
    } catch {
      // Przy otwieraniu z dysku przeglądarka może blokować zapis
    }
    return navigator.language.toLowerCase().startsWith("pl") ? "pl" : "en";
  }

  function setLanguage(language) {
    document.documentElement.lang = language;
    document.title = language === "pl" ? page.dataset.titlePl : page.dataset.titleEn;
    for (const section of sections) {
      section.hidden = section.dataset.lang !== language;
    }
    for (const tab of tabs) {
      tab.setAttribute("aria-pressed", String(tab.dataset.set === language));
    }
    for (const label of pageLabels) {
      label.setAttribute("aria-label", language === "pl" ? label.dataset.labelPl : label.dataset.labelEn);
    }
    for (const link of pageLinks) {
      const target = new URL(link.href);
      target.searchParams.set("lang", language);
      link.href = target.href;
    }
  }

  function chooseLanguage(language) {
    setLanguage(language);
    try {
      window.localStorage.setItem(languageStorageKey, language);
    } catch {
      // Linki i przełącznik działają też kiedy zapis jest niedostępny
    }
    try {
      const address = currentAddress();
      address.searchParams.set("lang", language);
      window.history.replaceState(null, "", address);
    } catch {
      // Niektóre przeglądarki nie zmieniają adresu pliku lokalnego
    }
  }

  for (const tab of tabs) {
    tab.addEventListener("click", () => chooseLanguage(tab.dataset.set));
  }
  setLanguage(startingLanguage());
  if (controls) controls.hidden = false;
})();
