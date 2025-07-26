document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // 1. DOM ЭЛЕМЕНТЫ
    // =================================================================================
    const dom = {
        html: document.documentElement, body: document.body, editor: document.getElementById('editor'),
        appContainer: document.getElementById('app-container'), charCountEl: document.getElementById('char-count'),
        wordCountEl: document.getElementById('word-count'), pageCountEl: document.getElementById('page-count'),
        modeSelect: document.getElementById('mode-select'), punishmentSelect: document.getElementById('punishment-select'),
        sprintSettings: document.getElementById('sprint-settings'), driveSettings: document.getElementById('drive-settings'),
        sprintDurationInput: document.getElementById('sprint-duration'), driveGoalInput: document.getElementById('drive-goal'),
        waitTimeInput: document.getElementById('wait-time'), deleteSpeedInput: document.getElementById('delete-speed'),
        waitTimeGroup: document.getElementById('wait-time-group'), deleteSpeedGroup: document.getElementById('delete-speed-group'),
        stopSessionButton: document.getElementById('stop-session-button'), saveButton: document.getElementById('save-button'),
        ideaButton: document.getElementById('idea-button'),
        copyEditorButton: document.getElementById('copy-editor-button'),
        mobileCopyEditorButton: document.getElementById('mobile-copy-editor-button'),
        themeSwitcher: document.getElementById('theme-switcher'), languageSwitcher: document.getElementById('language-switcher'),
        settingsContainer: document.getElementById('settings-container'), settingsHeader: document.getElementById('settings-header'),
        progressContainer: document.getElementById('progress-container'),
        progressBar: document.getElementById('progress-bar'),
        showProgressToggle: document.getElementById('show-progress-toggle'), // Новый элемент
        successModal: document.getElementById('success-modal'), successTitleEl: document.getElementById('success-title'),
        successMessageEl: document.getElementById('success-message'), closeModalButton: document.getElementById('close-modal-button'),
    };

    // =================================================================================
    // 2. КОНСТАНТЫ И ЛОКАЛИЗАЦИЯ
    // =================================================================================
    const PAGE_SIZE = 1800;
    const CHAR_LIMIT = 30000;
    const IDEAS = { ru: [ "Что если бы главный герой мог слышать мысли животных, но только тех, которые его недолюбливают?", "Что если бы однажды все тени людей начали жить своей жизнью?", "Что если бы технологии научились материализовывать эмоции?", "Что если бы все зеркала в мире в одночасье стали порталами в случайные места?", "Что если бы вы проснулись в мире, где никто не помнит о вашем существовании, кроме одного незнакомца?", "Что если бы Земля перестала вращаться, но только на одной половине планеты?", "Что если бы вы могли пережить заново один любой день своей жизни, но с последствиями для будущего?", "Что если бы все написанные на бумаге слова можно было съесть, и они давали бы вам знания, которые содержат?", "Что если бы ложь физически оставляла на человеке видимый след, например, шрам?", "Что если бы у людей появился орган, который позволяет им чувствовать ближайшее будущее, но не видеть его?", "Что если бы гравитация стала переменной и зависела бы от настроения людей в данной местности?" ], en: [ "What if the main character could hear animal thoughts, but only from those who dislike them?", "What if one day, everyone's shadows started living their own lives?", "What if technology learned to materialize emotions?", "What if all the mirrors in the world suddenly became portals to random places?", "What if you woke up in a world where no one remembers your existence, except for one stranger?", "What if Earth stopped rotating, but only on one hemisphere?", "What if you could relive any single day of your life, but it would have consequences for the future?", "What if all words written on paper could be eaten, and they would grant you the knowledge they contain?", "What if lying physically left a visible mark on a person, like a scar?", "What if humans developed an organ that allowed them to feel the immediate future, but not see it?", "What if gravity became variable, depending on the mood of the people in the area?" ]};
    const CONGRATS_MESSAGES = { ru: [ "Вы великолепны! Поток был с вами.", "Отличная работа!", "Задача выполнена. Вы — литературный титан!", "Вы это сделали! Муза аплодирует стоя.", "Превосходно!", "Невероятно! Вы победили прокрастинацию." ], en: [ "You are magnificent! The flow was with you.", "Excellent work!", "Task complete. You are a literary titan!", "You did it! The muse gives a standing ovation.", "Outstanding!", "Incredible! You have defeated procrastination." ]};
    const LANG_DATA = {
        ru: { title: "Поток", subtitle: "Начните писать, чтобы войти в режим фокуса.", editor_placeholder: "Начните писать здесь...", stats_chars: "Символы", stats_words: "Слова", stats_pages: "Страницы", settings_header: "Настройки", label_mode: "Режим", option_classic: "Классический", option_sprint: "Спринт (время)", option_drive: "Драйв (знаки)", label_sprint_duration: "Длительность (мин)", label_drive_goal: "Цель (знаков)", label_punishment: "Наказание", option_delete: "Удаление", option_soft: "Красные слова", option_shake: "Тряска", option_hardcore: "Ни шагу назад", option_impossible: "Страх и голод", label_wait_time: "Ожидание (сек)", label_delete_speed: "Скорость (зн/сек)", group_title_session: "Режим Сессии", group_title_app: "Настройки Приложения", btn_idea: "Идея", btn_save: "Сохранить", btn_copy: "Копировать", btn_copied: "Скопировано!", btn_stop: "Остановить", modal_goal_title: "Цель достигнута!", modal_sprint_title: "Время вышло!", btn_modal_continue: "Продолжить", label_show_progress: "Показывать шкалу прогресса" },
        en: { title: "The Flow", subtitle: "Start typing to enter focus mode.", editor_placeholder: "Start writing here...", stats_chars: "Characters", stats_words: "Words", stats_pages: "Pages", settings_header: "Settings", label_mode: "Mode", option_classic: "Classic", option_sprint: "Sprint (time)", option_drive: "Drive (chars)", label_sprint_duration: "Duration (min)", label_drive_goal: "Goal (chars)", label_punishment: "Punishment", option_delete: "Deletion", option_soft: "Red Words", option_shake: "Shaking", option_hardcore: "No Step Back", option_impossible: "Fear and Hunger", label_wait_time: "Idle Time (sec)", label_delete_speed: "Speed (char/s)", group_title_session: "Session Mode", group_title_app: "Application Settings", btn_idea: "Idea", btn_save: "Save", btn_copy: "Copy", btn_copied: "Copied!", btn_stop: "Stop", modal_goal_title: "Goal Reached!", modal_sprint_title: "Time's Up!", btn_modal_continue: "Continue", label_show_progress: "Show progress bar" }
    };

    // =================================================================================
    // 3. ГЛОБАЛЬНОЕ СОСТОЯНИЕ ПРИЛОЖЕНИЯ (STATE)
    // =================================================================================
    let state = {
        inactivityTimer: null, punishmentInterval: null, sessionTimer: null, sessionProgressInterval: null,
        isWritingSessionLive: false, isProgrammaticChange: false, currentLang: 'ru',
        showProgressBar: true, // Новое состояние
    };

    // =================================================================================
    // 4. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // =================================================================================
    const debounce = (func, delay) => { let timeout; return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), delay); }; };
    const setCaretAtEnd = () => {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(dom.editor);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        dom.editor.focus();
    };

    // =================================================================================
    // 5. ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ
    // =================================================================================
    const updateStats = () => {
        const text = dom.editor.textContent;
        const chars = text.length;
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        dom.charCountEl.textContent = chars; dom.wordCountEl.textContent = words; dom.pageCountEl.textContent = (chars / PAGE_SIZE).toFixed(2);
        
        if (state.isWritingSessionLive && dom.modeSelect.value === 'drive') {
            const goal = parseInt(dom.driveGoalInput.value, 10);
            const percentage = Math.min((chars / goal) * 100, 100);
            dom.progressBar.style.width = `${percentage}%`;
            if (chars >= goal) {
                completeSession(LANG_DATA[state.currentLang].modal_goal_title);
            }
        }
    };
    
    const saveToLocalStorage = () => localStorage.setItem('writer-app-html', dom.editor.innerHTML);
    const loadFromLocalStorage = () => { dom.editor.innerHTML = localStorage.getItem('writer-app-html') || ''; updateStats(); };
    
    const debouncedSave = debounce(saveToLocalStorage, 300);

    const enterFocusMode = () => { dom.appContainer.classList.add('focus-mode'); dom.stopSessionButton.classList.remove('hidden'); };
    const exitFocusMode = () => { dom.appContainer.classList.remove('focus-mode'); dom.stopSessionButton.classList.add('hidden'); };
    
    // --- Логика Наказаний ---
    const resetAllPunishments = () => {
        clearTimeout(state.inactivityTimer); clearInterval(state.punishmentInterval);
        dom.editor.classList.remove('punishment-deleting'); dom.body.classList.remove('punishment-shake-active');
        dom.editor.querySelectorAll('.punishment-word').forEach(span => span.replaceWith(document.createTextNode(span.textContent)));
        dom.editor.normalize();
    };
    
    const armPunishmentTimer = () => {
        resetAllPunishments();
        if (!state.isWritingSessionLive) return;
        const waitTime = (parseInt(dom.waitTimeInput.value, 10) || 5) * 1000;
        state.inactivityTimer = setTimeout(triggerPunishment, waitTime);
    };

    const triggerPunishment = () => {
        const type = dom.punishmentSelect.value;
        if (type === 'soft' || type === 'impossible') punishBySoft();
        if (type === 'delete' || type === 'hardcore' || type === 'impossible') punishByDeletion();
        if (type === 'shake' || type === 'impossible') dom.body.classList.add('punishment-shake-active');
    };
    
    const punishBySurgicalDeletion = () => {
        let lastNode = dom.editor.lastChild;
        while(lastNode) {
            if (lastNode.nodeType === Node.TEXT_NODE && lastNode.textContent.length > 0) {
                lastNode.deleteData(lastNode.nodeValue.length - 1, 1);
                break;
            }
            if (lastNode.nodeType === Node.ELEMENT_NODE && lastNode.tagName === 'BR') {
                const toRemove = lastNode;
                lastNode = lastNode.previousSibling;
                toRemove.remove();
                break;
            }
            if (lastNode.hasChildNodes()) {
                lastNode = lastNode.lastChild;
            } else {
                const toRemove = lastNode;
                lastNode = lastNode.previousSibling;
                toRemove.remove();
            }
        }
        updateStats();
        setCaretAtEnd();
    };

    const punishByDeletion = () => { clearInterval(state.punishmentInterval); const speed = parseInt(dom.deleteSpeedInput.value, 10) || 3; dom.editor.classList.add('punishment-deleting'); state.punishmentInterval = setInterval(punishBySurgicalDeletion, 1000 / speed); };
    
    const punishBySoft = () => {
        clearInterval(state.punishmentInterval);
        state.punishmentInterval = setInterval(() => {
            const walker = document.createTreeWalker(dom.editor, NodeFilter.SHOW_TEXT, null, false);
            let nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);
            for (const node of nodes.reverse()) {
                if (node.parentElement.className !== 'punishment-word' && node.textContent.trim().length > 0) {
                    const words = node.textContent.split(/(\s+)/);
                    const lastWordIndex = words.findLastIndex(w => w.trim().length > 0);
                    if (lastWordIndex !== -1) {
                        const range = document.createRange();
                        let charCount = 0;
                        for (let i = 0; i < lastWordIndex; i++) charCount += words[i].length;
                        range.setStart(node, charCount);
                        range.setEnd(node, charCount + words[lastWordIndex].length);
                        const span = document.createElement('span');
                        span.className = 'punishment-word';
                        range.surroundContents(span);
                        setCaretAtEnd();
                        return;
                    }
                }
            }
            clearInterval(state.punishmentInterval);
        }, 1000);
    };

    // --- Логика Сессий ---
    const startSession = (mode) => {
        state.isWritingSessionLive = true;
        enterFocusMode();
        armPunishmentTimer();
        
        // ИЗМЕНЕНО: Добавлена проверка на state.showProgressBar
        if ((mode === 'sprint' || mode === 'drive') && state.showProgressBar) {
            dom.progressContainer.classList.remove('hidden');
        }

        if (mode === 'sprint') {
            dom.progressContainer.classList.add('sprint-mode-progress');
            const duration = (parseInt(dom.sprintDurationInput.value, 10) || 25) * 60 * 1000;
            const startTime = Date.now();
            dom.progressBar.style.width = '100%';
            state.sessionTimer = setTimeout(() => completeSession(LANG_DATA[state.currentLang].modal_sprint_title), duration);
            
            clearInterval(state.sessionProgressInterval);
            state.sessionProgressInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const percentage = 100 - (elapsed / duration) * 100;
                dom.progressBar.style.width = `${Math.max(0, percentage)}%`;
            }, 1000);
        } else {
            dom.progressContainer.classList.remove('sprint-mode-progress');
            if (mode === 'drive') {
                dom.progressBar.style.width = '0%';
                updateStats();
            }
        }
    };
    
    const stopCurrentSession = (showCongrats = false, title = '') => {
        state.isWritingSessionLive = false;
        clearTimeout(state.sessionTimer);
        clearInterval(state.sessionProgressInterval);
        resetAllPunishments();
        exitFocusMode();
        dom.progressContainer.classList.add('hidden');
        dom.progressContainer.classList.remove('sprint-mode-progress');

        if (showCongrats) {
            dom.successTitleEl.textContent = title;
            dom.successMessageEl.textContent = CONGRATS_MESSAGES[state.currentLang][Math.floor(Math.random() * CONGRATS_MESSAGES[state.currentLang].length)];
            dom.successModal.classList.remove('hidden');
        }
    };

    const completeSession = (title) => {
        stopCurrentSession(true, title);
    };

    // --- Обработчики Настроек ---
    const handlePunishmentChange = () => { const type = dom.punishmentSelect.value; const showWait = type !== 'hardcore'; const showSpeed = type === 'delete' || type === 'hardcore' || type === 'impossible'; dom.waitTimeGroup.classList.toggle('hidden', !showWait); dom.deleteSpeedGroup.classList.toggle('hidden', !showSpeed); };
    const handleModeChange = () => { const mode = dom.modeSelect.value; dom.sprintSettings.classList.toggle('hidden', mode !== 'sprint'); dom.driveSettings.classList.toggle('hidden', mode !== 'drive'); if (state.isWritingSessionLive) stopCurrentSession(); };
    const applyTheme = (theme) => { if (theme === 'dark') { dom.html.classList.add('dark-theme'); dom.themeSwitcher.textContent = '☀️'; } else { dom.html.classList.remove('dark-theme'); dom.themeSwitcher.textContent = '🌙'; }};
    const applyLanguage = (lang) => { state.currentLang = lang; document.querySelectorAll('[data-lang-key]').forEach(el => { const key = el.dataset.langKey; const translation = LANG_DATA[lang][key]; if(translation) { if (el.hasAttribute('placeholder')) { el.setAttribute('placeholder', translation); } else { el.textContent = translation; } } });};

    // =================================================================================
    // 6. РЕГИСТРАЦИЯ ОБРАБОТЧИКОВ СОБЫТИЙ
    // =================================================================================
    dom.editor.addEventListener('input', () => {
        if (state.isProgrammaticChange) return;
        if (dom.editor.textContent.length >= CHAR_LIMIT) { const text = dom.editor.textContent.slice(0, CHAR_LIMIT); dom.editor.textContent = text; setCaretAtEnd(); dom.editor.classList.add('limit-reached'); setTimeout(() => dom.editor.classList.remove('limit-reached'), 500); return; }
        if (!state.isWritingSessionLive) {
            startSession(dom.modeSelect.value);
        }
        
        updateStats();
        debouncedSave();
        
        armPunishmentTimer();
    });

    dom.editor.addEventListener('keydown', (e) => { const type = dom.punishmentSelect.value; const isHardcore = (type === 'hardcore' || type === 'impossible') && state.isWritingSessionLive; if (isHardcore && (e.key === 'Backspace' || e.key === 'Delete')) e.preventDefault(); });
    dom.stopSessionButton.addEventListener('click', () => stopCurrentSession());
    dom.settingsHeader.addEventListener('click', () => { dom.settingsContainer.classList.toggle('collapsed'); dom.settingsHeader.querySelector('.arrow').innerHTML = dom.settingsContainer.classList.contains('collapsed') ? '▼' : '▲'; });
    
    dom.saveButton.addEventListener('click', () => {
        const text = dom.editor.textContent;
        const words = text.trim().split(/\s+/).slice(0, 3);
        const invalidCharsRegex = /[\\/:"*?<>|]/g;
        
        let baseName = 'поток-текст';
        if (words.length > 0 && words[0] !== '') {
            baseName = words.join('-').toLowerCase().replace(invalidCharsRegex, '');
        }
        
        const date = new Date().toISOString().slice(0, 10);
        const fileName = `${baseName}-${date}.txt`;

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    });
    
    const handleCopyClick = () => {
        const textToCopy = dom.editor.textContent;
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const copiedText = LANG_DATA[state.currentLang].btn_copied;
            [dom.copyEditorButton, dom.mobileCopyEditorButton].forEach(btn => {
                if (btn) {
                    btn.textContent = copiedText;
                    btn.disabled = true;
                }
            });

            setTimeout(() => {
                const originalText = LANG_DATA[state.currentLang].btn_copy;
                [dom.copyEditorButton, dom.mobileCopyEditorButton].forEach(btn => {
                    if (btn) {
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }
                });
            }, 1500);
        }).catch(err => {
            console.error('Ошибка копирования: ', err);
            alert('Не удалось скопировать текст.');
        });
    };

    dom.copyEditorButton.addEventListener('click', handleCopyClick);
    dom.mobileCopyEditorButton.addEventListener('click', handleCopyClick);
    
    dom.ideaButton.addEventListener('click', () => { state.isProgrammaticChange = true; let lastElement = dom.editor.lastElementChild; let newIdea; let lastKnownIdeaText = (lastElement && lastElement.classList.contains('suggested-idea')) ? lastElement.textContent : null; do { newIdea = IDEAS[state.currentLang][Math.floor(Math.random() * IDEAS[state.currentLang].length)]; } while (newIdea === lastKnownIdeaText && IDEAS[state.currentLang].length > 1); if (lastElement && lastElement.classList.contains('suggested-idea')) { lastElement.textContent = newIdea; } else { const newIdeaSpan = document.createElement('span'); newIdeaSpan.className = 'suggested-idea'; newIdeaSpan.textContent = newIdea; if (dom.editor.innerHTML.trim() !== '' && !dom.editor.innerHTML.trim().endsWith('<br>')) { dom.editor.append(document.createElement('br'), document.createElement('br')); } dom.editor.append(newIdeaSpan); } debouncedSave(); setCaretAtEnd(); state.isProgrammaticChange = false; });
    
    dom.themeSwitcher.addEventListener('click', () => { const newTheme = dom.html.classList.contains('dark-theme') ? 'light' : 'dark'; localStorage.setItem('writer-app-theme', newTheme); applyTheme(newTheme); });
    dom.languageSwitcher.addEventListener('click', () => { const newLang = state.currentLang === 'ru' ? 'en' : 'ru'; localStorage.setItem('writer-app-lang', newLang); applyLanguage(newLang); });
    dom.closeModalButton.addEventListener('click', () => dom.successModal.classList.add('hidden'));
    dom.modeSelect.addEventListener('change', handleModeChange);
    dom.punishmentSelect.addEventListener('change', handlePunishmentChange);
    
    // Новый обработчик для чекбокса
    dom.showProgressToggle.addEventListener('change', (e) => {
        state.showProgressBar = e.target.checked;
        localStorage.setItem('writer-app-show-progress', state.showProgressBar);
        // Если сессия активна, немедленно скрыть/показать шкалу
        if (state.isWritingSessionLive && (dom.modeSelect.value === 'sprint' || dom.modeSelect.value === 'drive')) {
            dom.progressContainer.classList.toggle('hidden', !state.showProgressBar);
        }
    });
    
    // =================================================================================
    // 7. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
    // =================================================================================
    const initialize = () => {
        loadFromLocalStorage();
        handleModeChange();
        handlePunishmentChange();

        const savedTheme = localStorage.getItem('writer-app-theme') || 'light';
        const savedLang = localStorage.getItem('writer-app-lang') || 'ru';
        
        // Загружаем настройку шкалы прогресса
        const savedProgressPref = localStorage.getItem('writer-app-show-progress');
        state.showProgressBar = savedProgressPref !== null ? savedProgressPref === 'true' : true; // По умолчанию true
        dom.showProgressToggle.checked = state.showProgressBar;
        
        applyTheme(savedTheme);
        applyLanguage(savedLang);

        dom.settingsContainer.classList.add('collapsed');
        dom.settingsHeader.querySelector('.arrow').innerHTML = '▼';
    };

    initialize();
});
