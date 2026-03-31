function initSimulatorForm() {
    const formEl = document.getElementById('simuForm');
    const messageEl = document.getElementById('simuMessage');
    const resultEl = document.getElementById('simuResult');
    const resultFinalCapitalEl = document.getElementById('resultFinalCapital');
    const resultTotalInterestEl = document.getElementById('resultTotalInterest');
    const resultTotalContributionEl = document.getElementById('resultTotalContribution');
    const fieldIds = ['initialCapital', 'annualRate', 'monthlyContribution', 'years'];

    if (!formEl || !messageEl) {
        return;
    }

    const currencyFormatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 2
    });

    function showError(message) {
        messageEl.textContent = message;
        messageEl.classList.remove('hidden');
    }

    function clearError() {
        messageEl.textContent = '';
        messageEl.classList.add('hidden');
    }

    function hideResult() {
        if (!resultEl) {
            return;
        }

        resultEl.classList.add('hidden');
    }

    function showResult(finalCapital, totalInterest, totalContribution) {
        if (!resultEl || !resultFinalCapitalEl || !resultTotalInterestEl || !resultTotalContributionEl) {
            return;
        }

        resultFinalCapitalEl.textContent = 'Capital final : ' + currencyFormatter.format(finalCapital);
        resultTotalInterestEl.textContent = 'Interets totaux : ' + currencyFormatter.format(totalInterest);
        resultTotalContributionEl.textContent = 'Total des versements : ' + currencyFormatter.format(totalContribution);
        resultEl.classList.remove('hidden');
    }

    function parseNumber(value) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) {
            return null;
        }

        return parsed;
    }

    function validateField(fieldId, rawValue) {
        const value = parseNumber(rawValue);

        if (value === null || value <= 0) {
            return 'Ce champ doit contenir un nombre positif.';
        }

        if (fieldId === 'annualRate' && value > 40) {
            return 'Le rendement annuel ne peut pas depasser 40%.';
        }

        if (fieldId === 'years' && (value < 5 || value > 50)) {
            return "Le nombre d'annees doit etre entre 5 et 50.";
        }

        return '';
    }

    function computeProjection(initialCapital, annualRatePercent, monthlyContribution, years) {
        const monthlyRate = (annualRatePercent / 100) / 12;
        const totalMonths = years * 12;
        const startYear = new Date().getFullYear();

        let patrimoine = initialCapital;
        let cumulativeContributions = 0;
        const graphData = [];
        const labels = [];
        const dataVersements = [];
        const dataInterets = [];
        const capitalInitial = [];

        for (let month = 1; month <= totalMonths; month += 1) {
            patrimoine += monthlyContribution;
            cumulativeContributions += monthlyContribution;
            patrimoine += patrimoine * monthlyRate;

            const cumulativeInterests = patrimoine - initialCapital - cumulativeContributions;

            graphData.push({
                month: month,
                capitalInitial: initialCapital,
                interetsCumules: cumulativeInterests,
                versementsCumules: cumulativeContributions
            });

            if (month % 12 === 0) {
                const yearIndex = (month / 12) - 1;
                labels.push(startYear + yearIndex);
                dataVersements.push(Number(cumulativeContributions.toFixed(2)));
                dataInterets.push(Number(cumulativeInterests.toFixed(2)));
                capitalInitial.push(Number(initialCapital.toFixed(2)));
            }
        }

        return {
            finalCapital: patrimoine,
            totalInterest: patrimoine - initialCapital - cumulativeContributions,
            totalContribution: cumulativeContributions,
            graphData: graphData,
            chartData: {
                labels: labels,
                dataVersements: dataVersements,
                dataInterets: dataInterets,
                capitalInitial: capitalInitial
            }
        };
    }

    fieldIds.forEach(function (fieldId) {
        const inputEl = document.getElementById(fieldId);

        if (!inputEl) {
            return;
        }

        // Vide le champ si la valeur est invalide quand on quitte l'input.
        inputEl.addEventListener('blur', function () {
            const value = String(inputEl.value || '').trim();

            if (!value) {
                return;
            }

            const error = validateField(fieldId, value);
            if (error) {
                inputEl.value = '';
                hideResult();
                showError(error);
                return;
            }

            clearError();
        });
    });

    formEl.addEventListener('submit', function (e) {
        e.preventDefault();

        for (let i = 0; i < fieldIds.length; i += 1) {
            const fieldId = fieldIds[i];
            const inputEl = document.getElementById(fieldId);
            const value = String((inputEl && inputEl.value) || '').trim();

            if (!value) {
                hideResult();
                showError('Tous les champs sont obligatoires.');
                return;
            }

            const error = validateField(fieldId, value);
            if (error) {
                hideResult();
                showError(error);
                return;
            }
        }

        clearError();

        const formData = new FormData(formEl);
        const data = Object.fromEntries(formData.entries());
        const initialCapital = Number(data.initialCapital);
        const annualRate = Number(data.annualRate);
        const monthlyContribution = Number(data.monthlyContribution);
        const years = Number(data.years);

        const projection = computeProjection(initialCapital, annualRate, monthlyContribution, years);

        // Validation temporaire des donnees mensuelles en console.
        console.log('Graph data (mensuel):', projection.graphData);
        console.log('Chart data (annuel):', projection.chartData);

        showResult(projection.finalCapital, projection.totalInterest, projection.totalContribution);
        updateChartWithProjection(projection.chartData);
    });
}

let simulatorChart = null;

function ensureSimulatorChart() {
    const chartEl = document.getElementById('simulatorChart');

    if (!chartEl || typeof Chart === 'undefined') {
        return null;
    }

    if (!simulatorChart) {
        const currencyFormatter = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        });

        simulatorChart = new Chart(chartEl, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Capital initial',
                        data: [],
                        borderColor: '#60a5fa',
                        backgroundColor: 'rgba(96, 165, 250, 0.30)',
                        fill: true,
                        stack: 'total',
                        tension: 0.25,
                        pointRadius: 0
                    },
                    {
                        label: 'Versements cumules',
                        data: [],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.32)',
                        fill: true,
                        stack: 'total',
                        tension: 0.25,
                        pointRadius: 0
                    },
                    {
                        label: 'Interets cumules',
                        data: [],
                        borderColor: '#34d399',
                        backgroundColor: 'rgba(52, 211, 153, 0.35)',
                        fill: true,
                        stack: 'total',
                        tension: 0.25,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(148, 163, 184, 0.15)' }
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            color: '#cbd5e1',
                            callback: function (value) {
                                return currencyFormatter.format(value);
                            }
                        },
                        grid: { color: 'rgba(148, 163, 184, 0.15)' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.dataset.label + ': ' + currencyFormatter.format(context.parsed.y);
                            }
                        }
                    }
                }
            }
        });
    }

    return simulatorChart;
}

function updateChartWithProjection(chartData) {
    const chart = ensureSimulatorChart();
    if (!chart) {
        return;
    }

    chart.data.labels = chartData.labels;
    chart.data.datasets[0].data = chartData.capitalInitial;
    chart.data.datasets[1].data = chartData.dataVersements;
    chart.data.datasets[2].data = chartData.dataInterets;
    chart.update();
}

function bootstrapSimulator() {
    initSimulatorForm();
    ensureSimulatorChart();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapSimulator);
} else {
    bootstrapSimulator();
}
