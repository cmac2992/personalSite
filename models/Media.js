var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Media Model
 * ==========
 */

var Media = new keystone.List('Media', {
    autokey: {
        path: 'slug',
        from: 'name',
        unique: true
    },
    sortable: true,
    sortContext: 'MediaList:media'
});

Media.add({
    name: {
        type: Types.Text,
        required: true,
        index: true
    },
    headline: {
        type: Types.Text,
        index: true
    },
    imageCredit: {
        type: Types.Text
    },
    imageCreditLink: {
        type: Types.Url
    },
    image: {
        type: Types.CloudinaryImage,
    },
    caption: {
        type: Types.Html,
        wysiwyg: true
    },
    mediaList: {
        type: Types.Relationship,
        ref: 'MediaList',
        index: true,
        many: true
    }
});

/**
 * Registration
 */

Media.schema.set('autoIndex', false);
Media.register();
