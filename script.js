// script.js — JavaScript for Warrant Calculator

document.querySelectorAll('input[type="range"]').forEach(range => {
    const numberInput = document.getElementById(range.id.replace('Range', ''));
    range.addEventListener('input', () => numberInput.value = range.value);
    numberInput.addEventListener('input', () => range.value = numberInput.value);
});

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

document.getElementById('saveResults').addEventListener('click', () => {
    const results = [
        ['Black-Scholes Value', document.getElementById('bsValue').textContent],
        ['Dilution-Adjusted Value', document.getElementById('dilutedValue').textContent],
        ['Final Warrant Value', document.getElementById('finalValue').textContent],
        ['Intrinsic Value', document.getElementById('intrinsicValue').textContent],
        ['Time Value', document.getElementById('timeValue').textContent],
        ['Probability Stock > Strike', document.getElementById('probability').textContent],
        ['Leverage Ratio', document.getElementById('leverageRatio').textContent],
        ['Break-Even Stock Price', document.getElementById('breakEvenPrice').textContent],
    ];

    let csv = 'Metric,Value\n';
    results.forEach(row => csv += `${row[0]},${row[1]}\n`);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'warrant_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

function normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
}

function calculateWarrantPrice() {
    const S = parseFloat(document.getElementById('stockPrice').value);
    const K = parseFloat(document.getElementById('strikePrice').value);
    const v = parseFloat(document.getElementById('volatility').value) / 100;
    const r = parseFloat(document.getElementById('riskFreeRate').value) / 100;
    const T = parseFloat(document.getElementById('timeTilExercisable').value) / 365;
    const dilution = parseFloat(document.getElementById('dilutionFactor').value);

    const d1 = (Math.log(S / K) + (r + v * v / 2) * T) / (v * Math.sqrt(T));
    const d2 = d1 - v * Math.sqrt(T);

    const bsValue = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    const dilutedValue = bsValue * dilution;
    const finalValue = dilutedValue;
    const intrinsicValue = Math.max(0, S - K);
    const timeValue = finalValue - intrinsicValue;
    const probability = normalCDF(d2) * 100;
    const leverageRatio = S / finalValue;
    const breakEvenPrice = K + finalValue;

    document.getElementById('bsValue').textContent = `$${bsValue.toFixed(2)}`;
    document.getElementById('dilutedValue').textContent = `$${dilutedValue.toFixed(2)}`;
    document.getElementById('finalValue').textContent = `$${finalValue.toFixed(2)}`;
    document.getElementById('intrinsicValue').textContent = `$${intrinsicValue.toFixed(2)}`;
    document.getElementById('timeValue').textContent = `$${timeValue.toFixed(2)}`;
    document.getElementById('probability').textContent = `${probability.toFixed(1)}%`;
    document.getElementById('leverageRatio').textContent = `${leverageRatio.toFixed(2)}x`;
    document.getElementById('breakEvenPrice').textContent = `$${breakEvenPrice.toFixed(2)}`;

    updateChart(S, K, finalValue);
}

function updateChart(stockPrice, strikePrice, warrantPrice) {
    const ctx = document.getElementById('valueChart').getContext('2d');
    const stockPrices = [];
    const warrantValues = [];
    const intrinsicValues = [];
    const minPrice = Math.max(strikePrice * 0.5, 0);
    const maxPrice = strikePrice * 2;

    for (let price = minPrice; price <= maxPrice; price += (maxPrice - minPrice) / 20) {
        stockPrices.push(price);
        const ratio = price / stockPrice;
        const newWarrantValue = warrantPrice * ratio;
        warrantValues.push(newWarrantValue);
        intrinsicValues.push(Math.max(0, price - strikePrice));
    }

    if (window.valueChart) {
        window.valueChart.destroy();
    }

    window.valueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: stockPrices.map(p => p.toFixed(2)),
            datasets: [
                {
                    label: 'Warrant Value',
                    data: warrantValues,
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: 'Intrinsic Value',
                    data: intrinsicValues,
                    borderColor: 'green',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Stock Price'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}

document.getElementById('calculateBtn').addEventListener('click', calculateWarrantPrice);
calculateWarrantPrice();

