

const dataNode = document.querySelector('[id=data]')
const outputNode = document.querySelector('[id=output]')
const realtimeNode = document.querySelector('[id=realtime]')
const copyNode = document.querySelector('[id=copy]')

var procTimer, rt = false

const entry = (domain) =>
    domain === '' ? '' :
    `<span class='edit'>edit</span> <span class='number'>0</span><br>` +
    `<span class='set'>set url</span> <span class='url'>"${domain}"<br><span class='next'>next</span><br>`

const process = () => {
    localStorage.setItem('data', dataNode.innerText)
    const domainList = dataNode.innerText.split('\n')
    const output = `<span class='list'>config entries</span><br>${domainList.map(entry).join('')}<span class='end'>end</span>`
    requestAnimationFrame(() => outputNode.innerHTML = output)
}


const pasteProc = (e) => {
    e.preventDefault()
    var text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
}

const copyToClipboard = (text) => {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData('Text', text); 
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand('copy');  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn('Copy to clipboard failed.', ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

const initEventListeners = () => {
    dataNode.addEventListener('paste', pasteProc, false)
    dataNode.addEventListener('input', () => {
        copyNode.removeAttribute('status')
        if(rt) { process() }
        else {
            procTimer && clearTimeout(procTimer)
            procTimer = window.setTimeout(process, 400)
        }
    }, false)

    realtimeNode.addEventListener('change', (e) => {
        rt = e.target.checked
        localStorage.setItem('rt', rt)
    }, false)
    
    copyNode.addEventListener('click', () => copyToClipboard(outputNode.innerText) && copyNode.setAttribute('status', 'done'))
}

const init = () => {
    
    initEventListeners()
    
    const rtls = localStorage.getItem('rt')
    rt = realtimeNode.checked = rtls === null ? true : rtls === 'true'
    
    dataNode.innerText = localStorage.getItem('data') || 'google.com\nbing.com\n123.com'
    process()
}

init()
