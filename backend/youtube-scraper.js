const youtubeSearch = require("youtube-search-without-api-key");

(async () => {
  console.log("🚀 Scraping YouTube...");

  const results = await youtubeSearch.search(
    "language de signes françaises",
    { limit: 50 }
  );

  const videos = results.map(v => ({
    title: v.title,
    url: v.url
  }));

  console.table(videos);

  console.log(`\n✅ ${videos.length} vidéos récupérées`);
})();
