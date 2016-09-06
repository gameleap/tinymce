/**
 * Mime.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Returns mime types for uris.
 */
define("ephox/imagetools/util/Mime", [], function() {
  function getUriPathName(uri) {
    var a = document.createElement('a');
    a.href = uri;
    return a.pathname;
  }

  function guessMimeType(uri) {
    var parts, ext, mimes, matches;

    if (uri.indexOf('data:') === 0) {
      uri = uri.split(',');
      matches = /data:([^;]+)/.exec(uri[0]);
      return matches ? matches[1] : '';
    } else {
      mimes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png'
      };

      parts = getUriPathName(uri).split('.');
      ext = parts[parts.length - 1];

      if (ext) {
        ext = ext.toLowerCase();
      }
      return mimes[ext];
    }
  }


  return {
    guessMimeType: guessMimeType
  };
});