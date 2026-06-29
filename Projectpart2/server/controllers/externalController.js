const countryNameMap = {
    USA: 'United States',
    'South Korea': 'Korea, Republic of',
    Türkiye: 'Turkey',
    Curacao: 'Curaçao',
    'IR Iran': 'Iran',
    'Congo DR': 'Democratic Republic of the Congo',
    'Cote d\'Ivoire': 'Ivory Coast'
};

async function getCountryInfo(req, res, next) {
    try {
        const rawName = req.params.name;
        const queryName = countryNameMap[rawName] || rawName;
        const apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(queryName)}?fullText=false`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            return res.status(404).json({ message: 'Country information not found from external API.' });
        }

        const countries = await response.json();
        const country = countries[0];

        return res.json({
            name: country.name?.common || rawName,
            officialName: country.name?.official || '',
            region: country.region || '',
            capital: Array.isArray(country.capital) ? country.capital[0] : '',
            population: country.population || 0,
            flag: country.flags?.png || country.flags?.svg || ''
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { getCountryInfo };
