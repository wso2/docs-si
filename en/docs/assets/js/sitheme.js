/*!
 * Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Initialize version dropdown toggle
var versionDropdownLink = document.querySelector('.md-header__version-select-dropdown .dropdown-link');
if (versionDropdownLink) {
    versionDropdownLink.onclick = function (e) {
        e.preventDefault();
        var container = document.getElementById('version-select-container');
        if (container) {
            container.classList.toggle('open');
        }
    };
}

// Close version dropdown when clicking outside
document.addEventListener('click', function (e) {
    var container = document.getElementById('version-select-container');
    if (container && !container.contains(e.target)) {
        container.classList.remove('open');
    }
});


/*
 * Reading versions
 */
var pageHeader = document.getElementById('page-header');
var docSetLang = pageHeader ? pageHeader.getAttribute('data-lang') : '';

(window.location.pathname.split('/')[1] !== docSetLang) ?
    docSetLang = '' :
    docSetLang = docSetLang + '/';

var docSetUrl = window.location.origin + '/' + docSetLang;
var request = new XMLHttpRequest();

var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
var versionsUrl = isLocal
    ? '/assets/versions.json'
    : 'https://raw.githubusercontent.com/wso2/docs-si/versions/en/docs/assets/versions.json';

request.open('GET', versionsUrl, true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {

      var data = JSON.parse(request.responseText);
      var dropdown = document.getElementById('version-select-dropdown');
      var checkVersionsPage = document.getElementById('current-version-stable');

      /*
       * Appending versions to the version selector dropdown
       */
      if (dropdown) {
          data.list.sort(function(a, b) {
              var aParts = a.split('.');
              var bParts = b.split('.');
              for (var i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                  var aPart = parseInt(aParts[i]) || 0;
                  var bPart = parseInt(bParts[i]) || 0;
                  if (aPart !== bPart) return aPart - bPart;
              }
              return 0;
          }).forEach(function(key) {
              var versionData = data.all[key];

              if (versionData) {
                  var liElem = document.createElement('li');
                  var currentPath = window.location.pathname;
                  var langPrefixLength = docSetLang ? docSetLang.length + 1 : 0;
                  var pathWithoutLang = currentPath.substring(langPrefixLength);
                  if (pathWithoutLang.startsWith('/')) pathWithoutLang = pathWithoutLang.substring(1);

                  var firstSlashIndex = pathWithoutLang.indexOf('/');
                  var pathWithoutVersion = (firstSlashIndex !== -1) ? pathWithoutLang.substring(firstSlashIndex) : '/';

                  var versionDoc = data.all[key].doc;
                  var docLinkType = versionDoc.split(':')[0];
                  var url = '';
                  var searchAndHash = window.location.search + window.location.hash;

                  if (docLinkType === 'https' || docLinkType === 'http') {
                      url = versionDoc.replace(/\/$/, '') + pathWithoutVersion;
                  } else {
                      url = docSetUrl + key + pathWithoutVersion;
                  }
                  url = url.replace(/\/$/, '') + searchAndHash;

                  liElem.innerHTML = '<a href="' + url + '">' + key + '</a>';

                  dropdown.insertBefore(liElem, dropdown.firstChild);
              }
          });
      }

      /*
       * Appending versions to the version tables in versions page
       */
      if (checkVersionsPage) {
          var previousVersions = [];

          Object.keys(data.all).forEach(function(key) {
              if ((key !== data.current) && (key !== data['pre-release'])) {
                  var doc = data.all[key].doc;
                  var notes = data.all[key].notes;
                  var target = '_self';

                  if (doc.startsWith('http')) {
                      target = '_blank';
                  } else {
                      doc = (docSetUrl + key + '/' + doc).replace(/([^:]\/)\/+/g, '$1');
                  }

                  if (notes && !notes.startsWith('http')) {
                      notes = (docSetUrl + key + '/' + notes).replace(/([^:]\/)\/+/g, '$1');
                  }

                  previousVersions.push('<tr>' +
                      '<th>' + key + '</th>' +
                      '<td><a href="' + doc + '" target="' + target + '">Documentation</a></td>' +
                      '<td><a href="' + (notes || '#') + '" target="' + target + '">Release Notes</a></td>' +
                      '</tr>');
              }
          });

          document.getElementById('previous-versions').innerHTML = previousVersions.join(' ');

          document.getElementById('current-version-number').innerHTML = data.current;
          var docDocLink = docSetUrl + data.current;
          var docNotesLink = data.all[data.current].notes
              ? docSetUrl + data.all[data.current].notes
              : docDocLink;

          document.getElementById('current-version-documentation-link').setAttribute('href', docDocLink);
          document.getElementById('current-version-release-notes-link').setAttribute('href', docNotesLink);
      }

  } else {
      console.error('We reached our target server, but it returned an error');
  }
};

request.onerror = function() {
    console.error('There was a connection error of some sort');
};

request.send();
