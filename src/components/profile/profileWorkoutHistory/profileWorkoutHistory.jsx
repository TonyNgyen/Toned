import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import ActivityCalendar from "react-activity-calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import styles from "./profileWorkoutHistory.module.css";

function ProfileWorkoutHistory({ workoutHistory }) {
  const [data, setData] = useState();
  const [totalTime, setTotalTime] = useState();
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") === "dark"
      ? {
          dark: ["#e2e2e2", "#1e7bc8", "#1e7bc8"],
        }
      : {
          dark: ["#454545", "#bcdcf5", "#bcdcf5"],
        }
  );
  useEffect(() => {
    // Poll every second to detect `localStorage` theme change
    const interval = setInterval(() => {
      const theme = localStorage.getItem("theme");
      const newChartColor =
        theme === "dark"
          ? {
              dark: ["#e2e2e2", "#1e7bc8", "#1e7bc8"],
            }
          : {
              dark: ["#454545", "#bcdcf5", "#bcdcf5"],
            };
      setTheme(newChartColor);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const getData = () => {
      const currentYear = new Date().getFullYear();
      let prepareTime = 0;
      let prepareData = [];
      Object.keys(workoutHistory).map((workoutDate) => {
        if (workoutHistory[workoutDate].time != -1) {
          prepareData = [
            ...prepareData,
            {
              date: format(workoutDate, "yyyy-MM-dd"),
              count: workoutHistory[workoutDate].time,
              level: 2,
            },
          ];
          prepareTime += workoutHistory[workoutDate].time;
        } else {
          prepareData = [
            ...prepareData,
            {
              date: format(workoutDate, "yyyy-MM-dd"),
              count: workoutHistory[workoutDate].time,
              level: 1,
            },
          ];
        }
      });
      if (!(`01/01/${currentYear}` in Object.keys(workoutHistory))) {
        prepareData = [
          {
            count: 0,
            date: "2024-01-01",
            level: 0,
          },
          ...prepareData,
        ];
      }
      if (!(`12/31/${currentYear}` in Object.keys(workoutHistory))) {
        prepareData = [
          ...prepareData,
          {
            count: 0,
            date: "2024-12-31",
            level: 0,
          },
        ];
      }
      setData(prepareData);
      setTotalTime(prepareTime);
    };
    getData();
  }, []);
  const hours = Math.floor(totalTime / 3600);
  const minutes = Math.floor((totalTime % 3600) / 60);
  const seconds = Math.floor(totalTime % 60);
  return (
    <Card
      className={`p-4 md:flex md:flex-col bg-cardBG h-full border-exerciseBorder border-2`}
    >
      <CardTitle className="mb-4">Workout History</CardTitle>
      <CardContent className="">
        {
          <ActivityCalendar
            data={data}
            labels={{
              legend: {
                less: "Less",
                more: "More",
              },
              months: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              totalCount: `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")} total time in {{year}}`,
              weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            }}
            hideColorLegend
            maxLevel={2}
            theme={theme}
            blockSize={30}
            blockRadius={5}
          />
        }
      </CardContent>
    </Card>
  );
}

export default ProfileWorkoutHistory;
