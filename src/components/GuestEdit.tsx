import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";;
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ListOfSocials } from "@/lib/utils";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import SocialIcon from "@/components/SocialIcon";
import {guestSchema} from "@/lib/zodSchemas";
import {api} from "@/trpc/react";


const GuestEdit = () => {
    const { mutateAsync } = api.guest.addNewGuest.useMutation();
  const form = useForm<z.infer<typeof guestSchema>>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      img: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof guestSchema>)=> {
      await mutateAsync(values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Guest</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input placeholder="https://img.url.de" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="gab-2 flex flex-col">
              {ListOfSocials.map((social) => (
                <div key={social} className="flex flex-row gap-2.5">
                  <SocialIcon icon={social} />
                  <FormField
                    control={form.control}
                    name={social}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={`https://${social}.com`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestEdit;
