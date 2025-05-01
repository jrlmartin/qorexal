const proseMirror = document.getElementById('prompt-textarea');
proseMirror.innerText = 'hello';
proseMirror.dispatchEvent(new Event('input', { bubbles: true }));



document.getElementById('prompt-textarea').innerText = 'Your text here';
// Then find and click the submit button
document.getElementById('composer-submit-button').click();