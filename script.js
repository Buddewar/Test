document.addEventListener('DOMContentLoaded', () => {
    const textEditor = document.getElementById('text-editor');
    const fontFamilySelect = document.getElementById('font-family');
    const fontWeightSelect = document.getElementById('font-weight');
    const italicStyleSelect = document.getElementById('italic-style');
    const saveButton = document.getElementById('save-btn');
    const resetButton = document.getElementById('reset-btn');
    const autosaveMessage = document.getElementById('autosave-message');

    let autoSaveTimeout;

    const loadSavedData = () => {
      const savedText = localStorage.getItem('text');
      const savedFontFamily = localStorage.getItem('fontFamily');
      const savedFontWeight = localStorage.getItem('fontWeight');
      const savedItalicStyle = localStorage.getItem('italicStyle');

      if (savedText) textEditor.value = savedText;
      if (savedFontFamily) fontFamilySelect.value = savedFontFamily;
      if (savedFontWeight) fontWeightSelect.value = savedFontWeight;
      if (savedItalicStyle) italicStyleSelect.value = savedItalicStyle;

      applyStyles();
    };

    const applyStyles = () => {
      textEditor.style.fontFamily = fontFamilySelect.value;
      textEditor.style.fontWeight = fontWeightSelect.value;
      textEditor.style.fontStyle = italicStyleSelect.value;
    };

    const saveData = () => {
      const now = new Date();
      localStorage.setItem('text', textEditor.value);
      localStorage.setItem('fontFamily', fontFamilySelect.value);
      localStorage.setItem('fontWeight', fontWeightSelect.value);
      localStorage.setItem('italicStyle', italicStyleSelect.value);
      localStorage.setItem('autosaveTime', now.toString());
      showAutosaveMessage(now);
    };

    const showAutosaveMessage = (time) => {
      autosaveMessage.textContent = `Auto-saved at ${time.toLocaleTimeString()}`;
      autosaveMessage.style.display = 'block';
      setTimeout(() => {
        autosaveMessage.style.display = 'none';
      }, 2000); 
    };

    const resetData = () => {
      textEditor.value = '';
      fontFamilySelect.value = 'Arial';
      fontWeightSelect.value = 'normal';
      italicStyleSelect.value = 'normal';
      applyStyles();
      saveData();
    };

    const downloadTextAsFile = () => {
      const text = textEditor.value;
      const blob = new Blob([text], { type: 'text/plain' });
      const anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(blob);
      anchor.download = 'text-editor-content.txt';
      anchor.click();
      URL.revokeObjectURL(anchor.href);
    };

    const handleInput = () => {
      clearTimeout(autoSaveTimeout);
      if (textEditor.value.trim() === '') {
        autoSaveTimeout = setTimeout(() => {
          saveData();
        }, 3000);
      } else {
        saveData();
      }
    };

    textEditor.addEventListener('input', handleInput);
    fontFamilySelect.addEventListener('change', () => {
      applyStyles();
      saveData();
    });
    fontWeightSelect.addEventListener('change', () => {
      applyStyles();
      saveData();
    });
    italicStyleSelect.addEventListener('change', () => {
      applyStyles();
      saveData();
    });

    saveButton.addEventListener('click', downloadTextAsFile);
    resetButton.addEventListener('click', resetData);

    fetch('fonts.json')
      .then(response => response.json())
      .then(fonts => {
        Object.keys(fonts).forEach(fontFamily => {
          const option = document.createElement('option');
          option.value = fontFamily;
          option.textContent = fontFamily;
          fontFamilySelect.appendChild(option);
        });

        fontFamilySelect.addEventListener('change', function() {
          const selectedFamily = this.value;
          const weights = fonts[selectedFamily];
          fontWeightSelect.innerHTML = ''; 
          if (weights) {
            Object.keys(weights).forEach(weight => {
              const option = document.createElement('option');
              option.value = weight;
              option.textContent = weight;
              fontWeightSelect.appendChild(option);
            });
          }
        });

        fontFamilySelect.dispatchEvent(new Event('change'));

        loadSavedData();
      })
      .catch(error => console.error('Error loading font data:', error));
  });