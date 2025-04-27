"use client";
import type { Book, BookTypes } from "@/server/api/routers/google";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isbnSchema } from "@/lib/zodSchemas";

type AddBookProps = {
  addBook: (book: Book) => void;
  defaultType: BookTypes;
};

const formSchema = z.object({
  isbn: isbnSchema,
});

const AddBook = (props: AddBookProps) => {
  const { mutateAsync, isPending } = api.books.getByISBN.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isbn: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    props.addBook(await mutateAsync(values));
  }

  return (
    <div className="relative flex">
      <Form {...form}>
        <form
          className="flex flex-1 flex-col justify-between"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input placeholder="isbn" {...field} />
                  </FormControl>
                  <FormDescription hidden>
                    The ISBN from the Book to add.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-2xl">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default AddBook;
