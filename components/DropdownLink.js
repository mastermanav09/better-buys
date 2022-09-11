import React, { forwardRef } from "react";
import Link from "next/link";

const DropdownLink = forwardRef(({ href, children, ...args }, ref) => {
  return (
    <Link href={href} passHref>
      <a {...args}>{children}</a>
    </Link>
  );
});

DropdownLink.displayName = "DropdownLink";
export default DropdownLink;
