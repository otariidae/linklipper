import browser from "https://esm.sh/webextension-polyfill@0.10.0";
import { assert } from "https://deno.land/std@0.201.0/assert/assert.ts";

function generateMediaWikiOrScrapboxLinkText(url: string, title: string) {
  return `[${url} ${title}]`;
}

function generateMarkdownLinkText(url: string, title: string) {
  return `[${title}](${url})`;
}

async function onCopyButtonClick(e: Event) {
  const target = e.target as HTMLElement;
  assert(target !== null);
  const container = target.closest(".link-text-container");
  assert(container !== null);
  const code = container.getElementsByTagName("code")[0];
  assert(code !== undefined);
  const codeText = code.textContent;
  assert(codeText !== null); // textContent must not be null when `code` is HTMLElement as described in the DOM spec
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
  assert(mediaWikiScrapboxCode !== null);
  assert(markdownCode !== null);

  const tabs = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const currentTab = tabs[0];
  assert(currentTab !== undefined);
  assert(currentTab.url !== undefined); // url must be present if having activeTab permission
  assert(currentTab.title !== undefined); // title must be present if having activeTab permission
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
