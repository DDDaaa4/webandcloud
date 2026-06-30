const countryNameMap = {
    USA: 'United States',
    'United States': 'United States',
    'South Korea': 'South Korea',
    Türkiye: 'Turkey',
    Turkiye: 'Turkey',
    Turkey: 'Turkey',
    Curacao: 'Curacao',
    'IR Iran': 'Iran',
    Iran: 'Iran',
    'Congo DR': 'Democratic Republic of the Congo',
    'Cote d\'Ivoire': 'Ivory Coast',
    'Ivory Coast': 'Ivory Coast'
};

async function getCountryInfo(req, res, next) {
    try {
        const rawName = req.params.name;

        if (!rawName) {
            return res.status(400).json({
                message: 'Country name is required.'
            });
        }

        const queryName = countryNameMap[rawName] || rawName;

        const apiUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(queryName)}&count=1&language=en&format=json`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            return res.status(502).json({
                message: 'External API request failed.'
            });
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return res.status(404).json({
                message: 'Country information not found from external API.'
            });
        }

        const result = data.results[0];

        return res.json({
            name: result.name || queryName,
            country: result.country || queryName,
            countryCode: result.country_code || '',
            timezone: result.timezone || '',
            latitude: result.latitude || null,
            longitude: result.longitude || null,
            source: 'Open-Meteo Geocoding API'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'External API request failed.',
            error: error.message
        });
    }
}

module.exports = { getCountryInfo };