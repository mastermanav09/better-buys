import React from "react";
import Cross from "./svg/Cross";

import {
  Box,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Rating from "@mui/material/Rating";

const FilterSidebar = ({
  toggleFilterSidebarHandler,
  ratings,
  allCategories,
  allBrands,
  categoryHandler,
  brandHandler,
  priceHandler,
  ratingHandler,
  category,
  brand,
  rating,
  price,
  prices,
}) => {
  return (
    <div
      className="w-60 h-full shadow-md bg-gray-50 fixed z-30 animate-slideLeft right-0 top-0 bottom-0 overflow-y-auto"
      onClick={(event) => event.stopPropagation()}
    >
      <Cross
        className="w-5 h-5 text-black mr-auto mt-4 mx-4 cursor-pointer"
        onClick={() => toggleFilterSidebarHandler(false)}
      />

      <section className="w-60 py-3 flex-col gap-3 block sm:hidden">
        <List>
          <ListItem>
            <Box className="w-full">
              <Typography style={{ fontSize: "0.85rem", color: "gray" }}>
                Categories
              </Typography>
              <Select
                fullWidth
                value={category}
                onChange={categoryHandler}
                variant="standard"
                className="text-xs"
              >
                <MenuItem value="all" className="text-xs">
                  All
                </MenuItem>
                {allCategories &&
                  allCategories.map((category) => (
                    <MenuItem
                      key={category}
                      value={
                        category.charAt(0).toLowerCase() + category.slice(1)
                      }
                      className="text-xs"
                    >
                      {category}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
          </ListItem>
          <ListItem>
            <Box className="w-full">
              <Typography style={{ fontSize: "0.85rem", color: "gray" }}>
                Brands
              </Typography>
              <Select
                fullWidth
                value={brand}
                onChange={brandHandler}
                variant="standard"
                className="text-xs"
              >
                <MenuItem value="all" className="text-xs">
                  All
                </MenuItem>
                {allBrands &&
                  allBrands.map((brand) => (
                    <MenuItem
                      key={brand}
                      value={brand.charAt(0).toLowerCase() + brand.slice(1)}
                      className="text-xs"
                    >
                      {brand}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
          </ListItem>
          <ListItem>
            <Box className="w-full">
              <Typography style={{ fontSize: "0.85rem", color: "gray" }}>
                Prices
              </Typography>
              <Select
                fullWidth
                value={price}
                onChange={priceHandler}
                variant="standard"
                className="text-xs"
              >
                <MenuItem value="all" className="text-xs">
                  All
                </MenuItem>
                {prices.map((price) => (
                  <MenuItem
                    key={price.value}
                    value={price.value}
                    className="text-xs"
                  >
                    {price.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </ListItem>
          <ListItem>
            <Box className="w-full">
              <Typography style={{ fontSize: "0.85rem", color: "gray" }}>
                Rating
              </Typography>
              <Select
                fullWidth
                value={rating}
                onChange={ratingHandler}
                variant="standard"
                className="text-xs"
              >
                <MenuItem value="all" className="text-xs">
                  All
                </MenuItem>
                {ratings.map((rating) => (
                  <MenuItem key={rating} value={rating} className="text-xs">
                    <div className="pointer-events-none flex items-center gap-1">
                      <Rating value={rating} readOnly className="text-xl" />
                      <Typography component="span">&amp; Up</Typography>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </ListItem>
        </List>
      </section>
    </div>
  );
};

export default React.memo(FilterSidebar);
