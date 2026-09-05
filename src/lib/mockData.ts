import { Project, SiteSettings } from '@/types/database';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  hero: {
    headline: "AI-Powered Video Advertising. Director-Led Creative Execution.",
    subheadline: "Bridging commercial strategy, cinematic AI production, and creative technology to conceptualize and deliver high-converting video ads.",
    primary_cta_text: "Explore Selected Work",
    primary_cta_link: "#selected-work",
    secondary_cta_text: "Watch Showreel",
    secondary_cta_link: "#showreel"
  },
  showreel: {
    title: "2026 AI Creative Showreel",
    duration: "0:30",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Aether Pulse — Spatial Audio Headphones",
    slug: "aether-pulse-spatial-audio",
    client_spec: "Aether Tech (Spec Launch)",
    category: "Tech",
    description: "Cinematic product reveal highlighting precision acoustics, metallic micro-textures, and immersive spatial soundscapes.",
    thumbnail_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    hero_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    final_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "0:30",
    format: "16:9",
    role: "AI Creative Director & Producer",
    brief: "Introduce a flagship spatial audio headphone brand targeting audiophiles and tech enthusiasts looking for luxury design and acoustic precision.",
    advertising_objective: "Position Aether Pulse as an ultra-premium acoustic device through dark-mode lighting contrast, macro metallic rendering, and sound-matched camera motion.",
    creative_direction: "Dark futuristic studio aesthetic with volumetric lighting rays, deep cyan accent glows (#1683DF), high-contrast shadows, and slow-motion floating acoustic particles.",
    story_narrative: "The ad moves from macro intimate texture shots of the brushed aluminum earcups to floating audio wave visuals, culminating in a dramatic hero light reveal.",
    production_process: "Generated multi-prompt sequences using Google Flow for camera track & rotation, synthesized voiceover, synchronized ambient audio, and color-graded in Premiere Pro.",
    shot_breakdown: [
      {
        shot_number: 1,
        framing: "Macro Extreme Close-Up",
        description: "Brushed titanium housing reflecting ambient light",
        prompt_strategy: "Google Flow camera sweep across metal texture, 8k resolution, cinematic lighting",
        continuity_note: "Lock metallic reflection hue to #1683DF cyan"
      },
      {
        shot_number: 2,
        framing: "Medium Tracking Shot",
        description: "Headphones levitating gently amidst glowing acoustic particles",
        prompt_strategy: "Slow motion levitation, volumetric light beam, zero gravity environment",
        continuity_note: "Maintain consistent product silhouette"
      },
      {
        shot_number: 3,
        framing: "Wide Hero Lockup",
        description: "Full product reveal with glowing logo stamp and tagline reveal",
        prompt_strategy: "Center stage lighting surge, high contrast dark environment, sharp focus",
        continuity_note: "Final brand logo lockup placement"
      }
    ],
    tools_used: ["Google Flow", "Midjourney v6", "Adobe Premiere Pro", "ElevenLabs"],
    gallery_urls: ["https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"],
    is_featured: true,
    status: "published",
    display_order: 1
  },
  {
    id: "p2",
    title: "Elixir Noir — Craft Botanical Tonic",
    slug: "elixir-noir-botanical-tonic",
    client_spec: "Elixir Beverage Co.",
    category: "Beverage",
    description: "High-speed liquid motion, ice crystal condensation, and dark botanical aesthetics for a luxury mixology tonic.",
    thumbnail_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80",
    hero_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    final_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "0:20",
    format: "16:9",
    role: "AI Commercial Director",
    brief: "Drive brand perception for a premium botanical mixer targeting high-end bars and discerning home mixologists.",
    advertising_objective: "Evoke immediate thirst and luxury feel through phantom-style high-speed liquid physics, macro condensation, and rich amber/emerald color contrast.",
    creative_direction: "Moody, atmospheric bar setting. Macro focus on glass texture, carbonation effervescence, ice collision, and fresh botanical garnishes falling in slow motion.",
    story_narrative: "Opening with carbonated bubbles rushing upward in dark glass, transitioning to high-speed liquid pouring over hand-carved ice, finishing with the frosted bottle hero shot.",
    production_process: "Utilized Google Flow liquid simulation video generation with strict fluid dynamics prompting, post-edited with crisp sound effects (ice clink, fizz, splash).",
    shot_breakdown: [
      {
        shot_number: 1,
        framing: "Extreme Macro",
        description: "Effervescent carbonation bubbles rising inside dark amber glass",
        prompt_strategy: "1000fps phantom camera macro, glowing amber bubbles, rich bokeh background",
        continuity_note: "Keep bubble scale uniform"
      },
      {
        shot_number: 2,
        framing: "High-Speed Dynamic",
        description: "Botanical tonic splash colliding with ice sphere",
        prompt_strategy: "Fluid dynamics liquid splash, crystal clear ice sphere, studio lighting macro",
        continuity_note: "Liquid color match #1683DF warm amber contrast"
      },
      {
        shot_number: 3,
        framing: "Low Angle Hero",
        description: "Frosted bottle with condensation droplets rolling down emblem",
        prompt_strategy: "Low angle dramatic lighting, condensation water drops, sharp product label focus",
        continuity_note: "Label legibility lock"
      }
    ],
    tools_used: ["Google Flow", "Premiere Pro", "Luma Dream Machine", "Logic Pro X"],
    gallery_urls: ["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"],
    is_featured: true,
    status: "published",
    display_order: 2
  },
  {
    id: "p3",
    title: "Aura Cyber-Silk — Futuristic Fashion Lookbook",
    slug: "aura-cyber-silk-fashion",
    client_spec: "Aura Atelier (Spec)",
    category: "Fashion",
    description: "Editorial storytelling showcasing fluid cyber-silk garments, dynamic model movement, and visual character continuity.",
    thumbnail_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    hero_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    final_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "0:30",
    format: "16:9",
    role: "AI Fashion Director & Stylist",
    brief: "Position Aura Atelier as an avant-garde digital luxury house combining high fashion with tech-infused smart textiles.",
    advertising_objective: "Demonstrate consistency of garment texture, model identity, and editorial rhythm across cinematic runway and outdoor architectural environments.",
    creative_direction: "High-fashion editorial lighting, minimal brutalist architectural backdrops, shimmering iridescent textiles with dark cyan accents.",
    story_narrative: "A narrative walk through a minimalist concrete sanctuary as iridescent garments react to movement and ambient light in slow motion.",
    production_process: "Character reference embedding and garment seed locking in AI generation pipelines, paired with ambient fashion soundtrack and precise edit cuts.",
    shot_breakdown: [
      {
        shot_number: 1,
        framing: "Full Length Runway Walk",
        description: "Model gliding through brutalist concrete hallway wearing flowing cyber-silk cape",
        prompt_strategy: "Editorial runway camera tracking, flowing iridescent fabric physics, 4k 60fps",
        continuity_note: "Lock model facial structure & outfit texture"
      },
      {
        shot_number: 2,
        framing: "Medium Portrait Turn",
        description: "Model turns to camera as sunlight catches fiber-optic embroidery",
        prompt_strategy: "Vogue editorial portrait, fiber-optic light pulse, rim lighting",
        continuity_note: "Match facial features from Shot 1"
      },
      {
        shot_number: 3,
        framing: "Close-Up Fabric Macro",
        description: "Fingertips trailing across iridescent textile weave",
        prompt_strategy: "Macro textile close-up, iridescent light refraction, slow movement",
        continuity_note: "Weave texture continuity"
      }
    ],
    tools_used: ["Google Flow", "Midjourney v6", "Premiere Pro", "CapCut Pro"],
    gallery_urls: ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"],
    is_featured: true,
    status: "published",
    display_order: 3
  },
  {
    id: "p4",
    title: "Veloce Horizon — Electric Supercar Concept",
    slug: "veloce-horizon-electric-supercar",
    client_spec: "Veloce Motors",
    category: "Automotive",
    description: "Dynamic vehicle tracking, high-speed camera choreography, atmospheric weather transitions, and cinematic storytelling.",
    thumbnail_url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    hero_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    final_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "0:45",
    format: "16:9",
    role: "AI Director & Camera Choreographer",
    brief: "Create launch enthusiasm for an upcoming next-gen electric supercar, emphasizing sleek aerodynamics and instantaneous acceleration.",
    advertising_objective: "Convey raw speed and precise handling using dynamic low tracking shots, anamorphic lens flares, coastal highway environments, and roaring synthetic motor sound design.",
    creative_direction: "Cinematic anamorphic widescreen aesthetic, twilight golden hour lighting shifting into neon-lit coastal highway night scenes.",
    story_narrative: "The vehicle emerges from a mountain tunnel at sunrise, carving along coastal curves as daylight transitions to neon twilight, finishing with a silhouette headlights reveal.",
    production_process: "Multi-environment prompt mapping with vehicle asset consistency, speed ramps, synthesized electric motor sound design, and custom color pass.",
    shot_breakdown: [
      {
        shot_number: 1,
        framing: "Low Russian-Arm Tracking Shot",
        description: "Supercar accelerating out of mountain tunnel into golden hour sunburst",
        prompt_strategy: "Low angle car tracking shot, 35mm anamorphic lens flare, high speed road motion",
        continuity_note: "Vehicle paint: Midnight Blue metallic"
      },
      {
        shot_number: 2,
        framing: "Aerial Drone Chase",
        description: "Overhead tracking as supercar hugs coastal cliff turns",
        prompt_strategy: "FPV drone cinematic chase shot, coastal cliff road, sunset reflections on car hood",
        continuity_note: "Keep vehicle body proportions identical"
      },
      {
        shot_number: 3,
        framing: "Headlight Silhouette Lockup",
        description: "Aggressive front LED light signature igniting in dark studio glow",
        prompt_strategy: "Front grille close-up, sharp LED light strip ignition, dark background with cyan glow",
        continuity_note: "Final badge reveal"
      }
    ],
    tools_used: ["Google Flow", "Runway Gen-3", "Adobe Premiere Pro", "Audition"],
    gallery_urls: ["https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80"],
    is_featured: true,
    status: "published",
    display_order: 4
  },
  {
    id: "p5",
    title: "Lumina Skin — Radiance Serum (Direct Response)",
    slug: "lumina-skin-radiance-serum",
    client_spec: "Lumina Beauty",
    category: "Social Ad",
    description: "Short-form vertical video ad optimized for TikTok & IG Reels with a 3-second visual hook, fast pacing, kinetic text overlays, and high-converting CTA.",
    thumbnail_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    hero_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    final_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: "0:15",
    format: "9:16",
    role: "AI Video Ad Strategist & Editor",
    brief: "Drive direct e-commerce sales for a radiance face serum on TikTok and Instagram Reels targeting skincare conscious Gen-Z/Millennials.",
    advertising_objective: "Capitalize on social media user attention spans through a compelling 3-second macro skin transformation visual hook, fast-cut social pacing, kinetic text callouts, and clear CTA.",
    creative_direction: "Clean aesthetic skincare glow, bright soft-box lighting, vertical 9:16 framing, mobile-first typography and high-energy voiceover.",
    story_narrative: "Hook (0-3s): Macro droplet landing on skin creating an instant radiant glow aura. Body (3-12s): 3 key benefits with text popups. CTA (12-15s): Special discount & 'Shop Now' button callout.",
    production_process: "Targeted short-form prompt engineering, 9:16 aspect ratio optimization, animated text motion overlay integration, and high-energy voice synthesis.",
    shot_breakdown: [
      {
        shot_number: 1,
        framing: "9:16 Macro Hook (0-3s)",
        description: "Golden serum droplet contacting skin with radiating glow wave overlay",
        prompt_strategy: "9:16 vertical macro shot, liquid drop touching flawless glowing skin, high speed soft lighting",
        continuity_note: "Immediate visual hook engagement"
      },
      {
        shot_number: 2,
        framing: "Split Screen Benefit (3-9s)",
        description: "Dull vs Radiant transformation with kinetic text '72H Hydration'",
        prompt_strategy: "Vertical split portrait glow comparison, soft beauty lighting",
        continuity_note: "Text overlay placement top 30%"
      },
      {
        shot_number: 3,
        framing: "Product & CTA (9-15s)",
        description: "Dropper bottle hero shot with pulsing 'Get 20% Off Today' CTA badge",
        prompt_strategy: "Beauty product hero display, pastel background, sleek lighting",
        continuity_note: "Clear button overlay at bottom third"
      }
    ],
    tools_used: ["Google Flow", "CapCut Pro", "Midjourney v6", "ElevenLabs"],
    gallery_urls: ["https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=800&q=80"],
    is_featured: true,
    status: "published",
    display_order: 5
  }
];