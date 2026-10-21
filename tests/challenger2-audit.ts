import { spawn, ChildProcess } from 'child_process';
import http from 'http';
import { prisma } from '../src/lib/prisma';

interface CdpResponse {
  id: number;
  result?: any;
  error?: any;
}

class EdgeCdpClient {
  private ws: WebSocket | null = null;
  private messageId = 0;
  private callbacks = new Map<number, (res: any) => void>();

  async connect(wsUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data.toString()) as CdpResponse;
          if (data.id && this.callbacks.has(data.id)) {
            const cb = this.callbacks.get(data.id)!;
            this.callbacks.delete(data.id);
            if (data.error) {
              console.error('CDP Error:', data.error);
            }
            cb(data.result);
          }
        } catch (e) {
          console.error('Error parsing CDP message', e);
        }
      };
    });
  }

  send(method: string, params: Record<string, any> = {}): Promise<any> {
    return new Promise((resolve) => {
      const id = ++this.messageId;
      this.callbacks.set(id, resolve);
      this.ws?.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws?.close();
  }
}

async function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runAudit() {
  console.log('=================================================================');
  console.log('   CHALLENGER 2: EMPIRICAL RESPONSIVENESS & ROUTE AUDIT');
  console.log('=================================================================\n');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cdpPort = 9333;
  const targetUrl = 'http://localhost:3008';

  console.log(`1. Launching headless Edge on remote-debugging-port=${cdpPort}...`);
  const edgeProc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\crock\\AppData\\Local\\Temp\\edge-cdp-challenger2',
    'about:blank',
  ]);

  // Wait for Edge CDP endpoint to become ready
  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    try {
      const versionInfo = await fetchJson(`http://127.0.0.1:${cdpPort}/json/version`);
      wsUrl = versionInfo.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  if (!wsUrl) {
    edgeProc.kill();
    throw new Error('Failed to connect to Edge CDP endpoint');
  }

  console.log('   ✓ Edge CDP connected:', wsUrl);

  const client = new EdgeCdpClient();
  await client.connect(wsUrl);

  // Create a new target page
  const target = await client.send('Target.createTarget', { url: 'about:blank' });
  const pageTargetId = target.targetId;

  // Connect to the page target
  const targets = await fetchJson(`http://127.0.0.1:${cdpPort}/json`);
  const pageObj = targets.find((t: any) => t.id === pageTargetId);
  const pageClient = new EdgeCdpClient();
  await pageClient.connect(pageObj.webSocketDebuggerUrl);

  await pageClient.send('Page.enable');
  await pageClient.send('DOM.enable');
  await pageClient.send('Runtime.enable');

  const viewports = [
    { name: 'Mobile', width: 375, height: 812, isMobile: true },
    { name: 'Tablet', width: 768, height: 1024, isMobile: false },
    { name: 'Desktop', width: 1280, height: 800, isMobile: false },
  ];

  const auditFindings: Array<{
    area: string;
    viewport: string;
    issue: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
    details: any;
  }> = [];

  console.log('\n2. Testing Responsive Viewport Constraints & Horizontal Overflow:');

  for (const vp of viewports) {
    console.log(`\n--- [Viewport: ${vp.name} (${vp.width}x${vp.height})] ---`);
    await pageClient.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.isMobile,
    });

    await pageClient.send('Page.navigate', { url: targetUrl });
    // Wait for page to render
    await new Promise((r) => setTimeout(r, 1500));

    // Evaluate window and document dimensions
    const docDimensions = await pageClient.send('Runtime.evaluate', {
      expression: `(() => {
        return {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          docScrollWidth: document.documentElement.scrollWidth,
          docClientWidth: document.documentElement.clientWidth,
          bodyScrollWidth: document.body.scrollWidth,
          bodyClientWidth: document.body.clientWidth,
        };
      })()`,
      returnByValue: true,
    });

    const dim = docDimensions.result.value;
    console.log(`   Dimensions: innerWidth=${dim.innerWidth}, docScrollWidth=${dim.docScrollWidth}, bodyScrollWidth=${dim.bodyScrollWidth}`);

    const hasHorizontalDocOverflow = dim.docScrollWidth > dim.innerWidth;
    const hasHorizontalBodyOverflow = dim.bodyScrollWidth > dim.innerWidth;

    if (hasHorizontalDocOverflow || hasHorizontalBodyOverflow) {
      console.error(`   [OVERFLOW DETECTED] Document scroll width (${dim.docScrollWidth}) exceeds viewport width (${dim.innerWidth})!`);
      auditFindings.push({
        area: 'Viewport Overflow',
        viewport: vp.name,
        issue: `Document or Body scrollWidth exceeds viewport width (${dim.docScrollWidth} > ${dim.innerWidth})`,
        severity: 'HIGH',
        details: dim,
      });
    } else {
      console.log(`   ✓ Document & Body zero horizontal overflow confirmed at ${vp.width}px.`);
    }

    // Inspect individual sections and components on the page
    const sectionAnalysis = await pageClient.send('Runtime.evaluate', {
      expression: `(() => {
        const results = [];
        const sections = document.querySelectorAll('aside, header, main > div > section, footer');
        sections.forEach((sec, idx) => {
          const rect = sec.getBoundingClientRect();
          const label = sec.getAttribute('aria-label') || sec.tagName + '.' + sec.className.slice(0, 30);
          
          // Check if any descendant element overflows
          const descendants = sec.querySelectorAll('*');
          const overflowingElements = [];
          
          descendants.forEach(el => {
            // Ignore intentional horizontally scrollable containers (overflow-x-auto/scroll)
            const style = window.getComputedStyle(el);
            let isClipped = isScrollable;
            let parent = el.parentElement;
            while (parent && parent !== document.body && !isClipped) {
              if (parent.nodeType === 1) {
                const pStyle = window.getComputedStyle(parent);
                if (
                  pStyle.overflowX === 'hidden' ||
                  pStyle.overflow === 'hidden' ||
                  pStyle.overflowX === 'auto' ||
                  pStyle.overflowX === 'scroll'
                ) {
                  isClipped = true;
                  break;
                }
              }
              parent = parent.parentElement;
            }

            const r = el.getBoundingClientRect();
            // Check bounding rect against viewport bounds with 1px margin if not clipped
            if (!isClipped && r.width > 0 && r.height > 0) {
              if (r.right > window.innerWidth + 1) {
                overflowingElements.push({
                  tag: el.tagName,
                  className: el.className ? String(el.className).slice(0, 50) : '',
                  right: Math.round(r.right),
                  viewportWidth: window.innerWidth,
                  excess: Math.round(r.right - window.innerWidth),
                  textSnippet: (el.textContent || '').trim().slice(0, 30)
                });
              }
              if (r.left < -1) {
                overflowingElements.push({
                  tag: el.tagName,
                  className: el.className ? String(el.className).slice(0, 50) : '',
                  left: Math.round(r.left),
                  textSnippet: (el.textContent || '').trim().slice(0, 30)
                });
              }
            }
          });

          results.push({
            index: idx,
            label,
            tag: sec.tagName,
            rect: {
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            },
            scrollWidth: sec.scrollWidth,
            clientWidth: sec.clientWidth,
            overflowsSection: sec.scrollWidth > sec.clientWidth + 1,
            overflowingElementsCount: overflowingElements.length,
            sampleOverflows: overflowingElements.slice(0, 3)
          });
        });
        return results;
      })()`,
      returnByValue: true,
    });

    if (sectionAnalysis.exceptionDetails) {
      console.error('sectionAnalysis Exception:', sectionAnalysis.exceptionDetails);
    }
    const sections = sectionAnalysis.result?.value || [];
    for (const sec of sections) {
      if (sec.overflowingElementsCount > 0) {
        console.warn(`   [WARNING] Section "${sec.label}" contains ${sec.overflowingElementsCount} overflowing elements:`, sec.sampleOverflows);
        auditFindings.push({
          area: 'Component Visual Overflow',
          viewport: vp.name,
          issue: `Section "${sec.label}" has ${sec.overflowingElementsCount} child elements exceeding viewport right edge`,
          severity: 'MEDIUM',
          details: { section: sec.label, overflows: sec.sampleOverflows },
        });
      } else {
        console.log(`   ✓ Section [${sec.tag}] "${sec.label}" (${sec.rect.width}x${sec.rect.height}px) within bounds.`);
      }
    }
  }

  // 3. Link and CTA Route Structure Verification
  console.log('\n3. Extracting and Verifying All Links & CTAs Across All 12 Sections:');
  
  // Set desktop viewport to extract full links
  await pageClient.send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await pageClient.send('Page.navigate', { url: targetUrl });
  await new Promise((r) => setTimeout(r, 1000));

  const linkExtraction = await pageClient.send('Runtime.evaluate', {
    expression: `(() => {
      const links = [];
      document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        const text = (a.textContent || '').trim().replace(/\\s+/g, ' ');
        const section = a.closest('aside, header, section, footer');
        const sectionName = section ? (section.getAttribute('aria-label') || section.tagName) : 'body';
        links.push({
          href,
          text: text.slice(0, 40),
          section: sectionName
        });
      });
      return links;
    })()`,
    returnByValue: true,
  });

  const extractedLinks: Array<{ href: string; text: string; section: string }> = linkExtraction.result.value;
  console.log(`   Found ${extractedLinks.length} total anchor links rendered on homepage.`);

  // Also extract links from MobileNavDrawer
  console.log('   Testing MobileNavDrawer links at 375px...');
  await pageClient.send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 1,
    mobile: true,
  });
  // Open mobile drawer
  await pageClient.send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[aria-label="Open mobile navigation menu"]');
      if (btn) btn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 500));

  const drawerLinks = await pageClient.send('Runtime.evaluate', {
    expression: `(() => {
      const links = [];
      const drawer = document.querySelector('[aria-label="Mobile Navigation"]');
      if (drawer) {
        drawer.querySelectorAll('a[href]').forEach(a => {
          links.push({
            href: a.getAttribute('href'),
            text: (a.textContent || '').trim().replace(/\\s+/g, ' '),
            section: 'Mobile Navigation Drawer'
          });
        });
      }
      return links;
    })()`,
    returnByValue: true,
  });

  const allLinks = [...extractedLinks, ...drawerLinks.result.value];
  console.log(`   Total combined links across desktop and mobile drawer: ${allLinks.length}`);

  // Fetch all categories and products from database for verification
  const [dbCategories, dbProducts] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany(),
  ]);

  const categorySlugs = new Set(dbCategories.map((c) => c.slug));
  const productSlugs = new Set(dbProducts.map((p) => p.slug));

  console.log(`   Database has ${categorySlugs.size} categories and ${productSlugs.size} products.`);

  const verifiedLinks = new Set<string>();
  const brokenLinks: Array<{ href: string; text: string; section: string; reason: string }> = [];

  for (const l of allLinks) {
    const key = `${l.section} -> ${l.href}`;
    if (verifiedLinks.has(key)) continue;
    verifiedLinks.add(key);

    const href = l.href;
    if (!href || href === '#' || href.startsWith('javascript:')) {
      brokenLinks.push({ ...l, reason: 'Empty, hash, or javascript void link' });
      continue;
    }

    // External or mailto link
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
      console.log(`   [EXT] ${l.section} | "${l.text}" -> ${href} (Valid external target)`);
      continue;
    }

    // Product PDP route: /products/[slug]
    const prodMatch = href.match(/^\/products\/([^?#]+)/);
    if (prodMatch) {
      const slug = prodMatch[1];
      if (!productSlugs.has(slug)) {
        console.error(`   [BROKEN PDP REFERENCE] ${l.section} | "${l.text}" -> ${href} (Slug "${slug}" NOT FOUND in DB!)`);
        brokenLinks.push({
          ...l,
          reason: `Product slug "${slug}" does not exist in MySQL Product table!`,
        });
        auditFindings.push({
          area: 'Route Structure / Broken Reference',
          viewport: 'All',
          issue: `Broken PDP link in ${l.section}: ${href} -> slug "${slug}" not found in database`,
          severity: 'CRITICAL',
          details: { href, text: l.text, section: l.section, searchedSlug: slug },
        });
      } else {
        console.log(`   [PDP] ${l.section} | "${l.text}" -> ${href} (Verified in DB: slug exists)`);
      }
      continue;
    }

    // Collection category route: /collections/[slug]
    const catMatch = href.match(/^\/collections\/([^?#]+)/);
    if (catMatch) {
      const slug = catMatch[1];
      if (!categorySlugs.has(slug)) {
        console.error(`   [BROKEN CATEGORY REFERENCE] ${l.section} | "${l.text}" -> ${href} (Category slug "${slug}" NOT FOUND in DB!)`);
        brokenLinks.push({
          ...l,
          reason: `Category slug "${slug}" does not exist in MySQL Category table!`,
        });
        auditFindings.push({
          area: 'Route Structure / Broken Reference',
          viewport: 'All',
          issue: `Broken category link in ${l.section}: ${href} -> slug "${slug}" not found in database`,
          severity: 'CRITICAL',
          details: { href, text: l.text, section: l.section, searchedSlug: slug },
        });
      } else {
        console.log(`   [CAT] ${l.section} | "${l.text}" -> ${href} (Verified in DB: category exists)`);
      }
      continue;
    }

    // Standard static routes and query param routes
    const validStaticRoutes = [
      '/',
      '/shop',
      '/about',
      '/contact',
      '/wishlist',
      '/cart',
      '/track-order',
      '/policies/shipping',
      '/policies/returns',
      '/policies/privacy',
      '/policies/terms',
    ];

    const basePath = href.split('?')[0];
    if (validStaticRoutes.includes(basePath)) {
      console.log(`   [ROUTE] ${l.section} | "${l.text}" -> ${href} (Valid App Router path structure)`);
    } else {
      console.warn(`   [UNKNOWN ROUTE] ${l.section} | "${l.text}" -> ${href}`);
      brokenLinks.push({
        ...l,
        reason: `Route path "${basePath}" is not a recognized route structure`,
      });
      auditFindings.push({
        area: 'Route Structure / Broken Reference',
        viewport: 'All',
        issue: `Unrecognized route path: ${href}`,
        severity: 'HIGH',
        details: { href, text: l.text, section: l.section },
      });
    }
  }

  // Cleanup Edge
  pageClient.close();
  client.close();
  edgeProc.kill();

  console.log('\n=================================================================');
  console.log('   AUDIT SUMMARY & VERDICT EVALUATION');
  console.log('=================================================================');
  console.log(`Total Findings: ${auditFindings.length}`);
  for (const f of auditFindings) {
    console.log(`- [${f.severity}] ${f.area} (${f.viewport}): ${f.issue}`);
  }

  const criticalFindings = auditFindings.filter((f) => f.severity === 'CRITICAL');
  const highFindings = auditFindings.filter((f) => f.severity === 'HIGH');

  if (criticalFindings.length > 0 || highFindings.length > 0) {
    console.log('\n❌ VERDICT: REJECT');
    console.log(`Reason: Found ${criticalFindings.length} CRITICAL and ${highFindings.length} HIGH severity issues.`);
    process.exit(1);
  } else {
    console.log('\n✅ VERDICT: APPROVE');
    console.log('Reason: All responsive viewport constraints and route references verified.');
    process.exit(0);
  }
}

runAudit()
  .catch((err) => {
    console.error('Audit execution error:', err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
