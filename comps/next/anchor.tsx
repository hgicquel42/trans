import { AnchorProps } from "libs/react/props";
import Link from "next/link";

export function Anchor(props: AnchorProps) {
  const { href, ...others } = props
  if (!href) return null

  return <Link href={href} passHref>
    <a {...others} />
  </Link>
}