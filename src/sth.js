"use strict";

const catalogUrl = "reclist.php?sort=name&filter=.zip";
const sthArchive = ""; // GenX-DOS: STH archive removed

async function _fetchAndParseCatalog(_url) {
    // GenX-DOS: Stairway to Hell archive removed — no external fetch.
    return [];
}

export class StairwayToHell {
    constructor(onStart, onCat, onError, tape) {
        // Use https explicitly - document.location.protocol is 'file:' in Electron
        const protocol = document.location.protocol === "file:" ? "https:" : document.location.protocol;
        this._baseUrl = `${protocol}//${sthArchive}/${tape ? "tape" : "disk"}images/`;
        this._catalog = [];
        this._onStart = onStart;
        this._onCat = onCat;
        this._onError = onError;
    }

    async populate() {
        this._onStart();
        if (this._catalog.length === 0) {
            try {
                this._catalog = await _fetchAndParseCatalog(this._baseUrl + catalogUrl);
            } catch (error) {
                console.error("Failed to fetch catalog:", error);
                if (this._onError) this._onError();
                return;
            }
        }
        if (this._onCat) this._onCat(this._catalog);
    }

    async fetch(_file) {
        // GenX-DOS: STH archive removed — no external fetch.
        throw new Error("Stairway to Hell archive is disabled in GenX-DOS");
    }
}
