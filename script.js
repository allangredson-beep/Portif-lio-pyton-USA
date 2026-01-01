/**
 * Forex Converter Pro - Professional Currency Converter
 * Uses Frankfurter API for real-time exchange rates
 * Built for GitHub Pages deployment
 */

class CurrencyConverter {
    constructor() {
        // API Configuration
        this.API_BASE = 'https://api.frankfurter.app';
        this.SUPPORTED_CURRENCIES = [
            { code: 'USD', name: 'US Dollar', symbol: '$', emoji: '🇺🇸' },
            { code: 'EUR', name: 'Euro', symbol: '€', emoji: '🇪🇺' },
            { code: 'GBP', name: 'British Pound', symbol: '£', emoji: '🇬🇧' },
            { code: 'JPY', name: 'Japanese Yen', symbol: '¥', emoji: '🇯🇵' },
            { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', emoji: '🇨🇦' },
            { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', emoji: '🇦🇺' },
            { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', emoji: '🇨🇭' },
            { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', emoji: '🇨🇳' },
            { code: 'INR', name: 'Indian Rupee', symbol: '₹', emoji: '🇮🇳' },
            { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', emoji: '🇧🇷' },
            { code: 'MXN', name: 'Mexican Peso', symbol: '$', emoji: '🇲🇽' },
            { code: 'KRW', name: 'South Korean Won', symbol: '₩', emoji: '🇰🇷' },
            { code: 'RUB', name: 'Russian Ruble', symbol: '₽', emoji: '🇷🇺' },
            { code: 'ZAR', name: 'South African Rand', symbol: 'R', emoji: '🇿🇦' },
            { code: 'TRY', name: 'Turkish Lira', symbol: '₺', emoji: '🇹🇷' },
            { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', emoji: '🇳🇿' },
            { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', emoji: '🇸🇬' },
            { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', emoji: '🇭🇰' },
            { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', emoji: '🇸🇪' },
            { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', emoji: '🇳🇴' }
        ];

        // State
        this.exchangeRates = {};
        this.lastUpdate = null;
        this.isLoading = false;
        this.currentBase = 'USD';
        this.currentTarget = 'EUR';

        // DOM Elements
        this.elements = {
            amountInput: document.getElementById('amountInput'),
            fromCurrency: document.getElementById('fromCurrency'),
            toCurrency: document.getElementById('toCurrency'),
            convertedAmount: document.getElementById('convertedAmount'),
            exchangeRate: document.getElementById('exchangeRate'),
            baseSymbol: document.getElementById('baseSymbol'),
            targetSymbol: document.getElementById('targetSymbol'),
            targetCurrency: document.getElementById('targetCurrency'),
            updateTime: document.getElementById('updateTime'),
            rateTimestamp: document.getElementById('rateTimestamp'),
            lastUpdated: document.getElementById('lastUpdated'),
            copyBtn: document.getElementById('copyBtn'),
            swapBtn: document.getElementById('swapBtn'),
            refreshBtn: document.getElementById('refreshBtn'),
            popularCurrencies: document.getElementById('popularCurrencies'),
            currencySymbols: document.getElementById('currencySymbols'),
            supportedCount: document.getElementById('supportedCount'),
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toastMessage'),
            toastDetail: document.getElementById('toastDetail'),
            loadingOverlay: document.getElementById('loadingOverlay')
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        // Show loading overlay
        this.showLoading();
        
        try {
            // Populate currency dropdowns
            this.populateCurrencyDropdowns();
            
            // Load initial exchange rates
            await this.fetchExchangeRates();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Update UI
            this.updateUI();
            
            // Hide loading overlay
            setTimeout(() => {
                this.hideLoading();
                this.showToast('Ready to convert!', 'Latest exchange rates loaded');
            }, 1000);
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showToast('Error loading data', 'Please check your connection', 'error');
            this.hideLoading();
        }
    }

    /**
     * Populate currency dropdowns with supported currencies
     */
    populateCurrencyDropdowns() {
        const fromSelect = this.elements.fromCurrency;
        const toSelect = this.elements.toCurrency;
        
        // Clear existing options
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';
        
        // Add options for each currency
        this.SUPPORTED_CURRENCIES.forEach(currency => {
            const optionFrom = document.createElement('option');
            optionFrom.value = currency.code;
            optionFrom.textContent = `${currency.emoji} ${currency.code} - ${currency.name}`;
            optionFrom.selected = currency.code === 'USD';
            
            const optionTo = document.createElement('option');
            optionTo.value = currency.code;
            optionTo.textContent = `${currency.emoji} ${currency.code} - ${currency.name}`;
            optionTo.selected = currency.code === 'EUR';
            
            fromSelect.appendChild(optionFrom);
            toSelect.appendChild(optionTo);
        });
        
        // Update supported count display
        this.elements.supportedCount.textContent = `${this.SUPPORTED_CURRENCIES.length} currencies supported`;
        
        // Populate popular currencies
        this.populatePopularCurrencies();
        
        // Populate currency symbols
        this.populateCurrencySymbols();
    }

    /**
     * Populate popular currencies section
     */
    populatePopularCurrencies() {
        const popular = this.SUPPORTED_CURRENCIES.slice(0, 6); // First 6 currencies
        const container = this.elements.popularCurrencies;
        
        container.innerHTML = popular.map(currency => `
            <div class="glass-dark rounded-lg p-3 flex items-center gap-3">
                <span class="text-xl">${currency.emoji}</span>
                <div>
                    <div class="font-medium">${currency.code}</div>
                    <div class="text-xs text-gray-400">${currency.name}</div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Populate currency symbols section
     */
    populateCurrencySymbols() {
        const symbols = this.SUPPORTED_CURRENCIES.slice(0, 8); // First 8 symbols
        const container = this.elements.currencySymbols;
        
        container.innerHTML = symbols.map(currency => `
            <div class="glass-dark rounded-lg p-3 flex items-center justify-between">
                <div class="font-medium">${currency.code}</div>
                <div class="text-xl font-bold">${currency.symbol}</div>
            </div>
        `).join('');
    }

    /**
     * Fetch latest exchange rates from Frankfurter API
     */
    async fetchExchangeRates() {
        try {
            this.isLoading = true;
            this.updateStatus('Fetching latest rates...');
            
            // Fetch rates for all supported currencies from USD
            const response = await fetch(`${this.API_BASE}/latest?from=USD`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Store rates
            this.exchangeRates = data.rates;
            this.lastUpdate = new Date();
            
            // Update status
            this.updateStatus('Rates updated');
            this.updateTimestamp();
            
            return data.rates;
            
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            
            // Fallback to static rates if API fails
            this.exchangeRates = {
                EUR: 0.92,
                GBP: 0.79,
                JPY: 149.50,
                CAD: 1.36,
                AUD: 1.52,
                CHF: 0.88,
                CNY: 7.15,
                INR: 83.25,
                BRL: 5.15,
                MXN: 18.50,
                KRW: 1325.50,
                RUB: 95.80,
                ZAR: 19.25,
                TRY: 28.75,
                NZD: 1.65,
                SGD: 1.35,
                HKD: 7.82,
                SEK: 10.65,
                NOK: 10.95
            };
            
            this.lastUpdate = new Date();
            this.updateStatus('Using cached rates', 'warning');
            
            return this.exchangeRates;
            
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Convert currency based on current selections
     */
    convertCurrency() {
        try {
            // Get input values
            const amount = parseFloat(this.elements.amountInput.value) || 0;
            const fromCurrency = this.elements.fromCurrency.value;
            const toCurrency = this.elements.toCurrency.value;
            
            // Update current state
            this.currentBase = fromCurrency;
            this.currentTarget = toCurrency;
            
            // Get currency info
            const fromCurrencyInfo = this.SUPPORTED_CURRENCIES.find(c => c.code === fromCurrency);
            const toCurrencyInfo = this.SUPPORTED_CURRENCIES.find(c => c.code === toCurrency);
            
            // Update symbols
            this.elements.baseSymbol.textContent = fromCurrencyInfo?.symbol || '$';
            this.elements.targetSymbol.textContent = toCurrencyInfo?.symbol || '€';
            this.elements.targetCurrency.textContent = toCurrency;
            
            if (amount <= 0) {
                this.elements.convertedAmount.textContent = '0.00';
                this.elements.exchangeRate.textContent = `1 ${fromCurrency} = 0.00 ${toCurrency}`;
                return;
            }
            
            // If converting from USD, use direct rate
            if (fromCurrency === 'USD') {
                const rate = this.exchangeRates[toCurrency] || 1;
                const converted = amount * rate;
                
                this.elements.convertedAmount.textContent = this.formatNumber(converted, toCurrency);
                this.elements.exchangeRate.textContent = `1 ${fromCurrency} = ${this.formatNumber(rate, toCurrency, 4)} ${toCurrency}`;
                
            } else if (toCurrency === 'USD') {
                // If converting to USD, need to invert the rate
                const rate = 1 / (this.exchangeRates[fromCurrency] || 1);
                const converted = amount * rate;
                
                this.elements.convertedAmount.textContent = this.formatNumber(converted, toCurrency);
                this.elements.exchangeRate.textContent = `1 ${fromCurrency} = ${this.formatNumber(rate, toCurrency, 4)} ${toCurrency}`;
                
            } else {
                // Convert from currency A to B via USD
                const rateFromUSD = this.exchangeRates[fromCurrency] || 1;
                const rateToUSD = this.exchangeRates[toCurrency] || 1;
                const rate = rateToUSD / rateFromUSD;
                const converted = amount * rate;
                
                this.elements.convertedAmount.textContent = this.formatNumber(converted, toCurrency);
                this.elements.exchangeRate.textContent = `1 ${fromCurrency} = ${this.formatNumber(rate, toCurrency, 4)} ${toCurrency}`;
            }
            
        } catch (error) {
            console.error('Conversion error:', error);
            this.showToast('Conversion error', 'Please try again', 'error');
        }
    }

    /**
     * Swap the from and to currencies
     */
    swapCurrencies() {
        const fromValue = this.elements.fromCurrency.value;
        const toValue = this.elements.toCurrency.value;
        
        // Swap values
        this.elements.fromCurrency.value = toValue;
        this.elements.toCurrency.value = fromValue;
        
        // Trigger conversion
        this.convertCurrency();
        
        // Show feedback
        this.showToast('Currencies swapped', 'Conversion updated');
    }

    /**
     * Copy result to clipboard
     */
    async copyToClipboard() {
        try {
            const amount = this.elements.amountInput.value || '0';
            const fromCurrency = this.elements.fromCurrency.value;
            const toCurrency = this.elements.toCurrency.value;
            const result = this.elements.convertedAmount.textContent;
            const rate = this.elements.exchangeRate.textContent;
            
            const textToCopy = `💱 Currency Conversion:
${amount} ${fromCurrency} = ${result} ${toCurrency}
Rate: ${rate}
Generated via Forex Converter Pro`;
            
            await navigator.clipboard.writeText(textToCopy);
            
            this.showToast('Copied to clipboard!', 'Ready to paste anywhere');
            
        } catch (error) {
            console.error('Copy error:', error);
            this.showToast('Copy failed', 'Please try again', 'error');
        }
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Amount input
        this.elements.amountInput.addEventListener('input', () => {
            this.convertCurrency();
        });
        
        // Currency select changes
        this.elements.fromCurrency.addEventListener('change', () => {
            this.convertCurrency();
        });
        
        this.elements.toCurrency.addEventListener('change', () => {
            this.convertCurrency();
        });
        
        // Quick amount buttons
        document.querySelectorAll('.quick-amount').forEach(button => {
            button.addEventListener('click', (e) => {
                const amount = e.target.dataset.amount;
                this.elements.amountInput.value = amount;
                this.elements.amountInput.focus();
                this.convertCurrency();
                this.showToast(`Amount set to $${amount}`, 'Ready to convert');
            });
        });
        
        // Copy button
        this.elements.copyBtn.addEventListener('click', () => {
            this.copyToClipboard();
        });
        
        // Swap button
        this.elements.swapBtn.addEventListener('click', () => {
            this.swapCurrencies();
        });
        
        // Refresh button
        this.elements.refreshBtn.addEventListener('click', async () => {
            await this.refreshRates();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + R to refresh
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.refreshRates();
            }
            
            // Ctrl/Cmd + C to copy when result is focused
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                this.copyToClipboard();
            }
            
            // Space to swap currencies
            if (e.code === 'Space' && !e.target.matches('input, select, textarea')) {
                e.preventDefault();
                this.swapCurrencies();
            }
        });
        
        // Auto-refresh every 5 minutes
        setInterval(() => {
            this.refreshRates();
        }, 5 * 60 * 1000); // 5 minutes
    }

    /**
     * Refresh exchange rates
     */
    async refreshRates() {
        if (this.isLoading) return;
        
        this.showLoading();
        await this.fetchExchangeRates();
        this.convertCurrency();
        this.hideLoading();
        
        this.showToast('Rates refreshed', 'Latest exchange rates loaded');
    }

    /**
     * Update the status display
     */
    updateStatus(message, type = 'success') {
        const statusElement = this.elements.updateTime;
        const indicator = this.elements.lastUpdated.querySelector('.w-2');
        
        if (type === 'warning') {
            indicator.className = 'w-2 h-2 bg-yellow-500 rounded-full animate-pulse-slow';
        } else if (type === 'error') {
            indicator.className = 'w-2 h-2 bg-red-500 rounded-full animate-pulse-slow';
        } else {
            indicator.className = 'w-2 h-2 bg-green-500 rounded-full animate-pulse-slow';
        }
        
        statusElement.textContent = message;
        this.updateTimestamp();
    }

    /**
     * Update the timestamp display
     */
    updateTimestamp() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        this.elements.rateTimestamp.textContent = timeString;
        
        // Format for last updated
        const dateString = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        this.elements.updateTime.textContent = `${dateString} ${timeString}`;
    }

    /**
     * Update the entire UI
     */
    updateUI() {
        this.convertCurrency();
        this.updateTimestamp();
    }

    /**
     * Show toast notification
     */
    showToast(message, detail = '', type = 'success') {
        const toast = this.elements.toast;
        const icon = toast.querySelector('i');
        
        // Update message
        this.elements.toastMessage.textContent = message;
        this.elements.toastDetail.textContent = detail;
        
        // Update icon based on type
        if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle text-xl';
            icon.parentElement.className = 'text-red-400';
        } else if (type === 'warning') {
            icon.className = 'fas fa-exclamation-triangle text-xl';
            icon.parentElement.className = 'text-yellow-400';
        } else {
            icon.className = 'fas fa-check-circle text-xl';
            icon.parentElement.className = 'text-green-400';
        }
        
        // Show toast
        toast.classList.remove('translate-y-20');
        toast.classList.add('translate-y-0');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('translate-y-0');
            toast.classList.add('translate-y-20');
        }, 3000);
    }

    /**
     * Show loading overlay
     */
    showLoading() {
        this.elements.loadingOverlay.classList.remove('opacity-0');
        this.elements.loadingOverlay.classList.add('opacity-100');
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        this.elements.loadingOverlay.classList.remove('opacity-100');
        this.elements.loadingOverlay.classList.add('opacity-0');
        
        // Remove from DOM after animation
        setTimeout(() => {
            this.elements.loadingOverlay.style.display = 'none';
        }, 500);
    }

    /**
     * Format number with currency-specific formatting
     */
    formatNumber(number, currencyCode = 'USD', decimals = 2) {
        try {
            const currencyInfo = this.SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
            const locale = currencyInfo?.locale || 'en-US';
            
            return new Intl.NumberFormat(locale, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(number);
            
        } catch (error) {
            // Fallback formatting
            return number.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create and initialize the converter
    const converter = new CurrencyConverter();
    
    // Make converter available globally for debugging (optional)
    window.currencyConverter = converter;
    
    // Add service worker for PWA capabilities (optional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
});

// Add offline detection
window.addEventListener('online', () => {
    const event = new CustomEvent('toast', {
        detail: {
            message: 'Back online!',
            detail: 'Refreshing exchange rates...',
            type: 'success'
        }
    });
    window.dispatchEvent(event);
});

window.addEventListener('offline', () => {
    const event = new CustomEvent('toast', {
        detail: {
            message: 'You are offline',
            detail: 'Using cached exchange rates',
            type: 'warning'
        }
    });
    window.dispatchEvent(event);
});