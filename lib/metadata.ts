import { Metadata } from "next";

interface CreateMetadataParams {
    description?: string;
    image?: string;
    imageAlt?: string;
    title?: string;
}
export function createMetadata({description, image = '', title, imageAlt = ''}: CreateMetadataParams): Metadata {
    return {
        title,
        description,
        twitter: {
            card: "summary",
            description,
            images: {url: image, alt: imageAlt},
            title,
        },

        openGraph: {
            description,
            images: {url: image, alt: imageAlt},
            title,
        }
    }
}