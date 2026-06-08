import { createIcon } from "@/components/ui/create-icon";

export const Logo = createIcon({
  viewBox: "0 0 256 256",
  path: (
    <>
      <circle cx="128" cy="128" fill="#8f3d32" r="112" />
      <circle cx="128" cy="128" fill="#b87318" r="102" />
      <circle cx="128" cy="128" fill="#4a3524" r="92" />

      <g fill="#f5c518" transform="translate(128 132)">
        <ellipse cx="0" cy="-30" rx="11" ry="24" />
        <ellipse cx="-20" cy="-10" rx="11" ry="24" transform="rotate(-32)" />
        <ellipse cx="20" cy="-10" rx="11" ry="24" transform="rotate(32)" />
        <ellipse cx="-14" cy="16" rx="11" ry="24" transform="rotate(-58)" />
        <ellipse cx="14" cy="16" rx="11" ry="24" transform="rotate(58)" />
      </g>
    </>
  ),
});
