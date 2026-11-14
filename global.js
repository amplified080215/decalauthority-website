// ==========================================================================
// 1. INJECT FAVICON
// ==========================================================================
function injectFavicon() {
    let favicon = document.querySelector("link[rel~='icon']");
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/svg+xml';
        document.head.appendChild(favicon);
    }
    // Uses your standalone Decal SVG as the browser tab icon
    favicon.href = '/assets/images/favicon.svg'; 
}
injectFavicon();

// ==========================================================================
// 2. INJECT NAVBAR (Fallback)
// ==========================================================================
const navbarHtml = `
<nav style="position: relative; z-index: 1000;">
    <a href="/" class="logo">
        <img src="/assets/images/decal.svg" alt="Decal" class="nav-logo-decal">
        <img src="/assets/images/authority.svg" alt="Authority" class="nav-logo-authority">
    </a>
    
    <!-- Hamburger Icon -->
    <div class="hamburger" id="hamburger-menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </div>

    <ul class="nav-links" id="nav-links">
        <li><a href="/fleet-graphics/">Fleet Graphics</a></li>
        <li><a href="/capabilities/">Capabilities</a></li>
        <li><a href="/methodology/">Methodology</a></li>
        <li><a href="/gallery/">Gallery</a></li>
        <li><a href="/locations/">Locations</a></li>
        <li><a href="/procurement/">Procurement</a></li>
        <li><a href="/contacts/" class="nav-cta">Get a Quote</a></li>
    </ul>
</nav>
`;

const navContainer = document.getElementById('global-nav');
if (navContainer) {
    navContainer.innerHTML = navbarHtml;
}

// ==========================================================================
// 2.5 HIGHLIGHT ACTIVE CURRENT PAGE (Bulletproof)
// ==========================================================================
// This logic was pulled OUTSIDE the injection block. It now scans the entire document 
// for the links. This means it will work perfectly whether you inject the navbar with 
// JavaScript OR load it statically via nav.html in Astro!
function highlightActiveMenu() {
    // 1. Get the current URL and clean it up (removes index.html and trailing slashes)
    let currentPath = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
    
    // 2. Find all links inside the nav (excluding the Get a Quote button)
    const navItems = document.querySelectorAll('#nav-links a:not(.nav-cta)');
    
    navItems.forEach(link => {
        let linkPath = link.getAttribute('href');
        if (!linkPath) return;

        // Clean up the link's path for a perfect match
        linkPath = linkPath.replace(/\/index\.html$/, '').replace(/\/$/, '');
        
        // 3. Exact matching logic
        if (linkPath === '' && currentPath === '') {
            // Home page match
            link.classList.add('active-nav-item');
        } 
        else if (linkPath !== '' && currentPath === linkPath) {
            // Subpage exact match (e.g. /capabilities perfectly matches /capabilities)
            link.classList.add('active-nav-item');
        }
    });
}

// Run immediately for injected navs
highlightActiveMenu();
// Run again when the document finishes loading for static nav.html files
document.addEventListener('DOMContentLoaded', highlightActiveMenu);

// ==========================================================================
// 3. HAMBURGER MENU LOGIC (Bulletproof Event Delegation)
// ==========================================================================
document.addEventListener('click', (e) => {
    const hamburgerBtn = e.target.closest('#hamburger-menu');
    
    if (hamburgerBtn) {
        const navLinks = document.getElementById('nav-links');
        if (navLinks) {
            navLinks.classList.toggle('nav-active');
            hamburgerBtn.classList.toggle('toggle');
            document.body.classList.toggle('no-scroll');
        }
    }
});

// ==========================================================================
// 4. INJECT FOOTER (MINIMALIST AUTHORITATIVE)
// ==========================================================================
const footerHtml = `
<footer class="global-footer">
    <div class="footer-container">
        <div class="footer-grid">
            
            <div class="footer-brand">
                <a href="/" class="logo" style="margin-bottom: 25px; display: inline-flex;">
                    <img src="/assets/images/decal.svg" alt="Decal" class="nav-logo-decal">
                    <img src="/assets/images/authority.svg" alt="Authority" class="nav-logo-authority">
                </a>
                <p>Brand Execution Systems. Turning corporate brand specifications into durable, repeatable physical fleet and facility implementations since 2018.</p>
                <div class="footer-contact">info@decalauthority.ph &nbsp;|&nbsp; 0927-728-4414</div>
            </div>

            <div class="footer-nav">
                <div class="footer-heading">Architecture</div>
                <div class="footer-links">
                    <a href="/">Overview</a>
                    <a href="/fleet-graphics/">Fleet Graphics</a>
                    
                    <a href="/capabilities/">Capabilities</a>
                    <a href="/methodology/">Methodology</a>
                    
                    <a href="/gallery/">Execution Gallery</a>
                    <a href="/locations/">Our Locations</a>
                    
                    <a href="/procurement/">Procurement</a>
                    <a href="/contacts/">Get a Quote</a>
                </div>
            </div>

            <div class="footer-hubs">
                <div class="footer-heading">Operation Hubs</div>
                <ul>
                    <li>Bustos HQ: 1016 Malamig, Bustos</li>
                    <li>San Rafael: 031A Cruz na Daan</li>
                    <li>Malolos: 9 San Juan, Malolos</li>
                </ul>
                <div class="footer-compliance">DTI • BIR • BMBE Registered</div>
            </div>

        </div>

        <div class="footer-bottom">
            <div>REGISTERED ENTITY: DECAL-AUTHORITY-OL STICKER TRADING &nbsp;|&nbsp; EST. 2018</div>
            <div>Setting the standard in brand executions across the country.</div>
        </div>
    </div>
</footer>
`;

const footerContainer = document.getElementById('global-footer');
if (footerContainer) footerContainer.innerHTML = footerHtml;

// ==========================================================================
// 5. CLIENT MARQUEE INJECTION
// ==========================================================================
fetch('/data/clients.json')
    .then(response => response.json())
    .then(clients => {
        const track = document.getElementById('client-marquee-track');
        if (!track) return; 

        let slideContent = '';
        
        clients.forEach(client => {
            const invertClass = client.noInvert ? 'class="no-invert"' : '';
            slideContent += `
                <div class="marquee-item">
                    <a href="${client.url}" target="_blank" rel="noopener noreferrer">
                        <img src="${client.logo}" alt="${client.name}" ${invertClass}>
                    </a>
                </div>
            `;
        });
        
        track.innerHTML = slideContent + slideContent;
    })
    .catch(error => console.error('Error loading clients JSON:', error));
