import {z} from "zod";
import {ListOfBookTypes} from "@/lib/utils";

export const isbnSchema = z.string().refine(
    (val) => {
        const cleaned = val.replace(/[-\s]/g, ""); // Remove hyphens/spaces
        return /^(?:\d{9}[\dXx]|\d{13})$/.test(cleaned);
    },
    {
        message: "Invalid ISBN format",
    },
);

export const typesSchema = z.array(z.enum(ListOfBookTypes)).max(3)

export const guestSchema = z.object({
    name: z.string().min(3),
    youtube: z.string().url().optional(),
    twitch: z.string().url().optional(),
    x: z.string().url().optional(),
});