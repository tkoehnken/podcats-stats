"use client"

import type {BookTypes} from "@/server/api/routers/google";
import {ListOfBookTypes} from "@/lib/utils";
import {MultiSelect} from "@/components/ui/multi-select";


type BookTypeSelectProps = {
    onChange: (types: BookTypes[])=>void,
    value: BookTypes[]
}

const BookTypeSelect = (props: BookTypeSelectProps) => (
        <MultiSelect
            options={ListOfBookTypes.map((type)=>(
                {label: type, value: type})
            )}
            onValueChange={(types)=>props.onChange(types as BookTypes[])}
            defaultValue={props.value}
            placeholder="Select type"
            variant="inverted"
        />
    )

export default BookTypeSelect;