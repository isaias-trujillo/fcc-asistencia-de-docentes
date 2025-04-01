import { ChartContainer } from "@/components/ui/chart.tsx";
import chartConfig from "@/modules/attendances/infrastructure/ui/components/overview/ChartConfig.tsx";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

const OverviewChart = ({
  data,
}: {
  data: Array<Record<PropertyKey, number>>;
}) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[250px]"
    >
      <RadialBarChart
        data={data}
        endAngle={180}
        innerRadius={80}
        outerRadius={160}
      >
        <PolarRadiusAxis tick={false} tickLine={true} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                const sum = data[0].asistencias + data[0].tardanzas;
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {sum}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground"
                    >
                      Alumnos
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="faltas"
          fill="var(--color-faltas)"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="tardanzas"
          fill="var(--color-tardanzas)"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="asistencias"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-asistencias)"
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
};

export default OverviewChart;
