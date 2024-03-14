import { BlogModel, Blog } from "../schemas/blog";

export const getAllBlogs = async (): Promise<Blog[]> => {
    try{
        const result = await BlogModel.find();
        return result;
    } catch (error) {
        throw new Error("Could not fetch resources");
    }
}

export const getSingleBlog = async (id: string): Promise<Blog> => {
    try{
        const result = await BlogModel.findById(id);
        if (!result) {
            throw new Error('Resource does not exist');
        } else {
            return result;
         }
        
    } catch (error) {
        throw new Error("Could not fetch resources");
    }
}

export const getBlogSearch = async (search: any): Promise<Blog[]> => {
    try {
        const result = await BlogModel.find({
            $or: [
              { title: { $regex: search, $options: 'i' }},
              { body: { $regex: search, $options: 'i' }}
            ],
        });
        return result;

    } catch (error) {
        throw new Error('Error fetching users');
    }
} 