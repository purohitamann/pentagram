import Post from '@/components/Post';
import { createClient } from '@/lib/supabase';
import { Pentagon } from 'lucide-react';

export default async function Countries() {
    const supabase = await createClient();
    const { data: users } = await supabase.from("users").select();
    const { data: images } = await supabase.from("images").select();
    const { data: comments } = await supabase.from("comments").select();
    const testImage = images ? images[0] : null;
    const testImage2 = images ? images[1] : null;
    return <>
        <div className="flex flex-col bg-slate-500">
            {images.map((image) => (
                <div key={image.id}>
                    {JSON.stringify(image, null, 2)}
                </div>
            ))}


        </div>
        <div>
            {JSON.stringify(comments, null, 2)}
        </div>

        {/* <div className="flex flex-col w-1/3 h-1/2 border-2 rounded-lg bg-beige fit-content p-4">
            <img src={testImage.image_url} alt={testImage.alt} />
            <div className="flex flex-row  justify-between pt-4">
                <div className='flex space-x-5'><Pentagon /> {testImage.likes}</div>
                <div >
                    {testImage.username}  </div>
            </div>
        </div> */}
        <Post image={testImage} />

        {/* <div>
            {JSON.stringify(images, null, 2)}</div>
        <div>
            {JSON.stringify(comments, null, 2)}</div>
        <div>
            {JSON.stringify(users, null, 2)}
        </div> */}
    </>
}