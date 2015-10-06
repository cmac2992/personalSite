var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Tag Model
 * ==================
 */
var Tag = new keystone.List('Tag', {
    autokey: {
        from: 'name',
        path: 'slug',
        unique: true
    }
});

Tag.add({
    name: {
        type: String,
        required: true
    },
    type: {
        type: Types.Select,
        options: 'misc',
        default: 'misc',
        index: true
    }
});

Tag.schema.set('autoIndex', false);
Tag.register();
