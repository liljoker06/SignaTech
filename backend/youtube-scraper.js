const youtubeSearch = require("youtube-search-without-api-key");
const fetch = require("node-fetch");

const GRAPHQL_URL = "http://localhost:4000/graphql";

async function insertVideo(titre, url) {
  const query = `
    mutation ($titre: String!, $url: String!) {
      createVideo(titre: $titre, url: $url) {
        id
      }
    }
  `;

  await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { titre, url }
    })
  });
}

(async () => {
  console.log("🚀 Scraping YouTube");

  const results = await youtubeSearch.search(
    "langue  des signes française",
    { limit: 50 }
  );

  let count = 0;

  for (const v of results) {
    if (!v.title || !v.url) continue;

    await insertVideo(v.title.trim(), v.url);
    count++;
  }

  console.log(`✅ ${count} vidéos traitées`);
})();
