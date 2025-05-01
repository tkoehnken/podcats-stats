import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value?: string;
  onValueChange: (value: "Anne"|"Fabienne") => void;
};

const SelectPresenter = (props: Props) => (
  <Select value={props.value} onValueChange={props.onValueChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select a presenter" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Presenters</SelectLabel>
        <SelectItem value="Anne">Anne</SelectItem>
        <SelectItem value="Fabienne">Fabienne</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

export default SelectPresenter;
