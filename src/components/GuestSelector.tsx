import { MultiSelect } from "@/components/ui/multi-select";
import { api } from "@/trpc/react";
import type { Guest } from "@/server/api/routers/google";

type Props = {
  value: Guest[];
  onChange: (value: Guest[]) => void;
};

const GuestSelector = (props: Props) => {
  const { data } = api.guest.getAllGuests.useQuery();

  return (
    <MultiSelect
      options={
        data?.map(({ name }) => ({
          value: name,
          label: name,
        })) ?? []
      }
      value={props.value.map(({ name }) => name)}
      onValueChange={(names) => {
        if (data)
          props.onChange(data.filter(({ name }) => names.includes(name)));
      }}
    />
  );
};

export default GuestSelector;
