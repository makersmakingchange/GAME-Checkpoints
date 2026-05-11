# Custom Resource Builder
Select the modules you want to include in your custom PDF.

<div class="print-selector-ui">
    <div class="checkbox-group">
        <h3><input type="checkbox" id="select-all"> Select All Modules</h3>
        <hr>
        <label><input type="checkbox" class="section-toggle" value="../"> <strong>Start Here:</strong> Welcome & Intro</label><br>
        <label><input type="checkbox" class="section-toggle" value="../alt-access/"> <strong>Equipment:</strong> Alternative Access</label><br>
        <label><input type="checkbox" class="section-toggle" value="../control-mods/"> <strong>Equipment:</strong> Controller Mods</label><br>
        <label><input type="checkbox" class="section-toggle" value="../video-game-accessibility/"> <strong>Equipment:</strong> Software Features</label><br>
        <label><input type="checkbox" class="section-toggle" value="../session-walkthrough/"> <strong>Best Practices:</strong> Session Walkthrough</label><br>
        <label><input type="checkbox" class="section-toggle" value="../profiles/"> <strong>Gamer Profiles:</strong> Success Stories</label><br>
    </div>

    <button id="generate-btn" onclick="buildAndPrint()" class="print-button" style="margin-top: 20px; cursor: pointer;">
        🖨️ Generate Custom PDF
    </button>
</div>

<div id="print-buffer"></div>
<div id="iframe-jail" style="display:none;"></div>

<script>
document.getElementById('select-all').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.section-toggle');
    checkboxes.forEach(cb => cb.checked = this.checked);
});

async function buildAndPrint() {
    const selected = document.querySelectorAll('.section-toggle:checked');
    if (selected.length === 0) {
        alert("Please select at least one section.");
        return;
    }

    const buffer = document.getElementById('print-buffer');
    const jail = document.getElementById('iframe-jail');
    const btn = document.getElementById('generate-btn');
    
    buffer.innerHTML = ""; 
    jail.innerHTML = "";
    btn.innerText = "⏳ Loading Content...";
    btn.disabled = true;

    for (let checkbox of selected) {
        const url = checkbox.value;
        
        // Create an invisible iframe to load the page
        const iframe = document.createElement('iframe');
        iframe.src = url;
        jail.appendChild(iframe);

        // Wait for the iframe to load
        await new Promise(resolve => {
            iframe.onload = () => {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    const content = doc.querySelector('.md-content__inner') || doc.querySelector('article');
                    
                    if (content) {
                        const clone = content.cloneNode(true);
                        // Clean up UI
                        const ui = clone.querySelectorAll('.print-button, .mmc-cta-container, .print-selector-ui, script');
                        ui.forEach(el => el.remove());

                        const sectionWrapper = document.createElement('div');
                        sectionWrapper.className = "printable-section";
                        sectionWrapper.appendChild(clone);
                        buffer.appendChild(sectionWrapper);
                    }
                } catch (e) {
                    console.error("Error grabbing content from " + url, e);
                }
                resolve();
            };
        });
    }

    btn.innerText = "🖨️ Generate Custom PDF";
    btn.disabled = false;

    if (buffer.children.length === 0) {
        alert("Could not load content. Please ensure you are viewing this on a web server (or mkdocs serve).");
        return;
    }

    // Trigger print
    setTimeout(() => { window.print(); }, 500);
}
</script>