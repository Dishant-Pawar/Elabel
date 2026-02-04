/**
 * Auto-fill Product Form Script
 * 
 * Usage:
 * 1. Open the "Add New Product" page in your browser
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter to execute
 */

(function() {
  console.log('🚀 Starting auto-fill script...');

  // Helper function to set input value and trigger events
  function setInputValue(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));
      console.log(`✓ Set ${selector} = ${value}`);
      return true;
    }
    console.warn(`⚠ Could not find element: ${selector}`);
    return false;
  }

  // Helper function to set input by name attribute
  function setInputByName(name, value) {
    const element = document.querySelector(`input[name="${name}"]`);
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));
      console.log(`✓ Set input[name="${name}"] = ${value}`);
      return true;
    }
    console.warn(`⚠ Could not find input with name: ${name}`);
    return false;
  }

  // Helper function to set input by label text
  function setInputByLabel(labelText, value) {
    const labels = Array.from(document.querySelectorAll('label'));
    const label = labels.find(l => l.textContent.trim().includes(labelText));
    if (label) {
      const input = label.querySelector('input, textarea, select') || 
                    document.querySelector(`#${label.getAttribute('for')}`);
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
        console.log(`✓ Set "${labelText}" = ${value}`);
        return true;
      }
    }
    console.warn(`⚠ Could not find input for label: ${labelText}`);
    return false;
  }

  // Helper function to check a checkbox by label text
  function checkCheckboxByLabel(labelText) {
    const labels = Array.from(document.querySelectorAll('label'));
    const label = labels.find(l => l.textContent.trim().includes(labelText));
    if (label) {
      const checkbox = label.querySelector('input[type="checkbox"]') || 
                       document.querySelector(`#${label.getAttribute('for')}`);
      if (checkbox) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`✓ Checked "${labelText}"`);
        return true;
      }
    }
    console.warn(`⚠ Could not find checkbox for label: ${labelText}`);
    return false;
  }

  // Helper function to select dropdown option by label text
  function selectDropdownByLabel(labelText, value) {
    const labels = Array.from(document.querySelectorAll('label'));
    const label = labels.find(l => l.textContent.trim().includes(labelText));
    if (label) {
      const select = label.querySelector('select') || 
                     document.querySelector(`#${label.getAttribute('for')}`);
      if (select) {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`✓ Selected "${labelText}" = ${value}`);
        return true;
      }
    }
    console.warn(`⚠ Could not find select for label: ${labelText}`);
    return false;
  }

  // Product data to fill
  const productData = {
    // Basic Information
    name: 'Prasad',
    brand: 'Enter brand name',
    netVolume: '750ml',
    vintage: '2020',
    wineType: 'Red, White, Rosé',
    sugarContent: 'Dry, Semi-dry',
    appellation: 'Enter appellation',
    alcoholContent: '13.5%',
    
    // Nutritional Information
    portionSize: '100ml',
    kcal: 'Enter kcal',
    kj: 'Enter kJ',
    fat: '0g',
    carbohydrates: '2g',
    packagingGases: 'Enter packaging gases',
    
    // Dietary Information (checkboxes)
    organic: true,
    vegetarian: true,
    vegan: true,
    
    // Operator Information
    operatorType: 'Producer, Importer',
    operatorName: 'Enter operator name',
    operatorAddress: 'Camp',
    operatorInfo: 'Enter additional operator information',
    
    // Product Identifiers
    countryOfOrigin: 'India',
    sku: 'Enter SKU',
    ean: 'Enter EAN barcode',
    imageUrl: '',
    
    // Links
    externalLink: 'Enter external URL',
    redirectLink: ''
  };

  // Wait a bit for page to be ready
  setTimeout(() => {
    console.log('📝 Filling form fields...');
    
    // Try multiple strategies to fill each field
    
    // Basic Information
    setInputByLabel('Product Name', productData.name) ||
      setInputByName('name', productData.name) ||
      setInputValue('#name', productData.name);
    
    setInputByLabel('Brand', productData.brand) ||
      setInputByName('brand', productData.brand) ||
      setInputValue('#brand', productData.brand);
    
    setInputByLabel('Net Volume', productData.netVolume) ||
      setInputByName('netVolume', productData.netVolume) ||
      setInputValue('#netVolume', productData.netVolume);
    
    setInputByLabel('Vintage', productData.vintage) ||
      setInputByName('vintage', productData.vintage) ||
      setInputValue('#vintage', productData.vintage);
    
    setInputByLabel('Wine Type', productData.wineType) ||
      setInputByName('wineType', productData.wineType) ||
      setInputValue('#wineType', productData.wineType);
    
    setInputByLabel('Sugar Content', productData.sugarContent) ||
      setInputByName('sugarContent', productData.sugarContent) ||
      setInputValue('#sugarContent', productData.sugarContent);
    
    setInputByLabel('Appellation', productData.appellation) ||
      setInputByName('appellation', productData.appellation) ||
      setInputValue('#appellation', productData.appellation);
    
    setInputByLabel('Alcohol Content', productData.alcoholContent) ||
      setInputByName('alcoholContent', productData.alcoholContent) ||
      setInputValue('#alcoholContent', productData.alcoholContent);
    
    // Nutritional Information
    setInputByLabel('Portion Size', productData.portionSize) ||
      setInputByName('portionSize', productData.portionSize) ||
      setInputValue('#portionSize', productData.portionSize);
    
    setInputByLabel('Calories', productData.kcal) ||
      setInputByName('kcal', productData.kcal) ||
      setInputValue('#kcal', productData.kcal);
    
    setInputByLabel('Energy', productData.kj) ||
      setInputByName('kj', productData.kj) ||
      setInputValue('#kj', productData.kj);
    
    setInputByLabel('Fat', productData.fat) ||
      setInputByName('fat', productData.fat) ||
      setInputValue('#fat', productData.fat);
    
    setInputByLabel('Carbohydrates', productData.carbohydrates) ||
      setInputByName('carbohydrates', productData.carbohydrates) ||
      setInputValue('#carbohydrates', productData.carbohydrates);
    
    setInputByLabel('Packaging Gases', productData.packagingGases) ||
      setInputByName('packagingGases', productData.packagingGases) ||
      setInputValue('#packagingGases', productData.packagingGases);
    
    // Dietary Information (checkboxes)
    if (productData.organic) {
      checkCheckboxByLabel('Organic');
    }
    if (productData.vegetarian) {
      checkCheckboxByLabel('Vegetarian');
    }
    if (productData.vegan) {
      checkCheckboxByLabel('Vegan');
    }
    
    // Operator Information
    setInputByLabel('Operator Type', productData.operatorType) ||
      setInputByName('operatorType', productData.operatorType) ||
      setInputValue('#operatorType', productData.operatorType);
    
    setInputByLabel('Operator Name', productData.operatorName) ||
      setInputByName('operatorName', productData.operatorName) ||
      setInputValue('#operatorName', productData.operatorName);
    
    setInputByLabel('Operator Address', productData.operatorAddress) ||
      setInputByName('operatorAddress', productData.operatorAddress) ||
      setInputValue('#operatorAddress', productData.operatorAddress);
    
    setInputByLabel('Additional Operator', productData.operatorInfo) ||
      setInputByName('operatorInfo', productData.operatorInfo) ||
      setInputValue('#operatorInfo', productData.operatorInfo);
    
    // Product Identifiers
    setInputByLabel('Country of Origin', productData.countryOfOrigin) ||
      selectDropdownByLabel('Country of Origin', productData.countryOfOrigin) ||
      setInputByName('countryOfOrigin', productData.countryOfOrigin) ||
      setInputValue('#countryOfOrigin', productData.countryOfOrigin);
    
    setInputByLabel('SKU', productData.sku) ||
      setInputByName('sku', productData.sku) ||
      setInputValue('#sku', productData.sku);
    
    setInputByLabel('EAN', productData.ean) ||
      setInputByName('ean', productData.ean) ||
      setInputValue('#ean', productData.ean);
    
    // Image URL (skip file upload)
    setInputByLabel('Or enter image URL', productData.imageUrl) ||
      setInputByName('imageUrl', productData.imageUrl) ||
      setInputValue('#imageUrl', productData.imageUrl);
    
    // Links
    setInputByLabel('External Link', productData.externalLink) ||
      setInputByName('externalLink', productData.externalLink) ||
      setInputValue('#externalLink', productData.externalLink);
    
    setInputByLabel('Redirect Link', productData.redirectLink) ||
      setInputByName('redirectLink', productData.redirectLink) ||
      setInputValue('#redirectLink', productData.redirectLink);
    
    console.log('✅ Form filling complete!');
    console.log('Please review the fields and submit when ready.');
  }, 500);
})();
