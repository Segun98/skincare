import '@testing-library/jest-dom/extend-expect'
import {
    companyName
} from './../utils/helpers';


test('loads and displays greeting', async () => {
    expect(companyName).toBe("Tadlace")
})