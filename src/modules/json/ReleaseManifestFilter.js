"use strict";
exports.__esModule = true;
exports.companyName = exports.ReleaseManifestFilter = exports.manifestPath = void 0;
exports.manifestPath = "./release.json";
var ReleaseManifestFilter = /** @class */ (function () {
    function ReleaseManifestFilter(release_version, release_message) {
        this.gravitee_release_version = release_version;
        this.gravitee_release_message = release_message;
    }
    /**
     * returning an A 2-dimensional array
     **/
    ReleaseManifestFilter.prototype.parse = function () {
        console.log("Gravitee Release Version: [" + this.gravitee_release_version + "]");
        console.log("Gravitee Release Message: [" + this.gravitee_release_message + "]");
        console.log("Parsing release.json not implemented yet");
    };
    return ReleaseManifestFilter;
}());
exports.ReleaseManifestFilter = ReleaseManifestFilter;
exports.companyName = "Gravitee.io";
/// let notVisibleFromOutside:string = "I'm a kind of protected property";
