/* eslint-disable @typescript-eslint/no-explicit-any */
import { allFeesAssessmentTypes, feesAssessmentTypes } from "@/lib/enums";
import { FeeAssessmentType } from "@/lib/generated/prisma/enums";
import { DashboardItems } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

type Raw = {
  month: string; // "1"–"12"
  type: FeeAssessmentType;
  amount: number;
};

const transform = (data: Raw[]) => {
  const fiscalMonths: number[] = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
  const months: Record<string, any> = {};
  fiscalMonths.forEach((m) => {
    months[m] = {
      date: String(m),
      [FeeAssessmentType.BUILDING_APPLICATION]: 0,
      [FeeAssessmentType.LAND_APPLICATION]: 0,
      [FeeAssessmentType.PENALTY]: 0,
      [FeeAssessmentType.INSPECTION]: 0,
    };
  });

  data.forEach((item) => {
    const month = item.month;
    const label = item.type;
    if (!label) return;
    months[month][label] += item.amount;
  });
  return fiscalMonths.map((m) => months[m]);
};

export default function SectionFeeChart({
  dashboardItem: {
    feesAssessment: { fees, start, end },
  },
}: {
  dashboardItem: DashboardItems;
}) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];
  const chartConfig: ChartConfig = Object.fromEntries(
    allFeesAssessmentTypes.map((type, index) => [
      type,
      {
        label: feesAssessmentTypes[type].title,
        color: colors[index % colors.length],
      },
    ]),
  );

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Fee Assessment</CardTitle>
          <CardDescription>
            Showing revenue from fees over the years
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* <pre>{JSON.stringify(fees, null, 2)}</pre> */}
        <ChartContainer
          config={chartConfig}
          className="min-h-64 max-h-250  h-full sm:max-h-64 w-full "
        >
          <BarChart
            accessibilityLayer
            responsive
            data={transform(fees)}
            margin={{
              top: 25,
              right: 0,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={"date"}
              tickMargin={2}
              tickFormatter={(value: Date) => formatDate(value, "MMM")}
              xAxisId={"month"}
            />
            <XAxis
              dataKey={"date"}
              xAxisId="quarter"
              axisLine={false}
              tickLine={false}
              interval={0}
              height={1}
              scale={"band"}
              tick={(tickProps) => {
                const {
                  x: xProp,
                  y: yProp,
                  payload,
                  width: widthProp,
                  visibleTicksCount,
                } = tickProps;
                const x = Number(xProp);
                const y = Number(yProp);
                const width = Number(widthProp);
                const { value, offset = 0 } = payload;
                const date = new Date(value);
                const month = date.getMonth();
                let fiscalQuarter = "0";
                if (month >= 6 && month <= 8)
                  fiscalQuarter = "1st"; // Jul-Sep
                else if (month >= 9 && month <= 11)
                  fiscalQuarter = "2nd"; // Oct-Dec
                else if (month >= 0 && month <= 2)
                  fiscalQuarter = "3rd"; // Jan-Mar
                else if (month >= 3 && month <= 5) fiscalQuarter = "4th"; // Apr-Jun
                const isLast = month === 5; // June, end of fiscal year

                // Place fiscal quarter label at the middle of the fiscal quarter
                if ([6, 9, 0, 3].includes(month)) {
                  const pathX =
                    Math.floor(
                      isLast
                        ? x - offset + width / visibleTicksCount
                        : x - offset,
                    ) + 0.5;
                  // first month of each fiscal quarter
                  return (
                    <>
                      <text
                        x={x + width / visibleTicksCount / 2 - offset}
                        y={y - 4}
                        textAnchor="start"
                        fill="var(--muted-foreground)"
                      >
                        {`${fiscalQuarter} Quarter`}
                      </text>
                      <path
                        d={`M${pathX},${y - 4}v${-35}`}
                        stroke="var(--warning)"
                      />
                    </>
                  );
                }
              }}
            />
            <YAxis
              tickLine={true}
              axisLine={true}
              tickFormatter={(value: number) => formatCurrency(value, "Ugx")}
            />
            <ChartTooltip
              content={(props) => {
                const dateValue = props.payload[0]?.payload?.["date"] || 0;
                return (
                  <ChartTooltipContent
                    {...props}
                    label={formatDate(dateValue, "MMMM")}
                    formatValueAsCurrency
                  />
                );
              }}
            />
            <ChartLegend
              className=" translate-y-8  sm:translate-y-0"
              content={<ChartLegendContent />}
            />
            {allFeesAssessmentTypes.map((type) => (
              <>
                <Bar
                  key={type}
                  dataKey={type}
                  fill={chartConfig[type]?.color}
                  name={chartConfig[type].label! as string}
                  radius={4}
                />
              </>
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="space-x-2 pt-4 text-sm inline *:inline">
        <div>{`FY${formatDate(start, "YYY")}/${formatDate(end, "YYY")}`}</div>
        <div className="text-sm text-muted-foreground  w-full">
          (Showing results from {formatDate(start, "PPPP")} to{" "}
          {formatDate(end, "PPPP")})
        </div>
      </CardFooter>
    </Card>
  );
}
