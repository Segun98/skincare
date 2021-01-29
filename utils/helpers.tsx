import { differenceInDays, formatDistance } from "date-fns";

export const companyName = "Tadlace";

//Adds commas to numbers
export function Commas(x: string | number) {
  if (!x) {
    return 0;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function truncate(str: string, length: number) {
  if (!str) {
    return str;
  }
  if (str.length > length) {
    return str.slice(0, length) + "...";
  } else {
    return str;
  }
}

export const nairaSign = <span>&#8358;</span>;

//formate date to get distance. e.g "3 days ago"
export function formatDate(date: string, suffix: boolean): string {
  //order date
  const toReadableString = new Date(parseInt(date));
  //order date - now
  let dateLib = formatDistance(toReadableString, new Date(), {
    addSuffix: suffix,
  });
  return dateLib;
}

export function differenceBetweenDates(date: string): number {
  //order date
  const toReadableString = new Date(parseInt(date));
  //order date - now
  let dateLib = differenceInDays(new Date(), toReadableString);
  return dateLib;
}

//return screen width
export function screenWidth(): number | 600 {
  let width = 600;

  if (typeof window === "object") {
    width = window.screen.width;
  }

  return width;
}

export const categoriesList = [
  "Treatment",
  "Growth Enhancers",
  "Moisturizers",
  "Growth Oils",
  "Hair Serums",
  "Wave Activators",
  "Edge Stylers",
  "Essential Oils",
  "Conditioners",
  "Shampoos",
  "Detanglers",
  "Curl Activators",
  "Hair Mask",
  "Body Serum",
  "Glow oil",
  "Body Toners ",
  "Essential oils",
  "Glow Tonics",
  "Lotions",
  "Moisturizers",
  "Exfoliators",
  "Treatments",
  "Hydrants",
  "Masque",
  "Sunscreens",
  "Face Toners",
  "Cleansers",
  "Face Serum",
  "Face Masque",
];

export const mainCategoriesList = [
  "Face Care",
  "Body Care",
  "Bath and Face wash",
  "Face and Body Devices",
  "Ultra Scents",
  "Hair Care",
];

export const categoriesLookup = {
  "Default List": [
    "Essential Oils",
    "Conditioners",
    "Shampoos",
    "Detanglers",
    "Curl Activators",
    "Hair Mask",
    "Body Serum",
    "Glow oil",
    "Body Toners",
    "Essential oils",
    "Glow Tonics",
    "Lotions",
    "Moisturizers",
    "Exfoliators",
    "Treatments",
    "Hydrants ",
    "Masque",
    "Sunscreens",
    "Face Toners",
    "Cleansers",
    "Face Serum",
  ],
  "Face Care": [
    "Treatments",
    "Exfoliators",
    "Face Toners",
    "Cleansers",
    "Face Serum",
    "Essential Oils",
    "Face Masque",
    "Moisturizers",
    "Sunscreens",
    "Hydrants ",
  ],
  "Body Care": [
    "Glow oil",
    "Body Toners",
    "Essential oils",
    "Glow Tonics",
    "Lotions",
    "Moisturizers",
    "Exfoliators",
    "Treatments",
    "Hydrants",
    "Masque",
    "Sunscreens",
  ],
  "Hair Care": [
    "Treatment",
    "Growth Enhancers",
    "Moisturizers",
    "Growth Oils",
    "Hair Serums",
    "Wave Activators",
    "Edge Stylers",
    "Essential Oils",
    "Conditioners",
    "Shampoos",
    "Detanglers",
    "Curl Activators",
    "Hair Mask",
  ],
};
