const countryDataMap = {
    Mexico: { capital: 'Mexico City', countryCode: 'MX' },
    'South Africa': { capital: 'Pretoria', countryCode: 'ZA' },
    Japan: { capital: 'Tokyo', countryCode: 'JP' },
    Netherlands: { capital: 'Amsterdam', countryCode: 'NL' },
    Canada: { capital: 'Ottawa', countryCode: 'CA' },
    Brazil: { capital: 'Brasilia', countryCode: 'BR' },
    Germany: { capital: 'Berlin', countryCode: 'DE' },
    France: { capital: 'Paris', countryCode: 'FR' },
    Spain: { capital: 'Madrid', countryCode: 'ES' },
    England: { capital: 'London', countryCode: 'GB' },
    Portugal: { capital: 'Lisbon', countryCode: 'PT' },
    Argentina: { capital: 'Buenos Aires', countryCode: 'AR' },
    Croatia: { capital: 'Zagreb', countryCode: 'HR' },
    Morocco: { capital: 'Rabat', countryCode: 'MA' },
    Sweden: { capital: 'Stockholm', countryCode: 'SE' },
    Switzerland: { capital: 'Bern', countryCode: 'CH' },
    Uruguay: { capital: 'Montevideo', countryCode: 'UY' },
    Belgium: { capital: 'Brussels', countryCode: 'BE' },
    Ghana: { capital: 'Accra', countryCode: 'GH' },
    Senegal: { capital: 'Dakar', countryCode: 'SN' },
    Iran: { capital: 'Tehran', countryCode: 'IR' },
    USA: { capital: 'Washington', countryCode: 'US' },
    'United States': { capital: 'Washington', countryCode: 'US' },
    Australia: { capital: 'Canberra', countryCode: 'AU' },
    Turkey: { capital: 'Ankara', countryCode: 'TR' },
    Türkiye: { capital: 'Ankara', countryCode: 'TR' },
    Qatar: { capital: 'Doha', countryCode: 'QA' }
};

async function getCountryInfo(req, res) {
    try {
        const rawName = req.params.name;

        if (!rawName) {
            return res.status(400).json({
                message: 'Country name is required.'
            });
        }

        const countryInfo = countryDataMap[rawName] || {
            capital: rawName,
            countryCode: ''
        };

        const apiUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(countryInfo.capital)}&count=5&language=en&format=json`;

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

        const result =
            data.results.find((item) => item.country_code === countryInfo.countryCode) ||
            data.results[0];

        return res.json({
            country: rawName,
            capital: countryInfo.capital,
            city: result.name || countryInfo.capital,
            countryCode: result.country_code || countryInfo.countryCode || '',
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