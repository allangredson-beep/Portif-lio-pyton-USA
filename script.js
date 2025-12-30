
class GlobalCurrencyConverter {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.initializeEventListeners();
        this.initializeChart();
        this.initializeMarketData();
        this.loadSettings();
        this.updateDisplay();
    }

    initializeElements() {
        // Input Elements
        this.amountFrom = document.getElementById('amountFrom');
        this.amountTo = document.getElementById('amountTo');
        this.currencyFrom = document.getElementById('currencyFrom');
        this.currencyTo = document.getElementById('currencyTo');
        this.swapButton = document.getElementById('swapCurrencies');
        this.convertBtn = document.getElementById('convertBtn');
        this.quickConvertBtn = document.getElementById('quickConvertBtn');
        this.reverseBtn = document.getElementById('reverseBtn');
        
        // Display Elements
        this.currentRate = document.getElementById('currentRate');
        this.rateTimestamp = document.getElementById('rateTimestamp');
        this.sourceAmount = document.getElementById('sourceAmount');
        this.targetAmount = document.getElementById('targetAmount');
        this.exchangeRateDisplay = document.getElementById('exchangeRateDisplay');
        this.finalAmount = document.getElementById('finalAmount');
        this.transactionTime = document.getElementById('transactionTime');
        
        // Market Elements
        this.marketStatus = document.getElementById('marketStatusText');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.lastUpdate = document.getElementById('lastUpdate');
        this.footerUpdate = document.getElementById('footerUpdate');
        this.currencyPairs = document.getElementById('currencyPairs');
        
        // History Elements
        this.historyList = document.getElementById('historyList');
        this.historyFilter = document.getElementById('historyFilter');
        this.timeFilter = document.getElementById('timeFilter');
        this.exportHistoryBtn = document.getElementById('exportHistory');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        
        // Preset Buttons
        this.presetButtons = document.querySelectorAll('.preset-btn');
        
        // Chart Element
        this.trendChart = null;
        
        // Settings Elements
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.autoUpdateToggle = document.getElementById('autoUpdateToggle');
        this.notificationsToggle = document.getElementById('notificationsToggle');
        this.languageSelect = document.getElementById('languageSelect');
        this.numberFormat = document.getElementById('numberFormat');
        this.dataSource = document.getElementById('dataSource');
        this.apiKey = document.getElementById('apiKey');
        this.apiKeySection = document.getElementById('apiKeySection');
        
        // Calculator Elements
        this.projectValue = document.getElementById('projectValue');
        this.paymentCurrency = document.getElementById('paymentCurrency');
        this.platformFee = document.getElementById('platformFee');
        this.taxRate = document.getElementById('taxRate');
        this.calculateProjectBtn = document.getElementById('calculateProject');
        this.calcResults = document.getElementById('calcResults');
        
        // Market Insights
        this.marketInsight = document.getElementById('marketInsight');
        this.volatilityLevel = document.getElementById('volatilityLevel');
        this.volatilityText = document.getElementById('volatilityText');
        
        // Tab Elements
        this.tabs = document.querySelectorAll('.tab');
        this.tabPanes = document.querySelectorAll('.tab-pane');
    }

    initializeState() {
        // Supported currencies with flags and names
        this.currencies = {
            'USD': { name: 'US Dollar', flag: 'us', symbol: '$' },
            'EUR': { name: 'Euro', flag: 'eu', symbol: '€' },
            'GBP': { name: 'British Pound', flag: 'gb', symbol: '£' },
            'JPY': { name: 'Japanese Yen', flag: 'jp', symbol: '¥' },
            'CAD': { name: 'Canadian Dollar', flag: 'ca', symbol: 'C$' },
            'AUD': { name: 'Australian Dollar', flag: 'au', symbol: 'A$' },
            'CHF': { name: 'Swiss Franc', flag: 'ch', symbol: 'CHF' },
            'CNY': { name: 'Chinese Yuan', flag: 'cn', symbol: '¥' },
            'BRL': { name: 'Brazilian Real', flag: 'br', symbol: 'R$' },
            'MXN': { name: 'Mexican Peso', flag: 'mx', symbol: '$' },
            'INR': { name: 'Indian Rupee', flag: 'in', symbol: '₹' },
            'RUB': { name: 'Russian Ruble', flag: 'ru', symbol: '₽' },
            'ZAR': { name: 'South African Rand', flag: 'za', symbol: 'R' },
            'TRY': { name: 'Turkish Lira', flag: 'tr', symbol: '₺' },
            'KRW': { name: 'South Korean Won', flag: 'kr', symbol: '₩' }
        };

        // Major currency pairs for global markets
        this.majorPairs = [
            { from: 'EUR', to: 'USD', name: 'EUR/USD' },
            { from: 'USD', to: 'JPY', name: 'USD/JPY' },
            { from: 'GBP', to: 'USD', name: 'GBP/USD' },
            { from: 'USD', to: 'CHF', name: 'USD/CHF' },
            { from: 'USD', to: 'CAD', name: 'USD/CAD' },
            { from: 'AUD', to: 'USD', name: 'AUD/USD' },
            { from: 'NZD', to: 'USD', name: 'NZD/USD' },
            { from: 'EUR', to: 'GBP', name: 'EUR/GBP' },
            { from: 'EUR', to: 'JPY', name: 'EUR/JPY' },
            { from: 'GBP', to: 'JPY', name: 'GBP/JPY' }
        ];

        // Current exchange rates (initial values - will be updated from API)
        this.rates = {
            'USD': 1,
            'EUR': 0.92,
            'GBP': 0.79,
            'JPY': 149.50,
            'CAD': 1.36,
            'AUD': 1.52,
            'CHF': 0.88,
            'CNY': 7.15,
            'BRL': 5.15,
            'MXN': 18.50,
            'INR': 83.25,
            'RUB': 95.80,
            'ZAR': 19.25,
            'TRY': 28.75,
            'KRW': 1325.50
        };

        // Market insights data
        this.marketInsights = [
            "USD strengthening against emerging market currencies due to Fed policy",
            "EUR showing resilience despite economic headwinds in the Eurozone",
            "GBP volatile amid ongoing economic policy adjustments",
            "JPY remains weak due to Bank of Japan's yield curve control",
            "Commodity currencies (CAD, AUD) tracking oil and metal prices",
            "Emerging market currencies under pressure from global risk sentiment"
        ];

        // Historical data storage
        this.conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
        this.settings = JSON.parse(localStorage.getItem('converterSettings')) || this.getDefaultSettings();
        
        // Real-time update interval
        this.updateInterval = null;
        this.lastUpdateTime = new Date();
    }

    getDefaultSettings() {
        return {
            darkMode: true,
            autoUpdate: true,
            notifications: false,
            language: 'en',
            numberFormat: 'en-US',
            dataSource: 'fixer',
            apiKey: '',
            favoritePairs: ['EUR/USD', 'USD/JPY', 'GBP/USD']
        };
    }

    initializeEventListeners() {
        // Conversion events
        this.convertBtn.addEventListener('click', () => this.convertCurrency());
        this.quickConvertBtn.addEventListener('click', () => this.quickConvert());
        this.reverseBtn.addEventListener('click', () => this.reverseConversion());
        this.swapButton.addEventListener('click', () => this.swapCurrencies());
        
        // Input events
        this.amountFrom.addEventListener('input', () => this.updateConversion());
        this.currencyFrom.addEventListener('change', () => this.updateRates());
        this.currencyTo.addEventListener('change', () => this.updateRates());
        
        // Preset buttons
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = e.target.dataset.amount;
                this.amountFrom.value = amount;
                this.updateConversion();
            });
        });
        
        // History events
        this.exportHistoryBtn.addEventListener('click', () => this.exportHistory());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.historyFilter.addEventListener('change', () => this.filterHistory());
        this.timeFilter.addEventListener('change', () => this.filterHistory());
        
        // Tab events
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Settings events
        this.darkModeToggle.addEventListener('change', () => this.toggleDarkMode());
        this.autoUpdateToggle.addEventListener('change', () => this.toggleAutoUpdate());
        this.notificationsToggle.addEventListener('change', () => this.toggleNotifications());
        this.languageSelect.addEventListener('change', () => this.changeLanguage());
        this.numberFormat.addEventListener('change', () => this.changeNumberFormat());
        this.dataSource.addEventListener('change', () => this.changeDataSource());
        
        // Calculator events
        this.calculateProjectBtn.addEventListener('click', () => this.calculateProject());
        
        // Initialize with example
        setTimeout(() => {
            this.amountFrom.value = '1000';
            this.updateConversion();
        }, 1000);
    }

    initializeChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        // Sample data for trend chart
        const labels = Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const data = Array.from({length: 30}, () => 5.1 + (Math.random() - 0.5) * 0.2);

        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'USD/BRL',
                    data: data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(148, 163, 184, 0.2)'
                        },
                        ticks: {
                            color: '#94a3b8',
                            maxRotation: 0
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(148, 163, 184, 0.2)'
                        },
                        ticks: {
                            color: '#94a3b8',
                            callback: function(value) {
                                return value.toFixed(3);
                            }
                        }
                    }
                }
            }
        });
    }

    initializeMarketData() {
        this.updateMarketStatus();
        this.loadMajorPairs();
        this.updateMarketInsights();
        
        // Start auto-update if enabled
        if (this.settings.autoUpdate) {
            this.startAutoUpdate();
        }
        
        // Check market hours every minute
        setInterval(() => this.updateMarketStatus(), 60000);
    }

    updateMarketStatus() {
        const now = new Date();
        const hours = now.getUTCHours();
        const day = now.getUTCDay(); // 0 = Sunday, 1-5 = Monday-Friday
        
        // Forex market is open 24/5
        const isWeekend = day === 0 || day === 6;
        const isMarketOpen = !isWeekend;
        
        if (isMarketOpen) {
            this.marketStatus.textContent = 'OPEN';
            this.statusIndicator.className = 'status-indicator open';
            
            // Check major trading sessions
            if (hours >= 7 && hours < 16) {
                this.marketStatus.textContent = 'OPEN (London/NY Overlap)';
            } else if (hours >= 0 && hours < 9) {
                this.marketStatus.textContent = 'OPEN (Asia Session)';
            }
        } else {
            this.marketStatus.textContent = 'CLOSED (Weekend)';
            this.statusIndicator.className = 'status-indicator closed';
        }
        
        // Update timestamp
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZoneName: 'short' 
        });
        this.lastUpdate.textContent = `Last checked: ${timeString}`;
        this.footerUpdate.textContent = timeString;
    }

    async loadMajorPairs() {
        try {
            // In a real application, you would fetch this from an API
            // For demonstration, we'll use simulated data
            const pairsHTML = this.majorPairs.map(pair => {
                const baseRate = this.rates[pair.from];
                const quoteRate = this.rates[pair.to];
                const rate = quoteRate / baseRate;
                const change = (Math.random() - 0.5) * 0.5;
                const changePercent = (change / rate * 100).toFixed(2);
                
                return `
                    <div class="currency-pair">
                        <div class="pair-info">
                            <div class="pair-flag">
                                <span class="flag-icon flag-icon-${this.currencies[pair.from].flag}"></span>
                                <span class="flag-icon flag-icon-${this.currencies[pair.to].flag}"></span>
                            </div>
                            <span class="pair-name">${pair.name}</span>
                        </div>
                        <div class="pair-details">
                            <span class="pair-rate">${rate.toFixed(4)}</span>
                            <span class="pair-change ${change >= 0 ? 'positive' : 'negative'}">
                                ${change >= 0 ? '+' : ''}${changePercent}%
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
            
            this.currencyPairs.innerHTML = pairsHTML;
        } catch (error) {
            console.error('Error loading major pairs:', error);
            this.currencyPairs.innerHTML = '<div class="error">Unable to load market data</div>';
        }
    }

    updateMarketInsights() {
        const randomInsight = this.marketInsights[Math.floor(Math.random() * this.marketInsights.length)];
        const volatility = Math.random() * 100;
        
        this.marketInsight.innerHTML = `<p>${randomInsight}</p>`;
        this.volatilityLevel.style.width = `${volatility}%`;
        
        if (volatility < 33) {
            this.volatilityText.textContent = 'Low';
            this.volatilityLevel.style.background = 'linear-gradient(90deg, #10b981, #10b981)';
        } else if (volatility < 66) {
            this.volatilityText.textContent = 'Medium';
            this.volatilityLevel.style.background = 'linear-gradient(90deg, #10b981, #f59e0b)';
        } else {
            this.volatilityText.textContent = 'High';
            this.volatilityLevel.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
        }
    }

    async updateRates() {
        try {
            const fromCurrency = this.currencyFrom.value;
            const toCurrency = this.currencyTo.value;
            
            // Update flags
            this.updateCurrencyFlags();
            
            // Calculate current rate
            const rate = this.calculateRate(fromCurrency, toCurrency);
            
            // Update rate display
            this.currentRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
            this.exchangeRateDisplay.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
            
            // Update timestamp
            this.rateTimestamp.textContent = `Updated: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            
        } catch (error) {
            console.error('Error updating rates:', error);
            this.currentRate.textContent = 'Error loading rates';
        }
    }

    updateCurrencyFlags() {
        const fromFlag = document.querySelector('#currencyFrom + .currency-selector .flag-icon');
        const toFlag = document.querySelector('#currencyTo + .currency-selector .flag-icon');
        
        if (fromFlag && toFlag) {
            const fromCurrency = this.currencyFrom.value;
            const toCurrency = this.currencyTo.value;
            
            fromFlag.className = `flag-icon flag-icon-${this.currencies[fromCurrency]?.flag || 'us'}`;
            toFlag.className = `flag-icon flag-icon-${this.currencies[toCurrency]?.flag || 'br'}`;
        }
    }

    calculateRate(fromCurrency, toCurrency) {
        const fromRate = this.rates[fromCurrency] || 1;
        const toRate = this.rates[toCurrency] || 1;
        return toRate / fromRate;
    }

    formatCurrency(amount, currency, locale = this.settings.numberFormat) {
        const currencyInfo = this.currencies[currency];
        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        return formatter.format(amount);
    }

    async convertCurrency() {
        const amount = parseFloat(this.amountFrom.value);
        if (isNaN(amount) || amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return;
        }

        const fromCurrency = this.currencyFrom.value;
        const toCurrency = this.currencyTo.value;
        
        // Calculate conversion
        const rate = this.calculateRate(fromCurrency, toCurrency);
        const convertedAmount = amount * rate;
        
        // Update display
        this.amountTo.value = convertedAmount.toFixed(2);
        this.sourceAmount.textContent = this.formatCurrency(amount, fromCurrency);
        this.targetAmount.textContent = this.formatCurrency(convertedAmount, toCurrency);
        this.finalAmount.textContent = this.formatCurrency(convertedAmount, toCurrency);
        this.transactionTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Add to history
        this.addToHistory({
            id: Date.now(),
            fromCurrency,
            toCurrency,
            amount,
            rate,
            convertedAmount,
            timestamp: new Date().toISOString()
        });
        
        // Show success animation
        this.convertBtn.innerHTML = '<i class="fas fa-check"></i> Converted!';
        this.convertBtn.style.background = 'linear-gradient(45deg, #10b981, #059669)';
        
        setTimeout(() => {
            this.convertBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Convert Now';
            this.convertBtn.style.background = 'linear-gradient(45deg, #2563eb, #8b5cf6)';
        }, 2000);
    }

    updateConversion() {
        const amount = parseFloat(this.amountFrom.value);
        if (isNaN(amount) || amount <= 0) return;
        
        const fromCurrency = this.currencyFrom.value;
        const toCurrency = this.currencyTo.value;
        const rate = this.calculateRate(fromCurrency, toCurrency);
        const convertedAmount = amount * rate;
        
        this.amountTo.value = convertedAmount.toFixed(2);
    }

    quickConvert() {
        // Store current values
        const currentAmount = this.amountFrom.value;
        const currentFrom = this.currencyFrom.value;
        const currentTo = this.currencyTo.value;
        
        // Perform quick conversion (e.g., USD to all major currencies)
        this.currencyFrom.value = 'USD';
        this.updateCurrencyFlags();
        this.updateRates();
        this.updateConversion();
        
        // Show notification
        this.showNotification('Quick conversion to major currencies applied', 'info');
        
        // Restore after 3 seconds
        setTimeout(() => {
            this.currencyFrom.value = currentFrom;
            this.currencyTo.value = currentTo;
            this.amountFrom.value = currentAmount;
            this.updateCurrencyFlags();
            this.updateRates();
            this.updateConversion();
        }, 3000);
    }

    reverseConversion() {
        const temp = this.currencyFrom.value;
        this.currencyFrom.value = this.currencyTo.value;
        this.currencyTo.value = temp;
        
        this.updateCurrencyFlags();
        this.updateRates();
        this.updateConversion();
    }

    swapCurrencies() {
        this.reverseConversion();
        
        // Add rotation animation
        this.swapButton.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.swapButton.style.transform = 'rotate(0deg)';
        }, 300);
    }

    addToHistory(conversion) {
        this.conversionHistory.unshift(conversion);
        
        // Keep only last 50 conversions
        if (this.conversionHistory.length > 50) {
            this.conversionHistory = this.conversionHistory.slice(0, 50);
        }
        
        localStorage.setItem('conversionHistory', JSON.stringify(this.conversionHistory));
        this.displayHistory();
    }

    displayHistory() {
        if (this.conversionHistory.length === 0) {
            this.historyList.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-exchange-alt"></i>
                    <p>No conversions yet. Make your first conversion!</p>
                </div>
            `;
            return;
        }

        const filter = this.historyFilter.value;
        const timeFilter = this.timeFilter.value;
        
        const now = new Date();
        let filteredHistory = this.conversionHistory;
        
        // Apply currency filter
        if (filter !== 'all') {
            filteredHistory = filteredHistory.filter(conv => 
                conv.fromCurrency === filter || conv.toCurrency === filter
            );
        }
        
        // Apply time filter
        if (timeFilter !== 'all') {
            const cutoff = new Date();
            if (timeFilter === '24h') {
                cutoff.setHours(now.getHours() - 24);
            } else if (timeFilter === '7d') {
                cutoff.setDate(now.getDate() - 7);
            } else if (timeFilter === '30d') {
                cutoff.setDate(now.getDate() - 30);
            }
            
            filteredHistory = filteredHistory.filter(conv => 
                new Date(conv.timestamp) >= cutoff
            );
        }
        
        const historyHTML = filteredHistory.map(conv => {
            const date = new Date(conv.timestamp);
            const timeString = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const dateString = date.toLocaleDateString([], {month: 'short', day: 'numeric'});
            
            return `
                <div class="history-item">
                    <div class="history-header">
                        <div class="history-amounts">
                            <span class="history-from">${this.formatCurrency(conv.amount, conv.fromCurrency)}</span>
                            <span class="history-arrow">→</span>
                            <span class="history-to">${this.formatCurrency(conv.convertedAmount, conv.toCurrency)}</span>
                        </div>
                        <span class="history-rate">${conv.rate.toFixed(4)}</span>
                    </div>
                    <div class="history-footer">
                        <span class="history-time">${dateString} at ${timeString}</span>
                        <span class="history-currencies">${conv.fromCurrency}/${conv.toCurrency}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        this.historyList.innerHTML = historyHTML;
    }

    filterHistory() {
        this.displayHistory();
    }

    exportHistory() {
        if (this.conversionHistory.length === 0) {
            this.showNotification('No history to export', 'warning');
            return;
        }
        
        const csv = [
            ['Date', 'Time', 'From Currency', 'To Currency', 'Amount', 'Rate', 'Converted Amount'],
            ...this.conversionHistory.map(conv => {
                const date = new Date(conv.timestamp);
                return [
                    date.toLocaleDateString(),
                    date.toLocaleTimeString(),
                    conv.fromCurrency,
                    conv.toCurrency,
                    conv.amount,
                    conv.rate,
                    conv.convertedAmount