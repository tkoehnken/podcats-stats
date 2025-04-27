import { z } from "zod";

const PriceSchema = z.object({
    value: z.number(),
    country: z.string(),
    currency: z.string(),
    state: z.string(),
    type: z.string(),
    taxRate: z.string(),
    description: z.string().nullable(),
    priceReference: z.boolean(),
    fixedRetailPrice: z.boolean(),
    minQuantity: z.number().nullable(),
    provisional: z.boolean(),
    typeQualifier: z.string().nullable(),
});

const EditionSchema = z.object({
    text: z.string(),
    number: z.string().nullable(),
});

const ContributorSchema = z.object({
    name: z.string(),
    type: z.string(),
    biographicalNote: z.string().nullable(),
});

const DescriptionSchema = z.object({
    description: z.string(),
    containsHTML: z.boolean(),
});

const CollectionSchema = z.object({
    name: z.string(),
    sequence: z.string(),
    identifier: z.string(),
});

const RelatedProductSchema = z.object({
    title: z.string(),
    identifier: z.string(),
    productGroup: z.string(),
    fileFormat: z.string().nullable(),
});

export const ProductDetailsSchema = z.object({
    id: z.string(),
    identifier: z.string(),
    title: z.string(),
    subTitle: z.string().nullable(),
    contributor: z.any(), // Not used
    publisher: z.string(),
    productType: z.string(),
    productIcon: z.string(),
    productFormId: z.string(),
    productFileFormat: z.string().nullable(),
    edition: EditionSchema,
    publicationDate: z.string(),
    prices: z.array(PriceSchema),
    pricesAT: z.array(PriceSchema),
    unpricedItemCode: z.string().nullable(),
    coverUrl: z.string(),
    meta: z.any(),
    oesbNr: z.string().nullable(),
    contributors: z.array(ContributorSchema),
    originalTitle: z.string().nullable(),
    titleShort: z.string().nullable(),
    mainLanguages: z.array(z.string()),
    subLanguages: z.array(z.string()),
    originalLanguage: z.string().nullable(),
    numPages: z.number(),
    measurements: z.string(),
    mainDescriptions: z.array(DescriptionSchema),
    biographicalNotes: z.array(z.any()),
    contributorNotes: z.array(z.string()),
    mediaFiles: z.array(z.any()),
    extent: z.any(),
    illustrations: z.array(z.any()),
    containedItem: z.array(z.any()),
    collections: z.array(CollectionSchema),
    relatedProducts: z.array(RelatedProductSchema),
    publicationFrequency: z.string().nullable(),
    medium: z.string().nullable(),
    zisSubjectGroups: z.any(),
    hasAdvertising: z.boolean().nullable(),
    specialPriceText: z.string().nullable(),
});


export const getByISBN = async (isbn: string) => {
    const link = `https://buchhandel.de/jsonapi/productDetails/${isbn.replaceAll('-', '')}`;
    const response = await fetch(link);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await response.json();
    return {...ProductDetailsSchema.parse(json),link};
}
