// ==========================================================
// Hybrid Multi-Provider Storage Router
// Routes, balances, and resolves storage links across 100% free tiers
// Without requiring any credit card or payment method verification!
// ==========================================================

export async function onRequestGet(context) {
  const { request, env, json } = context;
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const rawUrl = url.searchParams.get("url") || "";

  // Provider configuration catalog
  const providers = [
    {
      id: "youtube",
      name: "YouTube Unlisted / Private Embeds",
      category: "Video Streaming",
      free_tier: "Unlimited storage & 100% free streaming bandwidth",
      requires_card: false,
      status: "active",
      description: "Best for course video lectures. Zero bandwidth costs, automatic 1080p/720p/480p transcoding, zero buffering."
    },
    {
      id: "github_releases",
      name: "GitHub Releases CDN",
      category: "Digital ZIP Files & Templates",
      free_tier: "Up to 2GB per file release, unlimited bandwidth",
      requires_card: false,
      status: "active",
      description: "Ultra-fast global CDN for website themes and Android Studio project ZIP files."
    },
    {
      id: "supabase",
      name: "Supabase Free Storage",
      category: "Course Attachments & PDFs",
      free_tier: "1 GB free storage & 2 GB bandwidth / month",
      requires_card: false,
      status: "active",
      description: "S3-compatible bucket for lesson cheat sheets, assignment files, and course notes."
    },
    {
      id: "cloudinary",
      name: "Cloudinary Free Media Tier",
      category: "Thumbnails & Short Clips",
      free_tier: "25 GB monthly bandwidth & transformations",
      requires_card: false,
      status: "active",
      description: "Auto-responsive course thumbnails, badges, and video preview snippets."
    },
    {
      id: "d1_fallback",
      name: "Cloudflare D1 Edge Fallback",
      category: "Code & Text Metadata",
      free_tier: "5 Million reads / day, 100k writes / day",
      requires_card: false,
      status: "active",
      description: "Zero-latency database storage fallback."
    }
  ];

  // URL Normalizer & Resolver
  function resolveStreamingEmbed(inputUrl) {
    if (!inputUrl) return { embedUrl: "", type: "empty" };

    // YouTube regex detection
    const ytMatch = inputUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      return {
        type: "youtube",
        videoId: ytMatch[1],
        embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3`,
        provider: "YouTube (Free Unlisted)"
      };
    }

    // Direct MP4 / WebM
    if (inputUrl.endsWith(".mp4") || inputUrl.endsWith(".webm") || inputUrl.includes("supabase.co") || inputUrl.includes("cloudinary.com")) {
      return {
        type: "video_file",
        embedUrl: inputUrl,
        provider: "Direct Cloud CDN"
      };
    }

    return {
      type: "custom",
      embedUrl: inputUrl,
      provider: "External Media"
    };
  }

  if (rawUrl) {
    return json({
      resolved: resolveStreamingEmbed(rawUrl)
    });
  }

  return json({
    providers,
    active_count: providers.length
  });
}
