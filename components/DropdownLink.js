import React from "react";
import Link from "next/link";

const DropdownLink = (props) => {
  let { href, children, ...args } = props;
  return (
    <Link href={href}>
      <a {...args}>{children}</a>
    </Link>
  );
};

export default DropdownLink;
