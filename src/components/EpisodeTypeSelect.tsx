"use client"

import type {EpisodeTypes} from "@/server/api/routers/google";
import {ListOfEpisodeTypes} from "@/lib/utils";
import {ClockIcon, ComponentInstanceIcon, PersonIcon} from "@radix-ui/react-icons";
import {MultiSelect} from "@/components/ui/multi-select";


type EpisodeTypeSelectProps = {
    onChange: (types: EpisodeTypes[])=>void,
    values: EpisodeTypes[]
}

const EpisodeTypeSelect = (props: EpisodeTypeSelectProps) => (
        <MultiSelect
            options={ListOfEpisodeTypes.map((type)=>(
                {label: type, value: type,icon: type==="guest"?PersonIcon:type==="preview"?ClockIcon:ComponentInstanceIcon})
            )}
            onValueChange={(types)=>props.onChange(types as EpisodeTypes[])}
            defaultValue={props.values}
            placeholder="Select type"
            variant="inverted"
        />
    )

export default EpisodeTypeSelect;