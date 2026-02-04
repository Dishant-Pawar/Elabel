# Product Form Auto-Fill Scripts

These scripts automatically fill the "Add New Product" form with predefined data.

## Product Data

The scripts will fill the following information:

**Basic Information:**
- Product Name: Prasad
- Brand: Enter brand name
- Net Volume: 750ml
- Vintage: 2020
- Wine Type: Red, White, Rosé
- Sugar Content: Dry, Semi-dry
- Appellation: Enter appellation
- Alcohol Content: 13.5%

**Nutritional Information:**
- Portion Size: 100ml
- Calories: Enter kcal
- Energy: Enter kJ
- Fat: 0g
- Carbohydrates: 2g
- Packaging Gases: Enter packaging gases

**Dietary Information:**
- ✓ Organic
- ✓ Vegetarian
- ✓ Vegan

**Operator Information:**
- Operator Type: Producer, Importer
- Operator Name: Enter operator name
- Operator Address: Camp
- Additional Operator Info: Enter additional operator information

**Product Identifiers:**
- Country of Origin: India
- SKU: Enter SKU
- EAN: Enter EAN barcode

**Links:**
- External Link: Enter external URL

---

## Usage Methods

### Method 1: Browser Console (Recommended for Development)

1. Open your product form page in the browser
2. Press `F12` to open Developer Tools
3. Go to the "Console" tab
4. Open the file `fill-product-form.js`
5. Copy the entire contents
6. Paste into the console
7. Press `Enter`
8. The form will be automatically filled

**Advantages:**
- Easy to debug
- Can see console logs
- Can modify the script easily

---

### Method 2: Bookmarklet (Recommended for Quick Use)

1. Open your browser's bookmarks/favorites
2. Create a new bookmark with any name (e.g., "Fill Product Form")
3. Open `fill-product-form-bookmarklet.txt`
4. Copy the ENTIRE JavaScript code (starts with `javascript:`)
5. Paste it as the URL/Location of the bookmark
6. Save the bookmark

**To Use:**
1. Navigate to the product form page
2. Click the bookmarklet in your bookmarks bar
3. The form will be filled automatically
4. Review and submit

**Advantages:**
- One-click operation
- No need to open console
- Works on any page

---

### Method 3: Playwright/Puppeteer Automation

If you want to fully automate the process including form submission:

```bash
# Install Playwright if not already installed
pnpm add -D @playwright/test

# Run the automation script
pnpm playwright test scripts/fill-product-form.spec.ts
```

---

## Customizing the Data

To change the data that gets filled:

1. Open `fill-product-form.js`
2. Find the `productData` object (around line 88)
3. Modify the values as needed
4. Save the file
5. Use Method 1 or regenerate the bookmarklet for Method 2

Example:
```javascript
const productData = {
  productName: 'Your Product Name',
  brand: 'Your Brand',
  netVolume: '1000ml',
  // ... etc
};
```

---

## Troubleshooting

### Script doesn't fill all fields

The script tries multiple strategies to find form fields:
- By label text
- By input name
- By input ID

If some fields aren't filled:
1. Open browser console (F12)
2. Run the script
3. Look for warnings like "⚠ Could not find..."
4. Inspect the HTML of those fields
5. Update the script to match the actual field selectors

### Checkboxes not checking

Make sure the checkbox labels exactly match:
- "Organic"
- "Vegetarian"  
- "Vegan"

### Dropdown not selecting

For dropdowns like "Country of Origin", make sure:
1. The value exists in the dropdown options
2. The value matches exactly (case-sensitive)

---

## Security Notes

- These scripts only work on your local development/test environment
- Never run untrusted scripts in your browser console
- Review the script before using to ensure it only fills form fields
- The scripts do NOT submit forms automatically - you must review and submit manually

---

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify the form field names/IDs match the script
3. Update the script selectors if needed
4. Make sure JavaScript is enabled in your browser
