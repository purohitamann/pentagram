"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Replace with your ShadCN button path
import { Input } from "@/components/ui/input"; // Replace with your ShadCN input path
import Post from "@/components/Post";
import { base } from "@/lib/sup";
import DialogBtn from "@/components/Dialog"; // Replace with your custom Dialog component path
import { Pentagon } from "lucide-react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]); // Store full image objects
  const [username, setUsername] = useState<string | null>(null); // Username state
  const [showDialog, setShowDialog] = useState(false); // Controls dialog visibility
  const supabase = base();

  /**
   * Fetch images from the Supabase database.
   */
  // Fetch images from the database
  async function fetchImages() {
    try {
      setIsLoading(true); // Show loading spinner during the fetch
      const { data: images, error } = await supabase
        .from("images")
        .select("id, image_url, prompt, likes, username, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching images:", error.message);
      } else {
        setImages(images || []); // Update state only if data is fetched successfully
      }
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  }

  // Fetch images immediately when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  /**
   * Increment likes for a specific image in Supabase.
   */
  async function handleLike(imageId: string) {
    const { data, error } = await supabase
      .from("images")
      .update({ likes: supabase.raw("likes + 1") })
      .eq("id", imageId);

    if (error) {
      console.error("Error updating likes:", error.message);
    } else {
      console.log("Likes updated:", data);
      // No need to fetch images here since real-time updates will handle it
    }
  }

  /**
   * Submit a prompt to generate an image.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Check if username is set; if not, show the dialog
    if (!username) {
      setShowDialog(true);
      return;
    }

    if (!inputText.trim()) return; // Do nothing if input is empty
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

      if (response.ok) {
        // Add the generated image to Supabase
        const { error } = await supabase.from("images").insert({
          image_url: data.image,
          prompt: inputText,
          likes: 0,
          username: username, // Use current username
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Error uploading to Supabase:", error.message);
        } else {
          console.log("Image added to Supabase");
          // No need to fetch images here since real-time updates will handle it
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

  // Callback to save the username from the dialog
  const handleSaveUser = async (newUsername: string, email: string) => {
    try {
      // Check if the username already exists
      const { data: existingUsers, error } = await supabase
        .from("users")
        .select("username")
        .eq("username", newUsername);

      if (error) {
        console.error("Error checking existing username:", error.message);
        return;
      }

      if (existingUsers.length > 0) {
        console.log("Username already exists.");
        setUsername(newUsername);
        setShowDialog(false);
      } else {
        // Create new user in Supabase
        const { error: createError } = await supabase.from("users").insert([
          { username: newUsername, email: email },
        ]);

        if (createError) {
          console.log("Error creating user:", createError.message);
        } else {
          console.log("User created successfully.");
          setUsername(newUsername);
          setShowDialog(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Set up real-time subscription for images
  useEffect(() => {

    const imagesSubscription = supabase.channel('realtime-images')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'images' }, (payload) => {
        const newImage = payload.new;
        setImages((prevImages) => [...prevImages, newImage]);
      })
      .subscribe()
      ;

    // Clean up subscription on unmount
    return () => {
      imagesSubscription.unsubscribe();
    };

  }, []);



  return (
    <>
      <div className="min-h-screen flex flex-col justify-between items-center p-8 space-y-4 bg-gray-900 text-white">
        {/* Header */}
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-3xl font-bold font-sans mb-4">Pentagram <Pentagon className="inline-block" /> Realtime Image Diffusion Model</h1>
          <p className="text-lg font-sans text-gray-300">
            Enter a prompt below to generate custom images with AI!
          </p>
        </div>

        {/* Generated Images */}
        <div className="flex-1 w-full max-w-3xl">
          {isLoading ? (
            <p className="text-center text-gray-400">Loading images...</p>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <Post
                  key={image.id}
                  id={image.id}
                  url={image.image_url}
                  prompt={image.prompt}
                  likes={image.likes}
                  username={image.username}
                  createdAt={image.created_at}
                  onLike={() => handleLike(image.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No images generated yet. Start by entering a prompt below!</p>
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
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 bg-blue-600 hover:bg-blue-500"
            >
              {isLoading ? "Generating..." : "Generate"}
            </Button>
            {showDialog && <DialogBtn onSave={handleSaveUser} />}
          </div>

        </form>

        {/* Dialog for Username Input */}

      </div>
    </>
  );
}
