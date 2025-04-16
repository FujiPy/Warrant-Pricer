// Main application JavaScript for Webulls Warrant Calculator
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initializeTabs();
    initializeInputs();
    initializeTooltips();
    initializeModals();
    initializePresets();
    initializeExportTools();
    
    // Run initial calculation
    calculateWarrant();
    
    // Set up event listeners for calculating and updating
    document.getElementById('calculateBtn').addEventListener('click', calculateWarrant);
    document.getElementById('resetBtn').addEventListener('click', resetParameters);
    document.getElementById('updateTimeAnalysis').addEventListener('click', updateTimeAnalysis);
    document.getElementById('updateSensitivity').addEventListener('click', updateSensitivityAnalysis);
    document.getElementById('runSimulation').addEventListener('click', runMonteCarloSimulation);
    document.getElementById('addScenario').addEventListener('click', addNewScenario);
    
    // Initialize charts
    initializeValueChart();
    
    // Initial time analysis
    updateTimeAnalysis();
    
    // Initial sensitivity analysis
    updateSensitivityAnalysis();
});

// ----------------
// UI Initialization
// ----------------

function initializeTabs() {
    const tabs = document.querySelectorAll('.tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and tab content
            document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            
            // Add active class to clicked tab and its content
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

function initializeInputs() {
    // Link range sliders to number inputs
    const rangeSliders = document.querySelectorAll('.range-slider');
    rangeSliders.forEach(slider => {
        const targetId = slider.id.replace('Range', '');
        const numberInput = document.getElementById(targetId);
        
        // Update number input when slider changes
        slider.addEventListener('input', function() {
            numberInput.value = this.value;
            // If this is in the main calculator, recalculate
            if (document.getElementById('calculator').classList.contains('active')) {
                calculateWarrant();
            }
        });
        
        // Update slider when number input changes
        numberInput.addEventListener('input', function() {
            slider.value = this.value;
            // If this is in the main calculator, recalculate
            if (document.getElementById('calculator').classList.contains('active')) {
                calculateWarrant();
            }
        });
    });
    
    // Handle increment/decrement buttons
    const incrementButtons = document.querySelectorAll('.increment');
    incrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const step = parseFloat(this.getAttribute('data-step'));
            const inputField = document.getElementById(targetId);
            inputField.value = (parseFloat(inputField.value) + step).toFixed(2);
            inputField.dispatchEvent(new Event('input'));
        });
    });
    
    const decrementButtons = document.querySelectorAll('.decrement');
    decrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const step = parseFloat(this.getAttribute('data-step'));
            const inputField = document.getElementById(targetId);
            inputField.value = (parseFloat(inputField.value) - step).toFixed(2);
            inputField.dispatchEvent(new Event('input'));
        });
    });
}

function initializeTooltips() {
    // Simple tooltip initialization
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            // Create tooltip element
            const tooltipText = document.createElement('div');
            tooltipText.classList.add('tooltip-text');
            tooltipText.textContent = this.getAttribute('title');
            tooltipText.style.position = 'absolute';
            tooltipText.style.backgroundColor = '#333';
            tooltipText.style.color = '#fff';
            tooltipText.style.padding = '5px 10px';
            tooltipText.style.borderRadius = '4px';
            tooltipText.style.fontSize = '14px';
            tooltipText.style.zIndex = '1000';
            tooltipText.style.maxWidth = '300px';
            
            // Position the tooltip
            const rect = this.getBoundingClientRect();
            tooltipText.style.top = (rect.bottom + 5) + 'px';
            tooltipText.style.left = rect.left + 'px';
            
            // Add to DOM
            document.body.appendChild(tooltipText);
            
            // Store reference to remove later
            this.tooltipElement = tooltipText;
        });
        
        tooltip.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                document.body.removeChild(this.tooltipElement);
                this.tooltipElement = null;
            }
        });
    });
}

function initializeModals() {
    // Save/Load modal
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const saveLoadModal = document.getElementById('saveLoadModal');
    const modalCloseBtn = saveLoadModal.querySelector('.close');
    const cancelBtns = saveLoadModal.querySelectorAll('.cancel-btn');
    
    saveBtn.addEventListener('click', function() {
        document.getElementById('modalTitle').textContent = 'Save Parameters';
        document.getElementById('saveForm').style.display = 'block';
        document.getElementById('loadForm').style.display = 'none';
        saveLoadModal.style.display = 'block';
    });
    
    loadBtn.addEventListener('click', function() {
        document.getElementById('modalTitle').textContent = 'Load Parameters';
        document.getElementById('saveForm').style.display = 'none';
        document.getElementById('loadForm').style.display = 'block';
        loadSavedParameters();
        saveLoadModal.style.display = 'block';
    });
    
    modalCloseBtn.addEventListener('click', function() {
        saveLoadModal.style.display = 'none';
    });
    
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            saveLoadModal.style.display = 'none';
        });
    });
    
    // Confirm save button
    document.getElementById('confirmSave').addEventListener('click', saveParameters);
    document.getElementById('confirmLoad').addEventListener('click', loadSelectedParameters);
    document.getElementById('deleteSelected').addEventListener('click', deleteSelectedParameters);
    
    // Help modal
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const helpModalCloseBtn = helpModal.querySelector('.close');
    
    helpBtn.addEventListener('click', function() {
        helpModal.style.display = 'block';
    });
    
    helpModalCloseBtn.addEventListener('click', function() {
        helpModal.style.display = 'none';
    });
    
    // Help modal tabs
    const helpTabs = helpModal.querySelectorAll('.tabs .tab');
    helpTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and tab content
            helpModal.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
            helpModal.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            
            // Add active class to clicked tab and its content
            this.classList.add('active');
            helpModal.querySelector(`#${tabName}`).classList.add('active');
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === saveLoadModal) {
            saveLoadModal.style.display = 'none';
        }
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });
}

function initializePresets() {
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const presetType = this.getAttribute('data-preset');
            loadPreset(presetType);
        });
    });
}

function initializeExportTools() {
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);
    document.getElementById('exportImage').addEventListener('click', exportChartImage);
}

// ----------------
// Chart Initialization
// ----------------

function initializeValueChart() {
    const ctx = document.getElementById('valueChart').getContext('2d');
    window.valueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Will be filled with stock prices
            datasets: [
                {
                    label: 'Warrant Value',
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                    data: []
                },
                {
                    label: 'Intrinsic Value',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                    data: []
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
                        text: 'Stock Price ($)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Warrant Value ($)'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Warrant Value vs Stock Price'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

// ----------------
// Calculation Functions
// ----------------

function calculateWarrant() {
    // Get parameters from inputs
    const params = getParameters();
    
    // Calculate Black-Scholes value
    const bsValue = blackScholesCall(
        params.stockPrice,
        params.strikePrice,
        params.riskFreeRate / 100,
        params.volatility / 100,
        params.timeToExpiration
    );
    
    // Dilution adjustment
    const dilutedValue = bsValue * params.dilutionFactor;
    
    // Illiquidity adjustment if still in minimum hold period
    let finalValue = dilutedValue;
    if (params.daysSinceListing < params.minimumHoldDays) {
        const illiquidityDiscount = params.illiquidityDiscount / 100;
        finalValue = dilutedValue * (1 - illiquidityDiscount);
    }
    
    // Calculate intrinsic value
    const intrinsicValue = Math.max(0, params.stockPrice - params.strikePrice);
    
    // Calculate time value
    const timeValue = finalValue - intrinsicValue;
    
    // Calculate probability stock > strike
    const d2 = calculateD2(
        params.stockPrice,
        params.strikePrice,
        params.riskFreeRate / 100,
        params.volatility / 100,
        params.timeToExpiration
    );
    const probability = cumulativeNormal(d2) * 100;
    
    // Calculate leverage ratio (approximate)
    const leverageRatio = calculateLeverageRatio(params, finalValue);
    
    // Calculate break-even price
    const breakEvenPrice = params.strikePrice + finalValue;
    
    // Update results
    document.getElementById('bsValue').textContent = '$' + bsValue.toFixed(2);
    document.getElementById('dilutedValue').textContent = '$' + dilutedValue.toFixed(2);
    document.getElementById('finalValue').textContent = '$' + finalValue.toFixed(2);
    document.getElementById('intrinsicValue').textContent = '$' + intrinsicValue.toFixed(2);
    document.getElementById('timeValue').textContent = '$' + timeValue.toFixed(2);
    document.getElementById('probability').textContent = probability.toFixed(1) + '%';
    document.getElementById('leverageRatio').textContent = leverageRatio.toFixed(2) + 'x';
    document.getElementById('breakEvenPrice').textContent = '$' + breakEvenPrice.toFixed(2);
    
    // Update chart
    updateValueChart(params, finalValue);
    
    return finalValue;
}

function updateValueChart(params, currentValue) {
    // Generate range of stock prices
    const minPrice = Math.max(params.strikePrice * 0.5, 1);
    const maxPrice = params.strikePrice * 2;
    const step = (maxPrice - minPrice) / 50;
    
    const stockPrices = [];
    const warrantValues = [];
    const intrinsicValues = [];
    
    for (let price = minPrice; price <= maxPrice; price += step) {
        stockPrices.push(price.toFixed(2));
        
        // Calculate warrant value at this stock price
        const bsValue = blackScholesCall(
            price,
            params.strikePrice,
            params.riskFreeRate / 100,
            params.volatility / 100,
            params.timeToExpiration
        );
        
        const dilutedValue = bsValue * params.dilutionFactor;
        
        // Apply illiquidity discount if applicable
        let finalValue = dilutedValue;
        if (params.daysSinceListing < params.minimumHoldDays) {
            const illiquidityDiscount = params.illiquidityDiscount / 100;
            finalValue = dilutedValue * (1 - illiquidityDiscount);
        }
        
        warrantValues.push(finalValue);
        
        // Calculate intrinsic value
        const intrinsicValue = Math.max(0, price - params.strikePrice);
        intrinsicValues.push(intrinsicValue);
    }
    
    // Update chart data
    window.valueChart.data.labels = stockPrices;
    window.valueChart.data.datasets[0].data = warrantValues;
    window.valueChart.data.datasets[1].data = intrinsicValues;
    
    // Add a point for current stock price
    const currentIndex = stockPrices.findIndex(p => parseFloat(p) >= params.stockPrice);
    if (currentIndex !== -1) {
        window.valueChart.data.datasets.push({
            label: 'Current',
            backgroundColor: '#ef4444',
            borderColor: '#ef4444',
            pointRadius: 6,
            pointHoverRadius: 8,
            pointStyle: 'circle',
            data: Array(stockPrices.length).fill(null)
        });
        
        window.valueChart.data.datasets[2].data[currentIndex] = currentValue;
    }
    
    window.valueChart.update();
}

function updateTimeAnalysis() {
    const params = getParameters();
    const stockGrowthRate = parseFloat(document.getElementById('stockGrowthRate').value) / 100;
    const volatilityDecay = parseFloat(document.getElementById('volatilityDecay').value) / 100;
    
    // Calculate warrant values over time
    const days = [0, 30, 90, 180, 365, 730, 1825];
    const timeLabels = days.map(d => d === 0 ? 'Now' : d + ' Days');
    
    const stockPrices = [];
    const warrantPrices = [];
    const intrinsicValues = [];
    const timeValues = [];
    const intrinsicPercentages = [];
    const leverageRatios = [];
