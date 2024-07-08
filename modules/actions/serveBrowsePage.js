import semver from 'semver';

import asyncHandler from '../utils/asyncHandler.js';
import { getVersionsAndTags } from '../utils/npm.js';
import { packageCache } from '../utils/npm.js';

import { filesize } from 'filesize';

function byVersion(a, b) {
    return semver.lt(a, b) ? -1 : semver.gt(a, b) ? 1 : 0;
}

function sortObjectByKeys(obj) {
    const sortedKeys = Object.keys(obj).sort();
    const newObj = {};
    sortedKeys
        .filter(k => obj[k].type === 'directory')
        .forEach(key => {
            newObj[key] = obj[key];
        });

    sortedKeys
        .filter(k => obj[k].type !== 'directory')
        .forEach(key => {
            newObj[key] = obj[key];
        });
    return newObj;
}

async function getAvailableVersions(packageName, log) {
    const versionsAndTags = await getVersionsAndTags(packageName, log);
    return versionsAndTags ? versionsAndTags.versions.sort(byVersion) : [];
}

async function serveBrowsePage(req, res) {
    const availableVersions = await getAvailableVersions(
        req.packageName,
        req.log
    );
    const data = {
        packageName: req.packageName,
        packageVersion: req.packageVersion,
        availableVersions: availableVersions,
        filename: req.filename,
        target: req.browseTarget
    };

    const html = `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Index of ${data.filename}</title>
  <style>
    body {
      font-size: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      padding: 0 10px 5px
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font: .85em Monaco, monospace;
      overflow-x: auto;
      white-space: nowrap
    }

    tr.even {
      background-color: #eee
    }

    th {
      text-align: left
    }

    td,
    th {
      padding: .1em .25em
    }

    .version-wrapper {
      line-height: 2.25em;
      float: right
    }

    #version {
      font-size: 1em
    }

    address {
      text-align: right
    }
  </style>
</head>

<body>
  <div class="version-wrapper">
    <select id="version">
      <option value="${data.packageVersion}" selected>${
          data.packageVersion
      }</option>
      ${data.availableVersions
          .filter(k => k !== data.packageVersion)
          .map(k => `<option value="${k}">${k}</option>`)
          .join('')}
    </select>
  </div>
  <h1>Index of ${data.filename}</h1>
  <script>
    var s = document.getElementById('version')
      , v = s.value
    s.onchange = function () {
      window.location.href = window.location.href.replace('@' + v, '@' + s.value)
    }
  </script>
  <hr />
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Size</th>
        <th>Integrity</th>
      </tr>
    </thead>
    <tbody>
      ${(() => {
          const answers = [];
          const files = sortObjectByKeys(data.target.details);
          for (let file in files) {
              let fileName = file.replace(data.filename, '');
              if (files[file].type === 'directory') {
                  fileName += '/';
                  files[file].size = '-';
                  files[file].contentType = '-';
                  files[file].integrity = '-';
              } else {
                  files[file].size = filesize(files[file].size);
              }
              answers.push(`<tr class="${answers.length % 2 ? 'even' : 'odd'}">
            <td><a href="${fileName}" title="${fileName}">${fileName}</a></td>
            <td>${files[file].contentType}</td>
            <td>${files[file].size}</td>
            <td>${files[file].integrity}</td>`);
          }
          return answers.join('');
      })()}
    </tbody>
  </table>
  <hr />
  <address>${data.packageName}@${data.packageVersion}</address>
  ${req.isCached ? '<address>HIT in cache</address>' : ''}
</body>

</html>`;

    res.set({
        'Cache-Control': 'public, max-age=14400', // 4 hours
        'Cache-Tag': 'browse'
    }).send(html);
}

export default asyncHandler(serveBrowsePage);
