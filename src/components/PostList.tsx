"use client";

import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";

interface Post {
  _id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  imageUrl?: string;
  upvotes: number;
  interestedUsers: string[];
  createdAt: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading posts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">কমিউনিটি পোস্ট</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            _id={post._id}
            username={post.username}
            title={post.title}
            description={post.description}
            imageUrl={post.imageUrl}
            upvotes={post.upvotes}
            createdAt={new Date(post.createdAt)}
          />
        ))}
      </div>
    </div>
  );
};

export default PostList;
