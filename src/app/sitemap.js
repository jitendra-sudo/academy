export default function sitemap() {
  const baseUrl = "https://www.mentormeritsacademy.in";

  // In a real app, you would fetch courses/lectures from your API here
  // to build dynamic paths. For now, we'll list the main static routes.
  
  const staticRoutes = [
    "",
    "/lectures",
    "/gallery",
    "/admin/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes];
}
