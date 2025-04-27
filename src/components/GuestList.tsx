import Link from "next/link";
import SocialIcon from "@/components/SocialIcon";
import type { ExtraDataType } from "@/server/api/routers/google";

type Props = {
  value: Required<ExtraDataType>["guests"];
};

const GuestList = (props: Props) => (
  <div>
    {props.value.map((guest) => (
      <div
        key={guest.name}
        className="flex flex-row items-center justify-between gap-2"
      >
        <div className="flex flex-row gap-2">
          <div>{guest.name}</div>
        </div>
        <div className="flex flex-row gap-2">
          {guest.links?.map((link) => (
            <Link key={link.url} href={link.url} target="_blank">
              <SocialIcon icon={link.icon} />
            </Link>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default GuestList;
