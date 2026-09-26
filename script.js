// Download links point at GitHub's "latest release" alias with fixed asset
// names (no version in them), so they keep working after every release
// without touching this site. The release workflow in the Downly repo must
// keep uploading these exact names.
const REPO = 'Laurenz19/downly-releases'
const LATEST = `https://github.com/${REPO}/releases/latest/download/`

for (const link of document.querySelectorAll('[data-asset]')) {
  link.href = LATEST + link.dataset.asset
}

// Point the hero button at the visitor's platform. Anything else (macOS,
// phones) falls back to the download section.
function detectOs() {
  const platform = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase()
  const ua = navigator.userAgent.toLowerCase()
  if (/android|iphone|ipad/.test(ua)) return null
  if (platform.includes('win') || ua.includes('windows')) return 'windows'
  if (platform.includes('linux') || ua.includes('linux')) return 'linux'
  return null
}

const os = detectOs()
const heroButton = document.getElementById('hero-download')
const heroLabel = document.getElementById('hero-download-label')
if (os === 'windows') {
  heroButton.href = LATEST + 'Downly-Setup.exe'
  heroLabel.textContent = 'Download for Windows'
} else if (os === 'linux') {
  heroButton.href = LATEST + 'Downly-x86_64.AppImage'
  heroLabel.textContent = 'Download for Linux'
}
if (os) document.querySelector(`.download-card[data-os="${os}"]`)?.classList.add('is-recommended')

// Show the current version. Purely cosmetic: if the API is unreachable or
// rate-limited, the page keeps its generic text.
fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
  .then((res) => (res.ok ? res.json() : null))
  .then((release) => {
    if (!release?.tag_name) return
    const date = new Date(release.published_at).toLocaleDateString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    document.getElementById('download-version').textContent =
      `Version ${release.tag_name.replace(/^v/, '')}, released ${date}. Free, for 64-bit Windows and Linux.`
    document.getElementById('hero-meta').textContent =
      `Version ${release.tag_name.replace(/^v/, '')} · No account, no ads. Your files stay on your computer.`
  })
  .catch(() => {})

// Screens tabs.
const tabs = document.querySelectorAll('.tab')
for (const tab of tabs) {
  tab.addEventListener('click', () => {
    for (const other of tabs) {
      const selected = other === tab
      other.classList.toggle('is-active', selected)
      other.setAttribute('aria-selected', String(selected))
      document.getElementById(other.getAttribute('aria-controls')).hidden = !selected
    }
  })
}
