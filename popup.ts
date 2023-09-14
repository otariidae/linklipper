import browser from "https://esm.sh/webextension-polyfill@0.10.0";

function generateMediaWikiOrScrapboxLinkText(url: string, title: string) {
  return `[${url} ${title}]`;
}

function generateMarkdownLinkText(url: string, title: string) {
  return `[${title}](${url})`;
}

async function onCopyButtonClick(e: Event) {
  const target = e.target as HTMLElement;
  if (target === null) {
    return;
  }
  const container = target.closest(".link-text-container");
  if (container === null) {
    return;
  }
  const code = container.getElementsByTagName("code")[0];
  if (code === undefined) {
    return;
  }
  const codeText = code.textContent;
  if (codeText === null) {
    return;
  }
  await navigator.clipboard.writeText(codeText);
  container.classList.add("copied");
}

async function main() {
  const btns = document.getElementsByClassName("copy-to-clipboard");
  for (const btn of Array.from(btns)) {
    btn.addEventListener("click", onCopyButtonClick);
  }

  const mediaWikiScrapboxCode = document.getElementById(
    "mediawiki-scrapbox-code",
  );
  const markdownCode = document.getElementById("markdown-code");
  if (mediaWikiScrapboxCode === null || markdownCode === null) {
    return;
  }

  const tabs = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const currentTab = tabs[0];
  if (currentTab.url === undefined || currentTab.title === undefined) {
    return;
  }
  mediaWikiScrapboxCode.textContent = generateMediaWikiOrScrapboxLinkText(
    currentTab.url,
    currentTab.title,
  );
  markdownCode.textContent = generateMarkdownLinkText(
    currentTab.url,
    currentTab.title,
  );
}

main();
