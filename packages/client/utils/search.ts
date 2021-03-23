import { DATA } from "@/config/data";
import distance from "@turf/distance";
import { Dayjs } from "dayjs";

export const checkSearchDate = (day: Dayjs) => (day.hour() > DATA.MAX_HOUR ? day.add(1, "day") : day);

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const calcDist = (from: Coordinates, to: Coordinates) =>
  distance([from.latitude, from.longitude], [to.latitude, to.longitude], {
    units: "kilometers",
  });
