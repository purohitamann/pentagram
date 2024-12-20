import { base } from "@/lib/sup";
import ClientImagePage from "./ClientImagePage";

export default async function ImagePage({ params }: { params: { imageId: string } }) {
    const supabase = base();

    // Fetch the image details
    const { data: com } = await supabase.from("comments").select().eq("image_id", params.imageId);
    const { data: img } = await supabase.from("images").select().eq("id", params.imageId);

    const image = img ? img[0] : null;
    const comments = com || [];

    if (!image) {
        return (
            <div className="p-8">
                <p>Loading...</p>
            </div>
        );
    }

    // Pass data to the client component
    return <ClientImagePage image={image} comments={comments} />;
}
