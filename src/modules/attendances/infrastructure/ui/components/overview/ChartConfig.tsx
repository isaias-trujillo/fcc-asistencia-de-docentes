import {ChartConfig} from "@/components/ui/chart.tsx";

export const chartConfig = {
    asistencias: {
        label: "Asistencias",
        color: "hsl(var(--chart-1))",
    },
    tardanzas: {
        label: "Tardanzas",
        color: "hsl(var(--chart-4))",
    },
    faltas: {
        label: "Faltas",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export default chartConfig