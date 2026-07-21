import type { DigitalProduct, OfficeSupply } from "./types";

export const INITIAL_DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "book-01",
    slug: "the-business-plan",
    title: "The Business Plan",
    subtitle: "The founder's psychology guide.",
    price: 220,
    description:
      "The Business Plan is the definitive guide for entrepreneurs navigating the immense psychological pressures of building a startup. From managing imposter syndrome and overcoming the paralyzing fear of failure to maintaining mental clarity during high-stakes decisions, this book provides actionable strategies. Drawing on years of research and interviews with successful founders, it offers a roadmap to harness anxiety as a tool for growth, ensuring you can scale your business without sacrificing your mental health.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    accent: ["#8131f0", "#4a1c8a"],
    fileUrl: "https://cdn.hubology.com/files/the-business-plan.pdf",
    details: { publisher: "Asad Ujjaman", firstPublish: "December 30, 2026", edition: "2026", pages: 200 },
    rating: {
      average: 4.5,
      totalReviews: 120,
      reviews: [
        {
          id: "rev-001",
          reviewerName: "Arshad Bhuiyan",
          rating: 5,
          date: "12/12/2026",
          text: "This book completely changed my perspective on startup anxiety. The chapters on decision fatigue and managing investor expectations are incredibly practical. Highly recommended for any founder feeling overwhelmed.",
        },
        {
          id: "rev-002",
          reviewerName: "Marina Cole",
          rating: 4,
          date: "11/28/2026",
          text: "A must-read for any first-time founder. It felt like the author was speaking directly to my daily struggles. The actionable advice on reframing fear into a driving force is worth the price of the book alone.",
        },
      ],
    },
    createdAt: "2026-01-05T10:00:00Z",
    updatedAt: "2026-06-15T09:30:00Z",
  },
  {
    id: "book-02",
    slug: "the-cap-table-playbook",
    title: "The Cap Table Playbook",
    subtitle: "Ownership decisions that don't come back to bite you.",
    price: 180,
    description:
      "A practical walkthrough of cap table mechanics for first-time founders — equity splits, option pools, SAFEs, and the dilution math investors expect you to already understand before the term sheet arrives.",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    accent: ["#5cc8f5", "#1f7bb0"],
    fileUrl: "https://cdn.hubology.com/files/cap-table-playbook.pdf",
    details: { publisher: "Renee Okafor", firstPublish: "March 4, 2026", edition: "1st", pages: 156 },
    rating: {
      average: 4.7,
      totalReviews: 64,
      reviews: [
        {
          id: "rev-003",
          reviewerName: "Daniel Osei",
          rating: 5,
          date: "04/02/2026",
          text: "Wish I'd read this before our seed round. The SAFE conversion examples alone paid for the book.",
        },
      ],
    },
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-05-22T13:10:00Z",
  },
  {
    id: "template-01",
    slug: "investor-update-templates",
    title: "Investor Update Templates",
    subtitle: "12 months of ready-to-send monthly updates.",
    price: 45,
    description:
      "A set of twelve editable investor update templates, structured around the metrics investors actually want to see — burn, runway, key wins, and asks — so updates take minutes instead of hours.",
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
    accent: ["#34d399", "#0f9b6e"],
    fileUrl: "https://cdn.hubology.com/files/investor-update-templates.zip",
    details: { publisher: "Hubology Studio", firstPublish: "May 18, 2026", edition: "2026", pages: 24 },
    rating: {
      average: 4.3,
      totalReviews: 38,
      reviews: [],
    },
    createdAt: "2026-05-10T11:15:00Z",
    updatedAt: "2026-06-30T10:00:00Z",
  },
];

export const INITIAL_OFFICE_SUPPLIES: OfficeSupply[] = [
  {
    id: "tangible-01",
    slug: "premium-leather-binder",
    title: "Premium Leather Binder",
    subtitle: "Organize your startup documents in style.",
    price: 45,
    description:
      "A premium, handcrafted leather binder designed specifically for founders. Keep your term sheets, cap tables, and incorporation documents organized in one place. Features durable rings, multiple pockets for business cards, and a sleek minimalist design that looks great on any desk.",
    coverImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    details: { material: "Full-grain Leather", dimensions: "10 x 12 inches", weight: "1.2 lbs", inStock: true },
    rating: {
      average: 4.8,
      totalReviews: 45,
      reviews: [
        {
          id: "rev-004",
          reviewerName: "Alex Chen",
          rating: 5,
          date: "05/12/2026",
          text: "Absolutely love the quality. It feels premium and is exactly what I needed for my physical documents.",
        },
      ],
    },
    createdAt: "2026-01-18T09:00:00Z",
    updatedAt: "2026-06-08T12:20:00Z",
  },
  {
    id: "tangible-02",
    slug: "founder-desk-set",
    title: "Founder Desk Set",
    subtitle: "A matching pen, notepad holder, and card tray.",
    price: 68,
    description:
      "A three-piece brushed-brass desk set — pen, notepad holder, and business card tray — designed to look sharp on camera for investor calls and in person for office visits alike.",
    coverImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
    details: { material: "Brushed Brass & Walnut", dimensions: "8 x 6 x 2 inches", weight: "1.8 lbs", inStock: true },
    rating: {
      average: 4.6,
      totalReviews: 22,
      reviews: [],
    },
    createdAt: "2026-03-02T14:00:00Z",
    updatedAt: "2026-05-27T09:40:00Z",
  },
  {
    id: "tangible-03",
    slug: "ergonomic-laptop-stand",
    title: "Ergonomic Laptop Stand",
    subtitle: "Built for founders living out of their laptop.",
    price: 52,
    description:
      "An aluminum, foldable laptop stand that raises your screen to eye level, tested for stability on planes, coffee shop tables, and everywhere in between.",
    coverImage: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    details: { material: "Aircraft-grade Aluminum", dimensions: "10 x 9 x 1.5 inches", weight: "1.0 lbs", inStock: false },
    rating: {
      average: 4.4,
      totalReviews: 31,
      reviews: [
        {
          id: "rev-005",
          reviewerName: "Nadia Farouk",
          rating: 4,
          date: "06/03/2026",
          text: "Sturdy and light. Only wish it came in a matte black finish.",
        },
      ],
    },
    createdAt: "2026-02-14T10:30:00Z",
    updatedAt: "2026-07-01T08:05:00Z",
  },
];
