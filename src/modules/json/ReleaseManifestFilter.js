"use strict";
exports.__esModule = true;
exports.companyName = exports.ReleaseManifestFilter = exports.manifestPath = void 0;
exports.manifestPath = "./release.json";
/**
 * 1./ extracts the scale : the `buildDependencies` element alone, as [scale.json]
 *
 *
 **/
var ReleaseManifestFilter = /** @class */ (function () {
    function ReleaseManifestFilter(release_version, release_branch) {
        this.gravitee_release_version = release_version;
        this.gravitee_release_branch = release_branch;
    }
    /**
     * returning an A 2-dimensional array
     **/
    ReleaseManifestFilter.prototype.parse = function () {
        console.log("Gravitee Release Branch: [" + this.gravitee_release_branch + "]");
        console.log("Gravitee Release Version: [" + this.gravitee_release_version + "]");
        console.log("Parsing release.json not implemented yet");
        var returnedArray = [[], [], []];
        return returnedArray;
    };
    /**
     * just checks if the file exists
     **/
    ReleaseManifestFilter.prototype.validateJSon = function () {
        console.log("Gravitee Release Branch: [" + this.gravitee_release_branch + "]");
        console.log("Gravitee Release Version: [" + this.gravitee_release_version + "]");
        console.log("Parsing release.json not implemented yet");
    };
    return ReleaseManifestFilter;
}());
exports.ReleaseManifestFilter = ReleaseManifestFilter;
exports.companyName = "Gravitee.io";
/// let notVisibleFromOutside:string = "I'm a kind of protected property";
