// StrideX Product Database (12 Unique Products)

// Global Path Helper for resolving relative paths dynamically on root vs subpages
function getPathPrefix() {
  return window.location.pathname.includes("/pages/") ? "../" : "";
}

const PRODUCTS = [
  {
    id: "stridex-apex-runner",
    name: "StrideX Apex Runner",
    category: "Running",
    price: 180,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 128,
    badge: "New",
    description: "Designed for boundary-breaking speed. The Apex Runner features our latest reactive foam technology and dynamic stability frame, delivering an effortless propulsion with every stride. Perfect for long-distance runs and everyday road training.",
    specs: [
      { name: "Weight", value: "245g (Size 9)" },
      { name: "Midsole Drop", value: "8mm" },
      { name: "Support", value: "Neutral Stability" },
      { name: "Cushioning", value: "Ultra Reactive" }
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    featured: true,
    colors: [
      { name: "Electric Blue", hex: "#0055ff", image: "images/shoes/apex_runner_blue.png" }
    ],
    gender: "Men",
    availability: "In Stock",
    brand: "StrideX",
    material: "Mesh",
    technology: "Active Foam",
    popularity: 95,
    dateAdded: "2026-06-01"
  },
  {
    id: "stridex-zenith-carbon",
    name: "StrideX Zenith Carbon",
    category: "Running",
    price: 240,
    originalPrice: 280,
    rating: 4.9,
    reviewsCount: 94,
    badge: "Sale",
    description: "Push past your limits. The Zenith Carbon is armed with a full-length curved carbon plate and hyper-light nitrogen-infused cushioning, offering unparalleled energy return. Engineered strictly for personal records and elite race-day performance.",
    specs: [
      { name: "Weight", value: "198g (Size 9)" },
      { name: "Midsole Drop", value: "6mm" },
      { name: "Support", value: "Carbon Propelled" },
      { name: "Cushioning", value: "Maximum Cush" }
    ],
    sizes: [8, 9, 10, 11, 12],
    featured: true,
    colors: [
      { name: "Neon Green", hex: "#39ff14", image: "images/shoes/zenith_carbon_green.png" }
    ],
    gender: "Unisex",
    availability: "In Stock",
    brand: "Carbon Elite",
    material: "Knit",
    technology: "Carbon Plate",
    popularity: 98,
    dateAdded: "2026-05-15"
  },
  {
    id: "stridex-quantum-gym",
    name: "StrideX Quantum Trainer",
    category: "Gym & Training",
    price: 130,
    originalPrice: null,
    rating: 4.6,
    reviewsCount: 215,
    badge: "Hot",
    description: "Unshakable stability. Crafted with a wide heel base and high-traction honeycomb outsoles, the Quantum Trainer anchors you during heavy lifts while providing flexible responsive forefoot mechanics for dynamic cross-fit intervals.",
    specs: [
      { name: "Weight", value: "290g (Size 9)" },
      { name: "Midsole Drop", value: "4mm" },
      { name: "Support", value: "Lateral & Arch Wrap" },
      { name: "Cushioning", value: "Firm & Responsive" }
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    featured: true,
    colors: [
      { name: "Electric Blue", hex: "#0055ff", image: "images/shoes/quantum_gym_blue.png" }
    ],
    gender: "Men",
    availability: "In Stock",
    brand: "Quantum Pro",
    material: "Mesh",
    technology: "Active Foam",
    popularity: 88,
    dateAdded: "2026-04-10"
  },
  {
    id: "stridex-nova-sneaker",
    name: "StrideX Nova Sneaker",
    category: "Lifestyle",
    price: 150,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 310,
    badge: null,
    description: "Premium comfort for the modern explorer. Melding athletic performance with a clean, low-profile lifestyle silhouette, the Nova is dressed in high-grade leather, detailed nubuck overlays, and sits on a plush dual-density comfort sockliner.",
    specs: [
      { name: "Weight", value: "310g (Size 9)" },
      { name: "Midsole Drop", value: "10mm" },
      { name: "Support", value: "Ergonomic Comfort" },
      { name: "Cushioning", value: "Plush Everyday" }
    ],
    sizes: [6, 7, 8, 9, 10, 11],
    featured: true,
    colors: [
      { name: "Ice White", hex: "#f8f9fa", image: "images/shoes/nova_sneaker_white.png" }
    ],
    gender: "Women",
    availability: "In Stock",
    brand: "Nova Air",
    material: "Premium Leather",
    technology: "Active Foam",
    popularity: 92,
    dateAdded: "2026-03-20"
  },
  {
    id: "stridex-air-glide",
    name: "StrideX Air Glide",
    category: "Basketball",
    price: 195,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 82,
    badge: "Exclusive",
    description: "Rule the court. The Air Glide features an integrated mid-foot strap system and full-length shock-absorption air cells, ensuring explosive vertical liftoffs, padded landings, and lockdown ankle protection for aggressive drives.",
    specs: [
      { name: "Weight", value: "360g (Size 9)" },
      { name: "Midsole Drop", value: "5mm" },
      { name: "Support", value: "High-top Ankle Lock" },
      { name: "Cushioning", value: "Air Cushion Cell" }
    ],
    sizes: [8, 9, 10, 11, 12, 13],
    featured: false,
    colors: [
      { name: "Active Orange", hex: "#ff6600", image: "images/shoes/air_glide_orange.png" }
    ],
    gender: "Men",
    availability: "In Stock",
    brand: "StrideX",
    material: "Knit",
    technology: "Air Cushion",
    popularity: 85,
    dateAdded: "2026-02-15"
  },
  {
    id: "stridex-terra-trail",
    name: "StrideX Terra Trail",
    category: "Running",
    price: 165,
    originalPrice: 190,
    rating: 4.5,
    reviewsCount: 147,
    badge: "Sale",
    description: "Take on any terrain. Armed with a water-resistant ripstop shield, debris-guard collar, and aggressive multi-directional rubber lugs, the Terra Trail delivers superior traction and heavy-duty armor for wet, muddy, and rocky wilderness trials.",
    specs: [
      { name: "Weight", value: "315g (Size 9)" },
      { name: "Midsole Drop", value: "10mm" },
      { name: "Support", value: "Trail Armored Base" },
      { name: "Cushioning", value: "High-impact Cushion" }
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    featured: false,
    colors: [
      { name: "Olive Green", hex: "#556b2f", image: "images/shoes/terra_trail_olive.png" }
    ],
    gender: "Men",
    availability: "In Stock",
    brand: "Terra Gear",
    material: "Ripstop Nylon",
    technology: "Trail Lugs",
    popularity: 80,
    dateAdded: "2026-01-10"
  },
  {
    id: "stridex-velocity-pro",
    name: "StrideX Velocity Pro",
    category: "Running",
    price: 175,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 112,
    badge: "New",
    description: "Uncompromised pace. The Velocity Pro brings lightweight mesh overlays together with nitrogen foam cushions, generating a smooth heel-to-toe stride transition. Ideal for track runs and daily road pacing.",
    specs: [
      { name: "Weight", value: "238g (Size 9)" },
      { name: "Midsole Drop", value: "9mm" },
      { name: "Support", value: "Neutral Cushion" },
      { name: "Cushioning", value: "Active Response" }
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    featured: false,
    colors: [
      { name: "Active Orange", hex: "#ff6600", image: "images/shoes/apex_runner_orange.png" }
    ],
    gender: "Men",
    availability: "In Stock",
    brand: "StrideX",
    material: "Mesh",
    technology: "Active Foam",
    popularity: 87,
    dateAdded: "2026-06-25"
  },
  {
    id: "stridex-carbon-stealth",
    name: "StrideX Carbon Stealth",
    category: "Running",
    price: 250,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 63,
    badge: "Hot",
    description: "Ultimate stealth speed. The Carbon Stealth hides a full-length curved carbon fiber propulsion plate inside a charcoal blackout mesh. Engineered for racers looking to fly past competition unnoticed.",
    specs: [
      { name: "Weight", value: "192g (Size 9)" },
      { name: "Midsole Drop", value: "5mm" },
      { name: "Support", value: "Carbon Propelled" },
      { name: "Cushioning", value: "Plush Cushion" }
    ],
    sizes: [8, 9, 10, 11, 12],
    featured: false,
    colors: [
      { name: "Pitch Black", hex: "#121212", image: "images/shoes/zenith_carbon_black.png" }
    ],
    gender: "Men",
    availability: "Pre-order",
    brand: "Carbon Elite",
    material: "Knit",
    technology: "Carbon Plate",
    popularity: 97,
    dateAdded: "2026-06-20"
  },
  {
    id: "stridex-trainer-slate",
    name: "StrideX Trainer Slate",
    category: "Gym & Training",
    price: 125,
    originalPrice: null,
    rating: 4.5,
    reviewsCount: 174,
    badge: null,
    description: "Anchor your focus. Slate mesh wrapped with high lateral grip frames guarantees slip-free support during high-intensity gym drills, side squats, and daily training splits.",
    specs: [
      { name: "Weight", value: "285g (Size 9)" },
      { name: "Midsole Drop", value: "4mm" },
      { name: "Support", value: "Lateral Stability" },
      { name: "Cushioning", value: "Responsive Cushion" }
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    featured: false,
    colors: [
      { name: "Slate Gray", hex: "#5a5a5a", image: "images/shoes/quantum_gym_gray.png" }
    ],
    gender: "Unisex",
    availability: "In Stock",
    brand: "Quantum Pro",
    material: "Mesh",
    technology: "Active Foam",
    popularity: 82,
    dateAdded: "2026-05-01"
  },
  {
    id: "stridex-nova-dark",
    name: "StrideX Nova Dark",
    category: "Lifestyle",
    price: 145,
    originalPrice: 160,
    rating: 4.6,
    reviewsCount: 184,
    badge: "Sale",
    description: "Urban elegance. The Nova Dark puts premium black leather panels over an active foam outsole, providing all-day posture support for commuters and style-focused city walks.",
    specs: [
      { name: "Weight", value: "315g (Size 9)" },
      { name: "Midsole Drop", value: "10mm" },
      { name: "Support", value: "Comfort Arch" },
      { name: "Cushioning", value: "Plush Everyday" }
    ],
    sizes: [6, 7, 8, 9, 10, 11],
    featured: false,
    colors: [
      { name: "Carbon Black", hex: "#222222", image: "images/shoes/nova_sneaker_black.png" }
    ],
    gender: "Unisex",
    availability: "Out of Stock",
    brand: "Nova Air",
    material: "Premium Leather",
    technology: "Active Foam",
    popularity: 90,
    dateAdded: "2026-04-20"
  },
  {
    id: "stridex-glide-sky",
    name: "StrideX Glide Sky",
    category: "Basketball",
    price: 190,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 54,
    badge: "New",
    description: "Ascend with power. Outfitted in electric blue knit overlays with dual air-shock cushioning zones. Ideal for explosive basketball leaps and cushioned paint defense.",
    specs: [
      { name: "Weight", value: "355g (Size 9)" },
      { name: "Midsole Drop", value: "6mm" },
      { name: "Support", value: "Mid-top Collar Lock" },
      { name: "Cushioning", value: "Air Cushion Cell" }
    ],
    sizes: [8, 9, 10, 11, 12, 13],
    featured: false,
    colors: [
      { name: "Electric Blue", hex: "#0055ff", image: "images/shoes/air_glide_blue.png" }
    ],
    gender: "Men",
    availability: "In Stock",
    brand: "StrideX",
    material: "Knit",
    technology: "Air Cushion",
    popularity: 86,
    dateAdded: "2026-06-15"
  },
  {
    id: "stridex-terra-phantom",
    name: "StrideX Terra Phantom",
    category: "Running",
    price: 170,
    originalPrice: null,
    rating: 4.6,
    reviewsCount: 92,
    badge: "Exclusive",
    description: "Master the dark wilderness. Water-resistant black ripstop shield wraps a rugged high-grip outsole. Defends your pace against wet dirt trails, jagged rocks, and mud.",
    specs: [
      { name: "Weight", value: "320g (Size 9)" },
      { name: "Midsole Drop", value: "10mm" },
      { name: "Support", value: "Rugged Guard Frame" },
      { name: "Cushioning", value: "Trail Cushion" }
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    featured: false,
    colors: [
      { name: "Pitch Black", hex: "#121212", image: "images/shoes/terra_trail_black.png" }
    ],
    gender: "Unisex",
    availability: "In Stock",
    brand: "Terra Gear",
    material: "Ripstop Nylon",
    technology: "Trail Lugs",
    popularity: 84,
    dateAdded: "2026-06-10"
  },
  {
    id: "stridex-socks",
    name: "StrideX Cushioned Athletic Socks",
    category: "Accessories",
    price: 15.00,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 312,
    badge: null,
    description: "Premium moisture-wicking synthetic socks. Provides targeted cushioning panels under the heel and forefoot to prevent blisters.",
    specs: [
      { name: "Material", value: "Polyester / Elastane Blend" },
      { name: "Cushioning", value: "Targeted Padding" }
    ],
    sizes: [9, 10, 11],
    featured: false,
    colors: [
      { name: "Orange", hex: "#ff6600", image: "images/shoes/apex_runner_orange.png" }
    ],
    gender: "Unisex",
    availability: "In Stock",
    brand: "StrideX",
    material: "Synthetic",
    technology: "Targeted Padding",
    popularity: 98,
    dateAdded: "2026-06-01"
  },
  {
    id: "stridex-cleaner",
    name: "StrideX Premium Shoe Cleanser V2",
    category: "Accessories",
    price: 22.00,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 154,
    badge: null,
    description: "Premium shoe cleansing solution. Safe on all mesh, knit, rubber, and leather surfaces. Keeps your shoes looking brand new.",
    specs: [
      { name: "Volume", value: "150ml" },
      { name: "Safety", value: "Bio-degradable Formula" }
    ],
    sizes: [1],
    featured: false,
    colors: [
      { name: "Universal", hex: "#ffffff", image: "images/shoes/nova_sneaker_white.png" }
    ],
    gender: "Unisex",
    availability: "In Stock",
    brand: "StrideX",
    material: "Fluid",
    technology: "Active Foam Cleaner",
    popularity: 92,
    dateAdded: "2026-06-01"
  }
];

// Helper to fetch product by ID
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}
