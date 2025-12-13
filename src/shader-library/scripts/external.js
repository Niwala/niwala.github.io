let externalWin = null;

//Open new window and sync
document.getElementById("openExternal").addEventListener("click", function() { 
    if (externalWin && !externalWin.closed) {
        externalWin.focus();
        return;
    }

    externalWin = window.open("", "ShaderWindow", "width=600,height=400,resizable=yes");

    //Write HTML + div for Ace + script for sync
    externalWin.document.write(`
        <html>
        <head>
            <title>Shader Editor</title>
            <!-- Ace Editor CDN -->
            <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.1/ace.js"></script>
        </head>
        <body style="margin:0;height:100vh;">
            <div id="externalEditor" style="width:100%;height:100%;"></div>

            <script>
                const mainWin = window.opener;

                //Initialize Ace
                const editor = ace.edit("externalEditor");
                editor.setTheme("ace/theme/monokai");
                editor.session.setMode("ace/mode/hlsl"); //HLSL mode
                editor.setValue(mainWin.document.getElementById("code-editor-area").value, -1); //load code
                editor.session.setUseWrapMode(true);

                //Send updates to main window
                editor.session.on('change', () => {
                    if(mainWin && !mainWin.closed) mainWin.postMessage({code: editor.getValue()}, "*");
                });

                //Receive updates from main window
                window.addEventListener("message", (e) => {
                    if(e.data.code !== undefined && editor.getValue() !== e.data.code) {
                        editor.setValue(e.data.code, -1);
                    }
                });
            <\/script>
        </body>
        </html>
    `);

    externalWin.document.close();
});

//Main window listens to external changes
window.addEventListener("message", (e) => {
    if(e.data.code !== undefined) {
        const mainTextarea = document.getElementById("code-editor-area");
        if(mainTextarea.value !== e.data.code) {
            mainTextarea.value = e.data.code;
        }
    }
});

//Send updates from main to external in real time
document.getElementById("code-editor-area").addEventListener("input", () => {
    if(externalWin && !externalWin.closed) {
        externalWin.postMessage({code: document.getElementById("code-editor-area").value}, "*");
    }
});
