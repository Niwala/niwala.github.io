class PackedData
{

    constructor()
    {
        this.shader = "";
    }

    CompressToURL()
    {
        let data = JSON.stringify(this);
        const compressed = pako.deflate(data);
        const base64 = btoa(String.fromCharCode(...compressed));
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    DecompressURL(url)
    {
        const base64 = url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(base64);
        const byteArray = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
            byteArray[i] = decoded.charCodeAt(i);
        }
        const decompressed = pako.inflate(byteArray, { to: 'string' });
        let json = JSON.parse(decompressed);
        Object.assign(this, json);
        console.log("Uncompressed shader : \n" + json.shader);
    }
}