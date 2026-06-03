import { NextResponse } from "next/server";
import { getAllPosts, getAllProjects } from "@/lib/firebaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [posts, projects] = await Promise.all([
      getAllPosts(100),
      getAllProjects(),
    ]);

    const searchPosts = posts.map((p) => ({
      title: p.title,
      slug: p.slug,
      description: p.description || "",
    }));

    const searchProjects = projects.map((p) => ({
      name: p.name,
      slug: p.slug || p.id,
      description: p.description || "",
    }));

    return NextResponse.json(
      { posts: searchPosts, projects: searchProjects },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ posts: [], projects: [] }, { status: 500 });
  }
}
