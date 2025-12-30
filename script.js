// Professional Responsive Forex Calculator
class ResponsiveForexCalculator {
    constructor() {
        this.init();
    }

    async init() {
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Initialize all components
        this.initElements();
        this.initState();
        this.initEventListeners();
        this.initResponsiveFeatures();
        this.initVirtualKeyboard();
        
        // Load initial data
        await this.loadMarketData();
        this.updateDisplay();
        
        // Start auto-update
        this.startAutoUpdate();
        
        // Add orientation change handler
        this.handleOrientationChange();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContainer = document.getElementById('mainContainer');
        
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContainer.style.display = 'block';
                this.showToast('Forex Calculator Ready', 'Market data loaded successfully', 'success');
            }, 300);
        }, 1000);
    }

    initElements() {
        // Input Elements
        this.amountInput = document.getElementById('amountInput');
        this.amountOutput = document.getElementById('amountOutput');
        this.currencyFromSelect = document.getElementById('currencyFromSelect');
        this.currencyToSelect = document.getElementById('currencyToSelect');
        
        // Button Elements
        this.convertBtn = document.getElementById('convertBtn');
        this.swapBtn = document.getElementById('swapBtn');
        this.quickConvertBtn = document.getElementById('quickConvertBtn');
        this.reverseRate = document.getElementById('reverseRate');
        this.favoriteRate = document.getElementById('favoriteRate');
        this.saveConversion = document.getElementById('saveConversion');
        this.clearAll = document.getElementById('clearAll');
        this.refreshMarket = document.getElementById('refreshMarket');
        this.refreshRates = document.getElementById('refreshRates');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        
        // Display Elements
        this.currentRateDisplay = document.getElementById('currentRateDisplay');
        this.summarySource = document.getElementById('summarySource');
        this.summaryTarget = document.getElementById('summaryTarget');
        this.summaryRate = document.getElementById('summaryRate');
        this.summaryTotal = document.getElementById('summaryTotal');
        this.conversionTime = document.getElementById('conversionTime');
        this.marketStatusText = document.getElementById('marketStatusText');
        this.lastUpdate = document.getElementById('lastUpdate');
        
        // Mobile Elements
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.mobileSidebar = document.getElementById('mobileSidebar');
        this.closeSidebar = document.getElementById('closeSidebar');
        this.mobileSettingsBtn = document.getElementById('mobileSettingsBtn');
        this.mobileSettingsPanel = document.getElementById('mobileSettingsPanel');
        this.closeSettings = document.getElementById('closeSettings');
        this.mobileNav = document.querySelectorAll('.nav-btn');
        this.mobileConvertBtn = document.getElementById('mobileConvertBtn');
        
        // Preset Elements
        this.presetButtons = document.querySelectorAll('.preset');
        this.quickActions = document.querySelectorAll('.quick-action');
        
        // Tool Elements
        this.toolButtons = document.querySelectorAll('.tool-btn');
        
        // Market Elements
        this.marketPairs = document.getElementById('marketPairs');
        
        // Toast Container
        this.toastContainer = document.getElementById('toastContainer');
        
        // Virtual Keyboard
        this.virtualKeyboard = document.getElementById('virtualKeyboard');
        this.closeKeyboard = document.getElementById('closeKeyboard');
        
        // Settings Elements
        this.mobileDarkMode = document.getElementById('mobileDarkMode');
        this.mobileAutoUpdate = document.getElementById('mobileAutoUpdate');
        this.mobileNotifications = document.getElementById('mobileNotifications');
    }

    initState() {
        // Currency data
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

        // Current rates (simulated - in production would be from API)
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

        // Major currency pairs
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

        // State
        this.conversionHistory = JSON.parse(localStorage.getItem('forexHistory')) || [];
        this.favoritePairs = JSON.parse(localStorage.getItem('favoritePairs')) || [];
        this.settings = JSON.parse(localStorage.getItem('forexSettings')) || this.getDefaultSettings();
        
        // Update interval
        this.updateInterval = null;
        this.lastUpdateTime = new Date();
        
        // Mobile state
        this.isMobile = this.checkIfMobile();
        this.isTablet = this.checkIfTablet();
        this.currentSection = 'converter';
    }

    getDefaultSettings() {
        return {
            darkMode: true,
            autoUpdate: true,
            notifications: false,
            updateInterval: 60, // seconds
            defaultAmount: 1000,
            favoriteCurrencies: ['USD', 'EUR', 'GBP', 'BRL'],
            numberFormat: 'en-US'
        };
    }

    initEventListeners() {
        // Conversion events
        this.convertBtn.addEventListener('click', () => this.performConversion());
        this.swapBtn.addEventListener('click', () => this.swapCurrencies());
        this.quickConvertBtn.addEventListener('click', () => this.quickConvert());
        this.reverseRate.addEventListener('click', () => this.reverseRate());
        this.favoriteRate.addEventListener('click', () => this.toggleFavorite());
        this.saveConversion.addEventListener('click', () => this.saveToHistory());
        this.clearAll.addEventListener('click', () => this.clearConversion());
        
        // Input events
        this.amountInput.addEventListener('input', () => this.updateConversion());
        this.currencyFromSelect.addEventListener('change', () => this.updateRate());
        this.currencyToSelect.addEventListener('change', () => this.updateRate());
        
        // Mobile events
        this.mobileMenuBtn.addEventListener('click', () => this.toggleSidebar());
        this.closeSidebar.addEventListener('click', () => this.closeSidebarMenu());
        this.mobileSettingsBtn.addEventListener('click', () => this.toggleSettingsPanel());
        this.closeSettings.addEventListener('click', () => this.closeSettingsPanel());
        this.mobileConvertBtn.addEventListener('click', () => this.performConversion());
        
        // Navigation events
        this.mobileNav.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.currentTarget.dataset.section));
        });
        
        // Preset events
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.setPresetAmount(e.currentTarget.dataset.amount));
        });
        
        this.quickActions.forEach(btn => {
            btn.addEventListener('click', (e) => this.setPresetAmount(e.currentTarget.dataset.preset));
        });
        
        // Tool events
        this.toolButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleToolClick(e.currentTarget.dataset.tool));
        });
        
        // Market refresh
        this.refreshMarket.addEventListener('click', () => this.loadMarketData());
        this.refreshRates.addEventListener('click', () => this.updateRate());
        
        // Fullscreen
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Touch events for mobile
        this.initTouchEvents();
        
        // Keyboard events
        this.initKeyboardEvents();
    }

    initResponsiveFeatures() {
        // Check device type
        this.updateDeviceType();
        
        // Listen for resize
        window.addEventListener('resize', () => {
            this.updateDeviceType();
            this.adjustLayout();
        });
        
        // Initial layout adjustment
        this.adjustLayout();
        
        // Add touch-friendly styles for mobile
        if (this.isMobile) {
            this.makeTouchFriendly();
        }
    }

    checkIfMobile() {
        return window.innerWidth <= 768;
    }

    checkIfTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    updateDeviceType() {
        this.isMobile = this.checkIfMobile();
        this.isTablet = this.checkIfTablet();
        
        // Update body class for CSS targeting
        document.body.classList.toggle('mobile', this.isMobile);
        document.body.classList.toggle('tablet', this.isTablet);
        document.body.classList.toggle('desktop', !this.isMobile && !this.isTablet);
    }

    adjustLayout() {
        // Adjust font sizes for mobile
        const baseFontSize = this.isMobile ? '14px' : '16px';
        document.documentElement.style.fontSize = baseFontSize;
        
        // Adjust spacing for mobile
        const spacingMultiplier = this.isMobile ? 0.8 : 1;
        
        // Update CSS variables
        document.documentElement.style.setProperty('--space-sm', `${0.5 * spacingMultiplier}rem`);
        document.documentElement.style.setProperty('--space-md', `${1 * spacingMultiplier}rem`);
        document.documentElement.style.setProperty('--space-lg', `${1.5 * spacingMultiplier}rem`);
        document.documentElement.style.setProperty('--space-xl', `${2 * spacingMultiplier}rem`);
    }

    makeTouchFriendly() {
        // Increase touch targets
        const touchElements = document.querySelectorAll('button, input, select, .preset, .tool-btn');
        touchElements.forEach(el => {
            if (!el.classList.contains('touch-optimized')) {
                el.classList.add('touch-optimized');
                // Ensure minimum touch target size
                if (el.tagName === 'BUTTON' || el.classList.contains('preset') || el.classList.contains('tool-btn')) {
                    el.style.minHeight = '44px';
                    el.style.minWidth = '44px';
                }
            }
        });
        
        // Add touch feedback
        document.addEventListener('touchstart', () => {}, { passive: true });
        
        // Prevent zoom on input focus for iOS
        document.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                document.body.style.zoom = '100%';
            }
        });
    }

    initTouchEvents() {
        // Swipe gestures for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const swipeDistance = endX - startX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && this.currentSection !== 'converter') {
                // Swipe right - go to previous section
                const sections = ['converter', 'market', 'history', 'calculator', 'more'];
                const currentIndex = sections.indexOf(this.currentSection);
                if (currentIndex > 0) {
                    this.switchSection(sections[currentIndex - 1]);
                }
            } else if (swipeDistance < 0 && this.currentSection !== 'more') {
                // Swipe left - go to next section
                const sections = ['converter', 'market', 'history', 'calculator', 'more'];
                const currentIndex = sections.indexOf(this.currentSection);
                if (currentIndex < sections.length - 1) {
                    this.switchSection(sections[currentIndex + 1]);
                }
            }
        }
    }

    initKeyboardEvents() {
        // Virtual keyboard for mobile
        this.amountInput.addEventListener('focus', () => {
            if (this.isMobile) {
                this.showVirtualKeyboard();
            }
        });
        
        this.closeKeyboard.addEventListener('click', () => {
            this.hideVirtualKeyboard();
        });
        
        // Handle physical keyboard
        document.addEventListener('keydown', (e) => {
            if (e.target === this.amountInput) {
                // Prevent default for arrow keys in virtual keyboard mode
                if (this.isMobile && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                }
                
                // Enter key to convert
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performConversion();
                }
            }
        });
    }

    initVirtualKeyboard() {
        const keyboardKeys = document.querySelector('.keyboard-keys');
        const keys = [
            '1', '2', '3',
            '4', '5', '6',
            '7', '8', '9',
            '.', '0', '⌫'
        ];
        
        keyboardKeys.innerHTML = keys.map(key => 
            `<button class="key ${key === '⌫' ? 'function' : ''}" data-key="${key}">${key}</button>`
        ).join('');
        
        // Add keyboard event listeners
        keyboardKeys.addEventListener('click', (e) => {
            if (e.target.classList.contains('key')) {
                const key = e.target.dataset.key;
                this.handleKeyboardInput(key);
            }
        });
    }

    handleKeyboardInput(key) {
        const input = this.amountInput;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const value = input.value;
        
        if (key === '⌫') {
            // Backspace
            input.value = value.substring(0, start - 1) + value.substring(end);
            input.selectionStart = input.selectionEnd = start - 1;
        } else if (key === '.') {
            // Only allow one decimal point
            if (!value.includes('.')) {
                input.value = value.substring(0, start) + key + value.substring(end);
                input.selectionStart = input.selectionEnd = start + 1;
            }
        } else {
            // Regular number
            input.value = value.substring(0, start) + key + value.substring(end);
            input.selectionStart = input.selectionEnd = start + 1;
        }
        
        // Trigger input event
        input.dispatchEvent(new Event('input'));
    }

    showVirtualKeyboard() {
        this.virtualKeyboard.classList.add('open');
        this.amountInput.blur(); // Remove focus to prevent double keyboard on iOS
    }

    hideVirtual