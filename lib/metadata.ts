import { Metadata } from "next";

interface CreateMetadataParams {
    description?: string;
    image?: string;
    title?: string;
}
export function createMetadata({description, image, title}: CreateMetadataParams): Metadata {
    return {
        twitter: {
            card: "summary",
            description,
            images: image,
            site: "Mini Blog",
            title,
        },

        openGraph: {
            description,
            images: image,
            title,
        }
    }
}