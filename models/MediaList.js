var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Media List Model
 * ==========
 */

var MediaList = new keystone.List('MediaList', {
    autokey: {
        path: 'slug',
        from: 'name',
        unique: true
    }
});

MediaList.add({
    name: {
        type: Types.Text,
        required: true,
        index: true
    }
});

/**
 * Relationships
 */
MediaList.relationship({
    ref: 'Media',
    path: 'media',
    refPath: 'mediaList'
});

/**
 * Registration
 */

MediaList.schema.set('autoIndex', false);
MediaList.register();
