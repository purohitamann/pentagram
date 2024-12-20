"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Replace with your ShadCN button path
import { Input } from "@/components/ui/input"; // Replace with your ShadCN input path
import Post from "@/components/Post";
import { base } from "@/lib/sup";
import { Pentagon } from "lucide-react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]); // Store full image objects
  const supabase = base();

  async function fetchImages() {
    const { data: images, error } = await supabase
      .from("images")
      .select("id, image_url, prompt, likes, username, created_at");

    if (error) {
      console.error("Error fetching images:", error.message);
    } else {
      setImages(images);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Add the image to Supabase
        const { error } = await supabase.from("images").insert({
          image_url: data.image,
          prompt: inputText,
          likes: 0,
          username: "johndoe", // Replace with actual username if available
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Error uploading to Supabase:", error.message);
        } else {
          console.log("Image added to Supabase");

          // Refresh images after successful insertion
          fetchImages();
        }
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between items-center p-8 space-y-4 bg-gray-900 text-white">
      {/* Header */}
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-md font-bold font-sans mb-4"> Pentagram <Pentagon className="inline mr-2" /> : Realtime Image Diffusion Model</h1>
        <p className="text-sm font-sans text-gray-300">
          Enter a prompt below to generate custom images with AI!
        </p>
      </div>

      {/* Generated Images */}
      <div className="flex-1 w-full max-w-3xl">
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <Post
                key={image.id}
                id={image.id}
                url={image.image_url}
                prompt={image.prompt}
                likes={image.likes}
                username={image.username}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No images generated yet. Start by entering a prompt below!
          </p>
        )}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4"
      >
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe the image you want to generate..."
            disabled={isLoading}
            className="flex-1 bg-gray-800 text-gray-300 border-gray-700 focus:ring-2 focus:ring-gray-500"
          />
          <Button type="submit" disabled={isLoading} className="px-6 bg-blue-600 hover:bg-blue-500">
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </form>
    </div>
  );
}
