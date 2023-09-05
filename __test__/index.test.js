import "@testing-library/jest-dom/extend-expect";
import { companyName } from "../utils/helpers";
import { cleanup, render } from "@testing-library/react";
// import {
//     ContactForm
// } from '../components/ContactForm';

afterEach(cleanup);

test("loads and displays greeting", async () => {
  expect(companyName).toBe("skincare");
  // const {
  //     getByLabelText,
  //     debug
  // } = render( < ContactForm / > )

  // debug()
});
