import { connectToDB } from "@utils/database";
import Prompt from '@models/prompt'
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

//GET
export const GET = async (request, {params})=>{
    try {
        await connectToDB();
        const prompt = await Prompt.findById(params.id).populate('creator');
        if(!prompt) return new Response("Prompt not found", {status:404})

        return new Response(JSON.stringify(prompt),{status:200})
    } catch (error) {
        return new Response("Failed to fetch all prompts", {status:500})
    }
}

//PATCH
export const PATCH = async (request, {params})=>{
const {prompt, tag} = await request.json();
try {
    await connectToDB();
    const existingPrompt = await Prompt.findByIdAndUpdate(params.id)

    if (!existingPrompt) return new Response("Prompt not found", {status:404})

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save()

    return new Response(JSON.stringify(existingPrompt), {status:200})
} catch (error) {
    return new Response("Failed to update prompt", {status:500})   
}
}

//DELETE
export const DELETE = async (request ,{params})=>{
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new Response("Unauthorized", { status: 401 });
        }

        await connectToDB();

        const prompt = await Prompt.findById(params.id);

        if (!prompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        if (prompt.creator.toString() !== session.user.id) {
            return new Response("Forbidden", { status: 403 });
        }

        await Prompt.findByIdAndDelete(params.id);

        return new Response("Prompt deleted successfully", {status:200})
    }
    catch(error){
        console.log(error)
        return new Response("Failed to delete prompt", {status:500})
    }
}