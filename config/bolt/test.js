configure({
  sources: [
    source('amd', 'ephox.boulder.test', '../../src/test/js/module', mapper.hierarchical),
    source('amd', 'ephox.agar', '../../../agar/src/main/js', mapper.hierarchical),
    source('amd', 'ephox.wrap.Jsc', '../../lib/test', mapper.flat)
  ]
});
