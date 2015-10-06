var keystone = require('keystone');
var Types = keystone.Field.Types;

var ImageCache = new keystone.List('ImageCache');

ImageCache.add({
    hash: {
        type: Types.Text,
        index: true
    },
    uploaded: {
        type: Types.Boolean,
        index: true
    }
});

ImageCache.register();
