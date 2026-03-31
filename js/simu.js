function initSimulatorForm() {
    const formEl = document.getElementById('simuForm');
    const messageEl = document.getElementById('simuMessage');
    const fieldIds = ['initialCapital', 'annualRate', 'monthlyContribution', 'years'];

    if (!formEl || !messageEl) {
        return;
    }

    function showError(message) {
        messageEl.textContent = message;
        messageEl.classList.remove('hidden');
    }

    function clearError() {
        messageEl.textContent = '';
        messageEl.classList.add('hidden');
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
                showError('Tous les champs sont obligatoires.');
                return;
            }

            const error = validateField(fieldId, value);
            if (error) {
                showError(error);
                return;
            }
        }

        clearError();

        const formData = new FormData(formEl);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulatorForm);
} else {
    initSimulatorForm();
}

