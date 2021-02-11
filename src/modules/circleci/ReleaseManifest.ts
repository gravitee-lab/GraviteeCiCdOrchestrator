/*
Author (Copyright) 2020 <Jean-Baptiste-Lasselle>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

If your software can interact with users remotely through a computer
network, you should also make sure that it provides a way for users to
get its source.  For example, if your program is a web application, its
interface could display a "Source" link that leads users to an archive
of the code.  There are many ways you could offer source, and different
solutions will be better for different programs; see section 13 for the
specific requirements.

You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU AGPL, see
<https://www.gnu.org/licenses/>.
*/
import * as shelljs from 'shelljs';
import * as fs from 'fs';
import * as arrayUtils from 'util';
// export const manifestPath : string = "release-data/apim/1.30.x/tests/release.json";
const manifestPath : string = process.env.RELEASE_MANIFEST_PATH;

if (!fs.existsSync(manifestPath)) {
  throw new Error("{[ReleaseManifestFilter]} - [" + `${manifestPath}` + "] does not exists, stopping release process");
} else {
  console.log("{[ReleaseManifestFilter]} - found release.json release manifest located at [" + manifestPath + "]");
}
console.info("{[ReleaseManifestFilter]} - Parsing release.json Release Manifest file located at [" + manifestPath + "]");
console.debug("{[ReleaseManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.releaseManifest, null, "  ")}` + "]");
let manifestAsString: string = fs.readFileSync(`${manifestPath}`,'utf8');

export const releaseManifest = JSON.parse(manifestAsString);

let tempVersion = releaseManifest.version;
if (tempVersion.endsWith('-SNAPSHOT')) {
  tempVersion = tempVersion.substr(0, tempVersion.length - 9 );
}

export const gioReleaseVersion = tempVersion;

console.log(`{src/modules/circleci/ReleaseManifest.ts} : DEBUG tracking down if I catch properly [gioReleaseVersion]=[${gioReleaseVersion}]`)
