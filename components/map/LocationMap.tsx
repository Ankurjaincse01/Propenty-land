"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "./LeafletMap";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[380px] items-center justify-center rounded-2xl border border-navy-100 bg-stone text-sm text-navy-400">
      Loading map…
    </div>
  ),
});

export default function LocationMap(props: {
  points: MapPoint[];
  zoom?: number;
  height?: number;
  radiusMeters?: number;
}) {
  if (!props.points || props.points.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-stone text-sm text-navy-400">
        Verified location map available on request.
      </div>
    );
  }
  return <LeafletMap {...props} />;
}
