import type {ExtraDataType} from "@/server/api/routers/google";
import {Input} from "@/components/ui/input";


type Props = {
    value: Required<ExtraDataType>["introduction"],
    onChange: (value: Props["value"]) => void
}

const IntroductionEdit = (props: Props) => (
    <div className="flex flex-col gap-2.5">
        <div className="flex flex-row gap-1.5 items-center">
            <Input className="max-w-3xs" value={props.value.anne} onChange={(value)=>props.onChange({...props.value,anne: value.target.value})} />
            <div>Anne</div>
        </div>
        <div className="flex flex-row gap-1.5 items-center">
            <Input className="max-w-3xs" value={props.value.fabienne} onChange={(value)=>props.onChange({...props.value,fabienne: value.target.value})} />
            <div>Fabienne</div>
        </div>
    </div>
)

export default IntroductionEdit;