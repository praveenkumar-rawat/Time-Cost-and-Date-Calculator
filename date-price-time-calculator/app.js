// Date & Time Calculator Suite - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calculator after DOM is loaded
    window.calculator = new DateTimeCalculator();
});

class DateTimeCalculator {
    constructor() {
        this.selectedOperation = 'add';
        this.init();
    }

    init() {
        console.log('Initializing Date & Time Calculator...');
        this.setMaxDates();
        this.setDefaultDates();
        this.setupEventListeners();
        this.initializeTabs();
        this.startRealTimeUpdates();
        console.log('Calculator initialized successfully');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Tab navigation - more robust event handling
        const tabs = document.querySelectorAll('.nav__tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tabName = tab.getAttribute('data-tab');
                console.log('Tab clicked:', tabName);
                this.switchTab(tabName);
            });
        });

        // Age Calculator
        const birthDateInput = document.getElementById('birth-date');
        if (birthDateInput) {
            birthDateInput.addEventListener('change', () => {
                console.log('Birth date changed:', birthDateInput.value);
                this.calculateAge();
            });
            birthDateInput.addEventListener('input', () => {
                console.log('Birth date input:', birthDateInput.value);
                this.calculateAge();
            });
        }

        // Date Calculator
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const baseDateInput = document.getElementById('base-date');
        const addDaysInput = document.getElementById('add-days');

        if (startDateInput) {
            startDateInput.addEventListener('change', () => this.calculateDateDifference());
            startDateInput.addEventListener('input', () => this.calculateDateDifference());
        }
        if (endDateInput) {
            endDateInput.addEventListener('change', () => this.calculateDateDifference());
            endDateInput.addEventListener('input', () => this.calculateDateDifference());
        }
        if (baseDateInput) {
            baseDateInput.addEventListener('change', () => this.calculateDateMath());
            baseDateInput.addEventListener('input', () => this.calculateDateMath());
        }
        if (addDaysInput) {
            addDaysInput.addEventListener('input', () => this.calculateDateMath());
        }

        // Time Calculator
        const timeInputs = ['time1-hours', 'time1-minutes', 'time1-seconds', 'time2-hours', 'time2-minutes', 'time2-seconds'];
        timeInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.calculateTimeOperation());
            }
        });

        const timeRangeInputs = ['start-time', 'end-time'];
        timeRangeInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.calculateTimeDuration());
            }
        });

        // Operation buttons
        const operationButtons = document.querySelectorAll('.operation-btn');
        operationButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const operation = btn.getAttribute('data-operation');
                console.log('Operation button clicked:', operation);
                this.setOperation(operation);
            });
        });

        // Duration Calculator
        const durationInputs = ['duration-start', 'duration-end'];
        durationInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.calculateDuration());
                element.addEventListener('input', () => this.calculateDuration());
            }
        });

        // Price Calculator
        const priceRateInput = document.getElementById('price-rate');
        const priceHoursInput = document.getElementById('price-hours');
        const priceMinutesInput = document.getElementById('price-minutes');
        [priceRateInput, priceHoursInput, priceMinutesInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.calculatePrice());
            }
        });

        console.log('Event listeners setup complete');
    }

    setMaxDates() {
        const today = new Date().toISOString().split('T')[0];
        const birthDateInput = document.getElementById('birth-date');
        if (birthDateInput) {
            birthDateInput.setAttribute('max', today);
        }
    }

    setDefaultDates() {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Set default dates for date calculator
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        const baseDate = document.getElementById('base-date');
        
        if (startDate) startDate.value = yesterdayStr;
        if (endDate) endDate.value = todayStr;
        if (baseDate) baseDate.value = todayStr;

        // Set default datetime for duration calculator
        const durationStart = document.getElementById('duration-start');
        const durationEnd = document.getElementById('duration-end');
        
        if (durationStart) durationStart.value = yesterday.toISOString().slice(0, 16);
        if (durationEnd) durationEnd.value = today.toISOString().slice(0, 16);
    }

    initializeTabs() {
        console.log('Initializing tabs...');
        // Show the age calculator by default
        this.switchTab('age');
        
        // Set default operation for time calculator
        const addButton = document.querySelector('[data-operation="add"]');
        if (addButton) {
            addButton.classList.add('active');
        }
    }

    startRealTimeUpdates() {
        // Update calculations every second for real-time display
        setInterval(() => {
            const activeTab = document.querySelector('.calculator--active');
            if (activeTab) {
                const tabId = activeTab.getAttribute('id');
                if (tabId === 'age-calculator') {
                    this.calculateAge();
                } else if (tabId === 'duration-calculator') {
                    this.calculateDuration();
                }
            }
        }, 1000);
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Update nav tabs
        const allTabs = document.querySelectorAll('.nav__tab');
        allTabs.forEach(tab => {
            tab.classList.remove('nav__tab--active');
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('nav__tab--active');
            console.log('Active tab set for:', tabName);
        }

        // Update calculators
        const allCalculators = document.querySelectorAll('.calculator');
        allCalculators.forEach(calc => {
            calc.classList.remove('calculator--active');
        });
        
        const calculator = document.getElementById(`${tabName}-calculator`);
        if (calculator) {
            calculator.classList.add('calculator--active');
            console.log('Active calculator set for:', tabName);
        }

        // Trigger initial calculations
        setTimeout(() => {
            switch (tabName) {
                case 'age':
                    this.calculateAge();
                    break;
                case 'date':
                    this.calculateDateDifference();
                    break;
                case 'time':
                    this.calculateTimeOperation();
                    this.calculateTimeDuration();
                    break;
                case 'duration':
                    this.calculateDuration();
                    break;
                case 'price':
                    this.calculatePrice();
                    break;
            }
        }, 100);
    }

    calculateAge() {
        const birthDateInput = document.getElementById('birth-date');
        if (!birthDateInput || !birthDateInput.value) {
            this.clearAgeResults();
            return;
        }

        const birthDate = new Date(birthDateInput.value);
        const now = new Date();
        
        if (birthDate > now || isNaN(birthDate.getTime())) {
            this.clearAgeResults();
            return;
        }

        console.log('Calculating age for birth date:', birthDate);

        // Calculate age components
        const ageComponents = this.calculateAgeComponents(birthDate, now);
        
        // Update age display
        this.updateElementText('age-years', ageComponents.years);
        this.updateElementText('age-months', ageComponents.months);
        this.updateElementText('age-days', ageComponents.days);

        // Calculate total values
        const totalDays = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor((now - birthDate) / (1000 * 60 * 60));
        const totalMinutes = Math.floor((now - birthDate) / (1000 * 60));
        const totalSeconds = Math.floor((now - birthDate) / 1000);

        this.updateElementText('total-days', totalDays.toLocaleString());
        this.updateElementText('total-hours', totalHours.toLocaleString());
        this.updateElementText('total-minutes', totalMinutes.toLocaleString());
        this.updateElementText('total-seconds', totalSeconds.toLocaleString());

        // Calculate additional info
        const dayOfWeek = birthDate.toLocaleDateString('en-US', { weekday: 'long' });
        this.updateElementText('birth-day', dayOfWeek);

        // Next birthday
        const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday < now) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        
        const daysUntilBirthday = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));
        this.updateElementText('next-birthday', nextBirthday.toLocaleDateString());
        this.updateElementText('days-until', daysUntilBirthday);

        console.log('Age calculation completed');
    }

    updateElementText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        } else {
            console.warn('Element not found:', id);
        }
    }

    calculateAgeComponents(birthDate, currentDate) {
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    }

    clearAgeResults() {
        const ids = ['age-years', 'age-months', 'age-days', 'total-days', 'total-hours', 'total-minutes', 'total-seconds'];
        ids.forEach(id => {
            this.updateElementText(id, '0');
        });
        
        this.updateElementText('birth-day', '-');
        this.updateElementText('next-birthday', '-');
        this.updateElementText('days-until', '-');
    }

    calculateDateDifference() {
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        
        if (!startDate || !endDate || !startDate.value || !endDate.value) {
            this.clearDateResults();
            return;
        }

        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        
        if (start > end || isNaN(start.getTime()) || isNaN(end.getTime())) {
            this.clearDateResults();
            return;
        }

        // Calculate difference components
        const diffComponents = this.calculateAgeComponents(start, end);
        
        this.updateElementText('diff-years', diffComponents.years);
        this.updateElementText('diff-months', diffComponents.months);
        this.updateElementText('diff-days', diffComponents.days);

        // Calculate total values
        const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        const businessDays = this.calculateBusinessDays(start, end);
        const weeks = Math.floor(totalDays / 7);

        this.updateElementText('diff-total-days', totalDays.toLocaleString());
        this.updateElementText('diff-business-days', businessDays.toLocaleString());
        this.updateElementText('diff-weeks', weeks.toLocaleString());
    }

    calculateBusinessDays(startDate, endDate) {
        let count = 0;
        const current = new Date(startDate);
        
        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        
        return count;
    }

    clearDateResults() {
        const ids = ['diff-years', 'diff-months', 'diff-days', 'diff-total-days', 'diff-business-days', 'diff-weeks'];
        ids.forEach(id => {
            this.updateElementText(id, '0');
        });
    }

    calculateDateMath() {
        const baseDate = document.getElementById('base-date');
        const addDays = document.getElementById('add-days');
        const resultElement = document.getElementById('date-math-result');

        if (!baseDate || !resultElement || !baseDate.value) {
            if (resultElement) resultElement.textContent = '-';
            return;
        }

        const base = new Date(baseDate.value);
        const daysToAdd = parseInt(addDays?.value || '0');
        const result = new Date(base);
        result.setDate(result.getDate() + daysToAdd);

        if (isNaN(result.getTime())) {
            resultElement.textContent = '-';
            return;
        }

        resultElement.textContent = result.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    setOperation(operation) {
        this.selectedOperation = operation;
        
        // Update button states
        const operationButtons = document.querySelectorAll('.operation-btn');
        operationButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-operation="${operation}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        this.calculateTimeOperation();
    }

    calculateTimeOperation() {
        const time1Hours = parseInt(document.getElementById('time1-hours')?.value || '0');
        const time1Minutes = parseInt(document.getElementById('time1-minutes')?.value || '0');
        const time1Seconds = parseInt(document.getElementById('time1-seconds')?.value || '0');
        
        const time2Hours = parseInt(document.getElementById('time2-hours')?.value || '0');
        const time2Minutes = parseInt(document.getElementById('time2-minutes')?.value || '0');
        const time2Seconds = parseInt(document.getElementById('time2-seconds')?.value || '0');

        // Convert to total seconds
        const time1TotalSeconds = time1Hours * 3600 + time1Minutes * 60 + time1Seconds;
        const time2TotalSeconds = time2Hours * 3600 + time2Minutes * 60 + time2Seconds;

        let resultSeconds;
        if (this.selectedOperation === 'add') {
            resultSeconds = time1TotalSeconds + time2TotalSeconds;
        } else {
            resultSeconds = time1TotalSeconds - time2TotalSeconds;
        }

        // Handle negative results
        if (resultSeconds < 0) {
            resultSeconds = 0;
        }

        // Convert back to hours, minutes, seconds
        const resultHours = Math.floor(resultSeconds / 3600);
        const resultMinutes = Math.floor((resultSeconds % 3600) / 60);
        const finalSeconds = resultSeconds % 60;

        this.updateElementText('time-operation-result', 
            `${resultHours.toString().padStart(2, '0')}:${resultMinutes.toString().padStart(2, '0')}:${finalSeconds.toString().padStart(2, '0')}`);
    }

    calculateTimeDuration() {
        const startTime = document.getElementById('start-time');
        const endTime = document.getElementById('end-time');

        if (!startTime || !endTime || !startTime.value || !endTime.value) {
            this.clearTimeDurationResults();
            return;
        }

        const today = new Date();
        const start = new Date(today.toDateString() + ' ' + startTime.value);
        let end = new Date(today.toDateString() + ' ' + endTime.value);

        // Handle case where end time is before start time (next day)
        if (end < start) {
            end.setDate(end.getDate() + 1);
        }

        const diffMs = end - start;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);

        const hours = diffHours;
        const minutes = diffMinutes % 60;
        const seconds = diffSeconds % 60;

        this.updateElementText('time-duration-result', 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        
        this.updateElementText('duration-hours', hours);
        this.updateElementText('duration-minutes', minutes);
        this.updateElementText('duration-seconds', seconds);
    }

    clearTimeDurationResults() {
        this.updateElementText('time-duration-result', '00:00:00');
        this.updateElementText('duration-hours', '0');
        this.updateElementText('duration-minutes', '0');
        this.updateElementText('duration-seconds', '0');
    }

    calculateDuration() {
        const startDateTime = document.getElementById('duration-start');
        const endDateTime = document.getElementById('duration-end');

        if (!startDateTime || !endDateTime || !startDateTime.value || !endDateTime.value) {
            this.clearDurationResults();
            return;
        }

        const start = new Date(startDateTime.value);
        const end = new Date(endDateTime.value);

        if (start >= end || isNaN(start.getTime()) || isNaN(end.getTime())) {
            this.clearDurationResults();
            return;
        }

        // Calculate duration components
        const durationComponents = this.calculateAgeComponents(start, end);
        
        this.updateElementText('duration-years', durationComponents.years);
        this.updateElementText('duration-months', durationComponents.months);
        
        // Calculate weeks from remaining days
        const weeks = Math.floor(durationComponents.days / 7);
        const remainingDays = durationComponents.days % 7;
        
        this.updateElementText('duration-weeks', weeks);
        this.updateElementText('duration-days', remainingDays);

        // Calculate time components
        const timeDiff = end - start;
        const totalSeconds = Math.floor(timeDiff / 1000);
        const totalMinutes = Math.floor(timeDiff / (1000 * 60));
        const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
        const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        this.updateElementText('duration-hours', hours);
        this.updateElementText('duration-minutes', minutes);
        this.updateElementText('duration-seconds', seconds);

        // Calculate totals
        this.updateElementText('duration-total-days', totalDays.toLocaleString());
        this.updateElementText('duration-total-hours', totalHours.toLocaleString());
        this.updateElementText('duration-total-minutes', totalMinutes.toLocaleString());

        // Calculate business days
        const businessDays = this.calculateBusinessDays(start, end);
        this.updateElementText('duration-business-days', businessDays.toLocaleString());

        // Calculate percentages
        const daysInYear = 365.25;
        const daysInDecade = daysInYear * 10;
        
        const percentOfYear = ((totalDays / daysInYear) * 100).toFixed(2);
        const percentOfDecade = ((totalDays / daysInDecade) * 100).toFixed(2);

        this.updateElementText('duration-percent-year', percentOfYear + '%');
        this.updateElementText('duration-percent-decade', percentOfDecade + '%');
    }

    clearDurationResults() {
        const ids = [
            'duration-years', 'duration-months', 'duration-weeks', 'duration-days',
            'duration-hours', 'duration-minutes', 'duration-seconds',
            'duration-total-days', 'duration-total-hours', 'duration-total-minutes',
            'duration-business-days', 'duration-percent-year', 'duration-percent-decade'
        ];
        
        ids.forEach(id => {
            this.updateElementText(id, id.includes('percent') ? '0%' : '0');
        });
    }

    calculatePrice() {
        const rateInput = document.getElementById('price-rate');
        const hoursInput = document.getElementById('price-hours');
        const minutesInput = document.getElementById('price-minutes');
        const resultElement = document.getElementById('price-result');
        
        if (!rateInput || !hoursInput || !minutesInput || !resultElement) {
            if (resultElement) resultElement.textContent = 'Rs 0.00';
            return;
        }
        
        const rate = parseFloat(rateInput.value) || 0;
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        
        // Calculate total time in hours
        const totalHours = hours + (minutes / 60);
        const price = rate * totalHours;
        
        resultElement.textContent = `Rs ${price.toFixed(2)}`;
    }

    copyResults(calculatorType) {
        let textToCopy = '';
        
        switch (calculatorType) {
            case 'age':
                textToCopy = this.getAgeResultsText();
                break;
            case 'date':
                textToCopy = this.getDateResultsText();
                break;
            case 'time':
                textToCopy = this.getTimeResultsText();
                break;
            case 'duration':
                textToCopy = this.getDurationResultsText();
                break;
            case 'price':
                textToCopy = this.getPriceResultsText();
                break;
        }

        if (textToCopy) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    this.showCopySuccess(calculatorType);
                }).catch(() => {
                    this.fallbackCopyToClipboard(textToCopy);
                    this.showCopySuccess(calculatorType);
                });
            } else {
                this.fallbackCopyToClipboard(textToCopy);
                this.showCopySuccess(calculatorType);
            }
        }
    }

    getAgeResultsText() {
        const years = document.getElementById('age-years')?.textContent || '0';
        const months = document.getElementById('age-months')?.textContent || '0';
        const days = document.getElementById('age-days')?.textContent || '0';
        const totalDays = document.getElementById('total-days')?.textContent || '0';
        const nextBirthday = document.getElementById('next-birthday')?.textContent || '-';
        
        return `Age: ${years} years, ${months} months, ${days} days\nTotal Days: ${totalDays}\nNext Birthday: ${nextBirthday}`;
    }

    getDateResultsText() {
        const years = document.getElementById('diff-years')?.textContent || '0';
        const months = document.getElementById('diff-months')?.textContent || '0';
        const days = document.getElementById('diff-days')?.textContent || '0';
        const totalDays = document.getElementById('diff-total-days')?.textContent || '0';
        const businessDays = document.getElementById('diff-business-days')?.textContent || '0';
        
        return `Date Difference: ${years} years, ${months} months, ${days} days\nTotal Days: ${totalDays}\nBusiness Days: ${businessDays}`;
    }

    getTimeResultsText() {
        const operationResult = document.getElementById('time-operation-result')?.textContent || '00:00:00';
        const durationResult = document.getElementById('time-duration-result')?.textContent || '00:00:00';
        
        return `Time Operation Result: ${operationResult}\nTime Duration: ${durationResult}`;
    }

    getDurationResultsText() {
        const years = document.getElementById('duration-years')?.textContent || '0';
        const months = document.getElementById('duration-months')?.textContent || '0';
        const weeks = document.getElementById('duration-weeks')?.textContent || '0';
        const days = document.getElementById('duration-days')?.textContent || '0';
        const totalDays = document.getElementById('duration-total-days')?.textContent || '0';
        const businessDays = document.getElementById('duration-business-days')?.textContent || '0';
        
        return `Duration: ${years} years, ${months} months, ${weeks} weeks, ${days} days\nTotal Days: ${totalDays}\nBusiness Days: ${businessDays}`;
    }

    getPriceResultsText() {
        const rate = document.getElementById('price-rate')?.value || '0';
        const hours = document.getElementById('price-hours')?.value || '0';
        const minutes = document.getElementById('price-minutes')?.value || '0';
        const price = document.getElementById('price-result')?.textContent || 'Rs 0.00';
        return `Rate: Rs ${rate}/hour\nTime: ${hours} hours, ${minutes} minutes\nTotal Price: ${price}`;
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    }

    showCopySuccess(calculatorType) {
        const button = document.querySelector(`#${calculatorType}-calculator .btn--primary`);
        if (button) {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('btn--success');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('btn--success');
            }, 2000);
        }
    }

    clearCalculator(calculatorType) {
        console.log('Clearing calculator:', calculatorType);
        
        switch (calculatorType) {
            case 'age':
                const birthDateInput = document.getElementById('birth-date');
                if (birthDateInput) birthDateInput.value = '';
                this.clearAgeResults();
                break;
            case 'date':
                const dateInputs = ['start-date', 'end-date', 'base-date', 'add-days'];
                dateInputs.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.value = '';
                });
                this.updateElementText('date-math-result', '-');
                this.clearDateResults();
                break;
            case 'time':
                const timeInputs = ['time1-hours', 'time1-minutes', 'time1-seconds', 'time2-hours', 'time2-minutes', 'time2-seconds', 'start-time', 'end-time'];
                timeInputs.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.value = '';
                });
                this.updateElementText('time-operation-result', '00:00:00');
                this.clearTimeDurationResults();
                break;
            case 'duration':
                const durationInputs = ['duration-start', 'duration-end'];
                durationInputs.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.value = '';
                });
                this.clearDurationResults();
                break;
            case 'price':
                const priceInputs = ['price-rate', 'price-hours', 'price-minutes'];
                priceInputs.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.value = '';
                });
                this.updateElementText('price-result', 'Rs 0.00');
                break;
        }
    }
}

// Global functions for HTML onclick handlers
function copyResults(calculatorType) {
    console.log('Copy results called for:', calculatorType);
    if (window.calculator) {
        window.calculator.copyResults(calculatorType);
    }
}

function clearCalculator(calculatorType) {
    console.log('Clear calculator called for:', calculatorType);
    if (window.calculator) {
        window.calculator.clearCalculator(calculatorType);
    }
}

function calculateDateMath() {
    console.log('Calculate date math called');
    if (window.calculator) {
        window.calculator.calculateDateMath();
    }
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                if (window.calculator) window.calculator.switchTab('age');
                break;
            case '2':
                e.preventDefault();
                if (window.calculator) window.calculator.switchTab('date');
                break;
            case '3':
                e.preventDefault();
                if (window.calculator) window.calculator.switchTab('time');
                break;
            case '4':
                e.preventDefault();
                if (window.calculator) window.calculator.switchTab('duration');
                break;
        }
    }
});

// Add touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold && window.calculator) {
        const tabs = ['age', 'date', 'time', 'duration'];
        const activeTab = document.querySelector('.nav__tab--active');
        if (activeTab) {
            const currentTab = activeTab.getAttribute('data-tab');
            const currentIndex = tabs.indexOf(currentTab);
            
            if (diff > 0 && currentIndex < tabs.length - 1) {
                // Swipe left - next tab
                window.calculator.switchTab(tabs[currentIndex + 1]);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous tab
                window.calculator.switchTab(tabs[currentIndex - 1]);
            }
        }
    }
}