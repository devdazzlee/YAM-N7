import { SVGProps } from 'react';
import clsx from 'clsx';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      width="260"
      height="87"
      fill="none"
      viewBox="0 0 260 87"
      className={clsx('group', props.className)}
      aria-labelledby="yam-n7-logo-title"
    >
      <title id="yam-n7-logo-title">YAM-N7</title>
      <text
        x="0"
        y="60"
        fill="currentColor"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="56"
        fontWeight="900"
        letterSpacing="1"
        className="transition-transform duration-500 ease-in-out group-hover:-translate-y-1"
      >
        YAM-N7
      </text>
    </svg>
  );
}
