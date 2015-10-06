var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
    autokey: {
        path: 'slug',
        from: 'name',
        unique: true,
        fixed: true
    },
});

User.add({
    name: {
        type: Types.Name,
        required: true,
        index: true
    },
    email: {
        type: Types.Email,
        initial: true,
        required: true,
        index: true
    },
    password: {
        type: Types.Password,
        initial: true,
        required: true
    },
    profilePicture: {
        type: Types.CloudinaryImage
    },
    slug: {
        type: Types.Text
    },
    bio: {
        brief: {
            type: Types.Html,
            wysiwyg: true,
            height: 150
        },
        extended: {
            type: Types.Html,
            wysiwyg: true,
            height: 400
        }
    }
}, 'Permissions', {
    isAdmin: {
        type: Boolean,
        label: 'Can access Keystone',
        index: true
    }
});


/**
 * Virtuals
 */

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
    return this.isAdmin;
});

User.schema.virtual('bio.full').get(function() {
    return this.bio.extended || this.bio.brief;
});

/**
 * Relationships
 */

User.relationship({
    ref: 'Post',
    path: 'posts',
    refPath: 'author'
});


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';

User.schema.set('autoIndex', false);
User.register();
