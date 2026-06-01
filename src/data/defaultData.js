// ─── Default Website Data Schema ─────────────────────────────────────────────
// This is the single source of truth for all editable website content.
// The admin panel reads/writes to localStorage key: 'snt_cms_data'

export const defaultWebsiteData = {
  // ── Meta ──────────────────────────────────────────────────────────────────
  meta: {
    companyName: 'Shree Nathji Transport',
    tagline: 'Premium Logistics & Transport Services',
    logoUrl: '',
    faviconUrl: '',
  },

  // ── Hero Section ──────────────────────────────────────────────────────────
  hero: {
    badgeText: 'Trusted Since 1995 · ISO Certified Fleet',
    titleLine1: 'Premium Industrial',
    titleLine2: 'Logistics & Transport',
    description: 'Shree Nathji Transport delivers end-to-end heavy-duty logistics, fleet management, and industrial material transport across Eastern India — powered by 60+ specialized vehicles and decades of expertise.',
    point1: '60+ Heavy-duty dumpers & trippers',
    point2: 'ISO 9001 certified operations',
    bgImage: '',
    ctaText: 'Request a Quote',
    ctaSecondaryText: 'View Our Fleet',
  },

  // ── About Section ─────────────────────────────────────────────────────────
  about: {
    subtitle: 'Our Story & Mission',
    title: 'Powering\nIndustrial India',
    description1: 'Established in 1995, Shree Nathji Transport has grown into one of Eastern India\'s most trusted heavy logistics companies. With a dedicated fleet of over 60 specialized vehicles, we serve steel plants, construction sites, and industrial complexes with unmatched reliability.',
    description2: 'Our commitment to safety, timeliness, and operational excellence has earned us long-term partnerships with industry leaders like the Rashmi Group, reinforcing our position as a cornerstone of regional industrial logistics.',
    bullet1: 'ISO 9001:2015 Certified Fleet Operations',
    bullet2: '30+ Years of Industrial Transport Experience',
    bullet3: 'Zero Tolerance Safety & Compliance Standards',
    bullet4: 'On-Time Delivery Guarantee Across All Routes',
    stat1_val: '60+',
    stat1_desc: 'Active Fleet',
    stat2_val: '30+',
    stat2_desc: 'Years Experience',
    stat3_val: '₹50Cr+',
    stat3_desc: 'Annual Revenue',
    stat4_val: '98%',
    stat4_desc: 'On-Time Rate',
    floatingStatTitle: '₹50Cr+ Annual Revenue',
    floatingStatDesc: 'Consistent growth driven by excellence',
    image: '',
  },

  // ── Services ──────────────────────────────────────────────────────────────
  services: {
    subtitle: 'What We Deliver',
    title: 'Premium Logistics & Transport Services',
    description: 'We supply a robust suite of transport capabilities designed to meet the dynamic needs of corporate supply chains across the country.',
    list: [
      {
        id: 1,
        title: 'Internal Plant Logistics',
        icon: 'Layers',
        description: 'Management and movement of raw materials (iron ore, pellets, coal, slag) within industrial complexes, ensuring smooth and uninterrupted flow of production.',
      },
      {
        id: 2,
        title: 'Factory-to-Factory Transport',
        icon: 'Truck',
        description: 'Connecting manufacturing plants with timely and secure transport of raw materials, semi-finished goods, and finished industrial products.',
      },
      {
        id: 3,
        title: 'Industrial Land Filling',
        icon: 'Package',
        description: 'Specialized commercial and industrial land filling solutions, providing Slag dust, ESP dust, and other waste delivery to project sites.',
      },
      {
        id: 4,
        title: 'Bulk Material Supply',
        icon: 'Layers',
        description: 'A trusted supplier of essential construction materials, including sand, stone chips, and other raw minerals with a focus on timely delivery.',
      },
      {
        id: 5,
        title: 'Dust & Waste Transportation',
        icon: 'Shield',
        description: 'Safe and compliant transport of industrial dust and waste materials, utilizing specialized dumpers and adhering to high environmental safety standards.',
      },
      {
        id: 6,
        title: 'Heavy Industrial Fleet',
        icon: 'CalendarCheck',
        description: 'Operations powered by a robust fleet of over 60 dumpers and trippers (10-wheel, 16-wheel, and 18-wheel) engineered for heavy-duty transit.',
      },
    ],
  },

  // ── Fleet ─────────────────────────────────────────────────────────────────
  fleet: {
    subtitle: 'Our Heavy-Duty Fleet',
    title: 'Built for\nIndustrial Scale',
    description: 'Our diverse and well-maintained fleet is purpose-built for the most demanding industrial logistics environments.',
    partner: {
      tag: 'Valued Partnership',
      name: 'Rashmi Group',
      desc: 'Primary transport partner for all inter-plant logistics across Rashmi Metaliks, Rashmi Cement, and affiliated companies in Kharagpur.',
      billing: '₹50Cr+',
      label: 'Annual Billing',
    },
    vehicles: [
      {
        id: 1,
        name: '10-Wheel Dumper',
        category: 'Dumpers',
        capacity: '12–16 Ton',
        description: 'Versatile mid-size dumper for intra-plant material movement and short-haul industrial routes.',
        image: '',
      },
      {
        id: 2,
        name: '16-Wheel Dumper',
        category: 'Dumpers',
        capacity: '20–25 Ton',
        description: 'Heavy-duty multi-axle dumper for bulk material transport across industrial complexes.',
        image: '',
      },
      {
        id: 3,
        name: '18-Wheel Tripper',
        category: 'Trippers',
        capacity: '30–35 Ton',
        description: 'High-capacity articulated tripper for long-haul freight and large-volume construction material delivery.',
        image: '',
      },
    ],
  },

  // ── Contact ───────────────────────────────────────────────────────────────
  contact: {
    helplinesTitle: 'Direct Helplines',
    contactPersons: 'Mr. Sunil Agarwal / Mr. Amit Agarwal',
    phone1: '+91 94340 XXXXX',
    phone2: '+91 98300 XXXXX',
    phone3: '+91 85840 XXXXX',
    whatsappPrefill: 'Hello%20Shree%20Nathji%20Transport%2C%20I%20need%20a%20logistics%20quote.',
    email: 'nathjitransportkgp@gmail.com',
    website: 'www.shreenathji transport.com',
    registeredOfficeTitle: 'Registered Office',
    registeredOfficeAddress: 'Shree Nathji Transport\nNear Kharagpur Station\nKharagpur, West Bengal – 721301',
    workshopOfficeTitle: 'Workshop & Yard',
    workshopOfficeAddress: 'Shree Nathji Transport Workshop\nIndustrial Zone, Kharagpur\nWest Bengal – 721301',
    mapQ: 'Shree+Nathji+Transport+Kharagpur',
    mapLat: '22.3420058',
    mapLng: '87.2633395',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    aboutTitle: 'SHREE NATHJI TRANSPORT',
    aboutDesc: 'Eastern India\'s trusted heavy-duty logistics partner since 1995. Serving steel, construction, and industrial sectors with 60+ specialized vehicles.',
    copyrightText: `© ${new Date().getFullYear()} Shree Nathji Transport. All Rights Reserved.`,
    quickLinks: ['Home', 'About', 'Services', 'Fleet', 'Gallery', 'Career', 'Contact'],
  },

  // ── Gallery ───────────────────────────────────────────────────────────────
  gallery: {
    items: [],
  },

  // ── Website Settings ──────────────────────────────────────────────────────
  settings: {
    primaryColor: '#f97316',
    accentColor: '#fb923c',
    siteTitle: 'Shree Nathji Transport',
    metaDescription: 'Premium industrial logistics and heavy transport services in Eastern India.',
    googleAnalyticsId: '',
    maintenanceMode: false,
  },
};
