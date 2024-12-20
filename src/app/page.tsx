// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch("/api/generate-image", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text: inputText }),
//       });

//       const data = await response.json();
//       console.log(data);
//       setInputText("");
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     // TODO: Update the UI here to show the images generated

//     <div className="min-h-screen flex flex-col justify-between p-8">
//       <main className="flex-1">{/* Main content can go here */}</main>

//       <footer className="w-full max-w-3xl mx-auto">
//         <form onSubmit={handleSubmit} className="w-full">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={inputText}
//               onChange={e => setInputText(e.target.value)}
//               className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
//               placeholder="Describe the image you want to generate..."
//               disabled={isLoading}
//             />
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="px-6 py-3 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50"
//             >
//               {isLoading ? "Generating..." : "Generate"}
//             </button>
//           </div>
//         </form>
//       </footer>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Replace with your ShadCN button path
import { Input } from "@/components/ui/input"; // Replace with your ShadCN input path
import { Card, CardContent } from "@/components/ui/card"; // Replace with your ShadCN card path

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      if (response.ok) {
        setGeneratedImages([...generatedImages, data.image]); // Add new image to the list
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="max-w-3xl w-full text-center mb-6">
        <h1 className="text-3xl font-bold mb-4">AI Image Generator</h1>
        <p className="text-lg">
          Enter a prompt below to generate custom images with AI!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe the image you want to generate..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading} className="px-6">
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </form>

      {generatedImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {generatedImages.map((url, index) => (
            <Card key={index} className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <img
                  src={url}
                  alt={`Generated Image ${index + 1}`}
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
