import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import chartConfig from "@/modules/attendances/infrastructure/ui/components/overview/ChartConfig.tsx";
import {SlidingNumber} from "@/components/motion-primitives/sliding-number.tsx";
import {useId} from "react";

const OverviewLegend = ({overview}: { overview: Record<PropertyKey, number> }) => {
    const id = useId();
    return <Table>
        <TableHeader>
            <TableRow>
                {Object.values(chartConfig).map((value, index) => (
                    <TableHead key={'header-' + id + '-' + index}>
                        <svg className='inline-block w-5 h-5'>
                            <rect
                                x="0"
                                y="0"
                                width="1rem"
                                height="1rem"
                                fill={value.color}
                            />
                        </svg>
                        <span className="text-muted-foreground">{value.label}</span>
                    </TableHead>
                ))}
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                {Object.values(overview).map((value, index) => (
                    <TableCell key={'cell-' + id + '-' + index} className='text-[clamp(0.75rem,0.75rem+1vw,1.25rem)]'>
                        <SlidingNumber value={value} padStart={true}/>
                    </TableCell>
                ))}
            </TableRow>
        </TableBody>
    </Table>

}

export default OverviewLegend