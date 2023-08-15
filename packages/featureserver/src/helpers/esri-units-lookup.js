function esriUnitsLookup(unit) {
  switch (unit) {
    case 'inch':
      return 'esriInches';
    case 'foot':
      return 'esriFeet';
    case 'yard':
      return 'esriYards';
    case 'mile':
      return 'esriMiles';
    case 'millimetre':
    case 'millimeter':
      return 'esriMillimeters';
    case 'centimetre':
    case 'centimeter':
      return 'esriCentimeters';
    case 'metre':
    case 'meter':
      return 'esriMeters';
    case 'kilometre':
    case 'kilometer':
      return 'esriKilometers';
    case 'decimetre':
    case 'decimeter':
      return 'esriDecimeters';
    case 'degree':
      return 'esriDecimalDegrees';
    default:
      return 'esriUnknownUnits';
  }
}

module.exports = esriUnitsLookup;