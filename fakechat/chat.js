document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const messengerCard = document.getElementById('messengerCard');
    const bottomPanel = document.getElementById('bottomPanel');
    const chatHeader = document.getElementById('chatHeader');
    const chatContainer = document.getElementById('chatContainer');

    const settingsToggleButton = document.getElementById('settingsToggleButton');
    const globalSettingsContainer = document.getElementById('globalSettingsContainer');
    const chatNameInput = document.getElementById('chatNameInput');
    const chatStartTimeInput = document.getElementById('chatStartTimeInput');
    const useCustomStartTimeCheckbox = document.getElementById('useCustomStartTimeCheckbox');
    const useTimeShiftCheckbox = document.getElementById('useTimeShiftCheckbox');

    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const languageRadios = document.querySelectorAll('input[name="language"]');
    const fontFamilyRadios = document.querySelectorAll('input[name="fontFamily"]');

    const meMessageInput = document.getElementById('meMessageInput');
    const sendAsMeButton = document.getElementById('sendAsMeButton');
    const friendMessageInput = document.getElementById('friendMessageInput');
    const sendAsFriendButton = document.getElementById('sendAsFriendButton');
    const friendSenderLabelElement = document.getElementById('friendSenderLabel');

    // --- UI Strings & State ---
    const uiStrings = {
        en: {
            defaultChatHeader: "Fake Chat", chatNamePlaceholder: "Chat Name",
            emptyChatMessage: "No messages yet. Start conversation!",
            settingsButtonTitle: "Settings", timeSettingsLegend: "Time Settings:",
            chatStartTimeLabel: "Chat Start Time (HH:MM if shift is ON):",
            useCustomStartTimeLabel: "Use custom start time (if shift is ON)",
            useTimeShiftLabel: "Use time shift for messages",
            themeLabel: "Theme:", themeLightLabel: "Light", themeDarkLabel: "Dark",
            fontFamilyLabel: "Font Family:", fontFamilySystemLabel: "System", fontFamilySerifLabel: "Serif", fontFamilyMonoLabel: "Monospace",
            languageLabel: "Language:", langEnLabel: "English", langRuLabel: "Русский",
            meSenderLabel: "Me:", meMessagePlaceholder: "Your message... (Supports **bold**, *italic*, ~~strike~~, `code`)",
            friendSenderLabelChar: "F:", friendMessagePlaceholder: "Friend's message... (Markdown enabled)",
            sendAsMeButtonTitle: "Send as Me", sendAsFriendButtonTitle: "Send as Friend",
            magicWordResponse: "✨ You found a magic word! ✨"
        },
        ru: {
            defaultChatHeader: "Фейк Чат", chatNamePlaceholder: "Название чата",
            emptyChatMessage: "Сообщений пока нет. Начните диалог!",
            settingsButtonTitle: "Настройки", timeSettingsLegend: "Настройки времени:",
            chatStartTimeLabel: "Время начала (ЧЧ:ММ, если сдвиг вкл.):",
            useCustomStartTimeLabel: "Исп. свое время начала (если сдвиг вкл.)",
            useTimeShiftLabel: "Использовать сдвиг времени для сообщений",
            themeLabel: "Тема:", themeLightLabel: "Светлая", themeDarkLabel: "Темная",
            fontFamilyLabel: "Шрифт:", fontFamilySystemLabel: "Системный", fontFamilySerifLabel: "Serif", fontFamilyMonoLabel: "Моноширинный",
            languageLabel: "Язык:", langEnLabel: "English", langRuLabel: "Русский",
            meSenderLabel: "Я:", meMessagePlaceholder: "Ваше сообщение... (Поддерживается **bold**, *italic*, ~~strike~~, `code`)",
            friendSenderLabelChar: "Д:", friendMessagePlaceholder: "Сообщение друга... (Markdown вкл.)",
            sendAsMeButtonTitle: "Отправить от меня", sendAsFriendButtonTitle: "Отправить от друга",
            magicWordResponse: "✨ Вы нашли волшебное слово! ✨"
        }
    };
    let currentLang = 'en';
    let lastMessageTime = null;
    let konamiCodePosition = 0;
    let headerClickCount = 0;
    let headerClickTimer = null;

    // --- Core Functions ---
    function setCssVariables() {
        if (bottomPanel) {
            document.documentElement.style.setProperty('--bottom-panel-height', `${bottomPanel.offsetHeight}px`);
        }
        if (chatHeader) {
            document.documentElement.style.setProperty('--header-height', `${chatHeader.offsetHeight}px`);
        }
    }

    function applyTheme(theme, temporary = false, duration = 3000) {
        const currentTheme = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
        let newTheme = theme;
        if (theme === 'toggle') { newTheme = currentTheme === 'dark' ? 'light' : 'dark'; }
        document.documentElement.classList.toggle('dark-theme', newTheme === 'dark');
        if (!temporary) {
            localStorage.setItem('messengerTheme', newTheme);
            const radioToCheck = document.querySelector(`input[name="theme"][value="${newTheme}"]`);
            if (radioToCheck) radioToCheck.checked = true;
        } else {
            setTimeout(() => {
                document.documentElement.classList.toggle('dark-theme', currentTheme === 'dark');
            }, duration);
        }
    }

    function applyFontFamily(fontSetting) {
        let fontFamilyVar = 'var(--ui-font-family-system)'; // Default
        if (fontSetting === 'serif') fontFamilyVar = 'var(--ui-font-family-serif)';
        else if (fontSetting === 'mono') fontFamilyVar = 'var(--ui-font-family-mono)';

        document.documentElement.style.setProperty('--ui-font-family', fontFamilyVar);
        localStorage.setItem('messengerFontFamily', fontSetting);

        const radioToCheck = document.querySelector(`input[name="fontFamily"][value="${fontSetting}"]`);
        if (radioToCheck) radioToCheck.checked = true;
    }


    function applyLanguage(lang) {
        currentLang = lang;
        const s = uiStrings[lang];
        document.documentElement.lang = lang;
        chatHeader.textContent = chatNameInput.value.trim() || s.defaultChatHeader;
        chatNameInput.placeholder = s.chatNamePlaceholder;
        chatContainer.setAttribute('data-empty-message', s.emptyChatMessage);
        settingsToggleButton.setAttribute('aria-label', s.settingsButtonTitle);
        document.getElementById('timeSettingsLegend').textContent = s.timeSettingsLegend;
        document.getElementById('chatStartTimeLabel').textContent = s.chatStartTimeLabel;
        document.getElementById('useCustomStartTimeLabel').textContent = s.useCustomStartTimeLabel;
        document.getElementById('useTimeShiftLabel').textContent = s.useTimeShiftLabel;
        document.getElementById('themeLabel').textContent = s.themeLabel;
        document.getElementById('themeLightLabel').textContent = s.themeLightLabel;
        document.getElementById('themeDarkLabel').textContent = s.themeDarkLabel;
        document.getElementById('fontFamilyLabel').textContent = s.fontFamilyLabel;
        document.getElementById('fontFamilySystemLabel').textContent = s.fontFamilySystemLabel;
        document.getElementById('fontFamilySerifLabel').textContent = s.fontFamilySerifLabel;
        document.getElementById('fontFamilyMonoLabel').textContent = s.fontFamilyMonoLabel;
        document.getElementById('languageLabel').textContent = s.languageLabel;
        document.getElementById('meSenderLabel').textContent = s.meSenderLabel;
        meMessageInput.placeholder = s.meMessagePlaceholder;
        sendAsMeButton.setAttribute('aria-label', s.sendAsMeButtonTitle);
        friendSenderLabelElement.textContent = s.friendSenderLabelChar;
        friendMessageInput.placeholder = s.friendMessagePlaceholder;
        sendAsFriendButton.setAttribute('aria-label', s.sendAsFriendButtonTitle);
        localStorage.setItem('messengerLanguage', lang);
    }
    function updateChatHeader() {
        const name = chatNameInput.value.trim();
        const newChatName = name || uiStrings[currentLang].defaultChatHeader;
        chatHeader.textContent = newChatName;
        if (name) localStorage.setItem('messengerChatName', name);
        else localStorage.removeItem('messengerChatName');
        if (name.toLowerCase() === 'party time') {
            if(messengerCard) messengerCard.classList.add('party-mode');
        } else {
            if(messengerCard) messengerCard.classList.remove('party-mode');
        }
    }
    function handleTimeSettingsChange() {
        const timeShiftActive = useTimeShiftCheckbox.checked;
        const useCustomStart = useCustomStartTimeCheckbox.checked;
        useCustomStartTimeCheckbox.disabled = !timeShiftActive;
        chatStartTimeInput.disabled = !timeShiftActive || !useCustomStart;
        if (!timeShiftActive) {
            useCustomStartTimeCheckbox.checked = false;
            chatStartTimeInput.value = '';
            chatStartTimeInput.disabled = true;
        } else { if (!useCustomStart) { chatStartTimeInput.value = ''; } }
        localStorage.setItem('messengerUseTimeShift', timeShiftActive.toString());
        localStorage.setItem('messengerUseCustomStartTime', useCustomStartTimeCheckbox.checked.toString());
        localStorage.setItem('messengerChatStartTime', chatStartTimeInput.value);
        if (chatContainer.children.length === 0 || !timeShiftActive) { lastMessageTime = null; }
    }

    function parseMarkdown(text) {
        // First, escape HTML special characters to prevent XSS.
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        // Apply Markdown rules (order can be important)
        // Inline code: `code` (should be processed early to protect its content)
        html = html.replace(/`([^`]+?)`/g, '<code>$1</code>');

        // Bold: **text** or __text__
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // Italic: *text* or _text_
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');

        // Strikethrough: ~~text~~
        html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');
        
        // Convert newlines to <br> for display in HTML
        html = html.replace(/\n/g, '<br>');

        return html;
    }


    function getNextMessageTime() {
        let currentTime;
        if (!useTimeShiftCheckbox.checked) {
            currentTime = new Date(); lastMessageTime = currentTime;
            return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (!lastMessageTime) { // First message when time shift is ON
            if (useCustomStartTimeCheckbox.checked) {
                const startTimeValue = chatStartTimeInput.value;
                if (startTimeValue) {
                    const [hours, minutes] = startTimeValue.split(':').map(Number);
                    currentTime = new Date(); currentTime.setHours(hours, minutes, 0, 0);
                } else { currentTime = new Date(); } // Fallback if custom checked but no time
            } else { currentTime = new Date(); } // Use real current time
        } else { // Subsequent messages when time shift is ON
            const randomMinutes = Math.floor(Math.random() * 10); // 0 to 9 minutes
            currentTime = new Date(lastMessageTime.getTime() + randomMinutes * 60000);
        }
        lastMessageTime = currentTime;
        return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function addMessageToChat(text, type, isSpecial = false) {
        if (!text.trim() && !isSpecial) return; // Don't add empty messages unless special
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);

        const messageTextP = document.createElement('p');
        messageTextP.classList.add('message-text');

        if (isSpecial) { // Easter egg message
            messageDiv.style.backgroundColor = 'var(--easter-egg-color2)';
            messageDiv.style.color = 'var(--card-bg-color)';
            messageDiv.style.alignSelf = 'center';
            messageDiv.style.maxWidth = '80%';
            messageTextP.textContent = text; // Special messages don't use Markdown
        } else {
            messageTextP.innerHTML = parseMarkdown(text); // Regular messages use Markdown
        }
        messageDiv.appendChild(messageTextP);

        if (!isSpecial) {
            const timestampSpan = document.createElement('span');
            timestampSpan.classList.add('timestamp');
            timestampSpan.textContent = getNextMessageTime();
            messageDiv.appendChild(timestampSpan);
        }

        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to new message
    }

    function handleSendMessage(senderType) {
        let messageText, messageType, inputElement;
        if (senderType === 'me') {
            messageText = meMessageInput.value;
            messageType = 'sent'; inputElement = meMessageInput;
        } else {
            messageText = friendMessageInput.value;
            messageType = 'received'; inputElement = friendMessageInput;
        }
        if (messageText.toLowerCase() === 'abracadabra') {
            addMessageToChat(uiStrings[currentLang].magicWordResponse, 'received', true);
            inputElement.value = ''; autoResizeTextarea(inputElement); return;
        }
        // Do not trim here, let parseMarkdown handle whitespace.
        // addMessageToChat will check for effectively empty messages.
        addMessageToChat(messageText, messageType);
        inputElement.value = ''; 
        autoResizeTextarea(inputElement); 
        inputElement.focus();
    }
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto'; // Temporarily shrink to get correct scrollHeight
        let newHeight = textarea.scrollHeight;
        const maxHeight = parseInt(window.getComputedStyle(textarea).maxHeight, 10) || Infinity;

        if (textarea.scrollHeight > maxHeight) { 
            textarea.style.overflowY = 'auto'; 
        } else { 
            textarea.style.overflowY = 'hidden'; 
        }
        textarea.style.height = Math.min(newHeight, maxHeight) + 'px';
    }
    
    function toggleSettingsPanel() {
        const isOpen = globalSettingsContainer.classList.toggle('open');
        settingsToggleButton.setAttribute('aria-expanded', isOpen.toString());
    }

    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === konamiSequence[konamiCodePosition].toLowerCase()) {
            konamiCodePosition++;
            if (konamiCodePosition === konamiSequence.length) {
                document.body.classList.add('konami-active');
                setTimeout(() => document.body.classList.remove('konami-active'), 5000);
                konamiCodePosition = 0;
            }
        } else { 
            konamiCodePosition = 0; 
        }
    });
    if(chatHeader) {
        chatHeader.addEventListener('click', () => {
            headerClickCount++;
            if (headerClickTimer) clearTimeout(headerClickTimer);
            if (headerClickCount >= 5) {
                applyTheme('toggle', true, 2000); headerClickCount = 0;
            } else { 
                headerClickTimer = setTimeout(() => { headerClickCount = 0; }, 1000); 
            }
        });
    }

    // --- Event Listeners ---
    if (sendAsMeButton) sendAsMeButton.addEventListener('click', () => handleSendMessage('me'));
    if (sendAsFriendButton) sendAsFriendButton.addEventListener('click', () => handleSendMessage('friend'));
    
    [meMessageInput, friendMessageInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => autoResizeTextarea(input));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input === meMessageInput) sendAsMeButton.click();
                    else if (input === friendMessageInput) sendAsFriendButton.click();
                }
            });
        }
    });

    if (settingsToggleButton) {
        settingsToggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing immediately if document listener is mousedown
            toggleSettingsPanel();
        });
    }
    if (chatNameInput) chatNameInput.addEventListener('input', updateChatHeader);
    if (chatStartTimeInput) chatStartTimeInput.addEventListener('change', handleTimeSettingsChange);
    if (useCustomStartTimeCheckbox) useCustomStartTimeCheckbox.addEventListener('change', handleTimeSettingsChange);
    if (useTimeShiftCheckbox) useTimeShiftCheckbox.addEventListener('change', handleTimeSettingsChange);
    
    themeRadios.forEach(radio => radio.addEventListener('change', (e) => applyTheme(e.target.value)));
    languageRadios.forEach(radio => radio.addEventListener('change', (e) => applyLanguage(e.target.value)));
    fontFamilyRadios.forEach(radio => radio.addEventListener('change', (e) => applyFontFamily(e.target.value)));

    // Close settings on click outside
    document.addEventListener('mousedown', function(event) {
        if (globalSettingsContainer.classList.contains('open')) {
            // Check if the click is outside the settings container AND not on the toggle button
            if (!globalSettingsContainer.contains(event.target) && 
                event.target !== settingsToggleButton && 
                !settingsToggleButton.contains(event.target) // In case the button has child elements like SVG
            ) {
                toggleSettingsPanel();
            }
        }
    });
    if (globalSettingsContainer) {
        globalSettingsContainer.addEventListener('mousedown', function(event) {
            event.stopPropagation(); // Prevent clicks inside settings from closing it via document listener
        });
    }
    
    // Observe bottom panel resize to update CSS variable
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === bottomPanel || entry.target === chatHeader) {
                setCssVariables();
            }
        }
    });

    // --- Initialization ---
    function initialize() {
        setCssVariables(); // Set initial heights for CSS variables
        if (bottomPanel) resizeObserver.observe(bottomPanel);
        if (chatHeader) resizeObserver.observe(chatHeader);
        // In a more complex app with dynamic elements, you might want to disconnect the observer
        // when elements are removed, e.g., `resizeObserver.disconnect();`

        const savedTheme = localStorage.getItem('messengerTheme') || 'light';
        applyTheme(savedTheme);

        const savedFontFamily = localStorage.getItem('messengerFontFamily') || 'system';
        applyFontFamily(savedFontFamily);

        const savedLang = localStorage.getItem('messengerLanguage') || 'en';
        const langRadio = document.querySelector(`input[name="language"][value="${savedLang}"]`);
        if (langRadio) langRadio.checked = true;
        // Apply language must come after other settings if UI strings depend on them (not directly here, but good practice)
        applyLanguage(savedLang); 

        const savedChatName = localStorage.getItem('messengerChatName');
        if(chatNameInput) chatNameInput.value = savedChatName || '';
        updateChatHeader(); // Call after language is set for default header text

        const savedUseTimeShift = localStorage.getItem('messengerUseTimeShift');
        if(useTimeShiftCheckbox) useTimeShiftCheckbox.checked = savedUseTimeShift === null ? true : (savedUseTimeShift === 'true');
        
        const savedUseCustomStartTime = localStorage.getItem('messengerUseCustomStartTime');
        if(useCustomStartTimeCheckbox) useCustomStartTimeCheckbox.checked = savedUseCustomStartTime === 'true';
        
        const savedChatStartTime = localStorage.getItem('messengerChatStartTime');
        if (chatStartTimeInput && savedChatStartTime) chatStartTimeInput.value = savedChatStartTime;
        handleTimeSettingsChange(); // Apply dependencies for time settings

        if(meMessageInput) autoResizeTextarea(meMessageInput);
        if(friendMessageInput) autoResizeTextarea(friendMessageInput);
        if(meMessageInput) meMessageInput.focus();
    }

    initialize(); // Call initialization
    window.addEventListener('resize', setCssVariables); // Recalculate on window resize for responsive adjustments

});