var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
    map: {
        name: 'title'
    },
    autokey: {
        path: 'slug',
        from: 'title',
        unique: true,
        fixed: true
    },
    defaultSort: '-createdAt'
});

Post.add({
    title: {
        type: Types.Text,
        required: true,
        index: true
    },
    slug: {
        type: Types.Text
    },
    subHeadline: {
        type: Types.Text
    },
    state: {
        type: Types.Select,
        options: 'draft, published, archived',
        default: 'draft',
        index: true
    },
    author: {
        type: Types.Relationship,
        ref: 'User',
        index: true
    },
    publishedDate: {
        type: Types.Datetime,
        index: true,
        dependsOn: {
            state: 'published'
        }
    },
    featuredImage: {
        type: Types.Relationship,
        ref: 'Media'
    },
    content: {
        type: Types.Html,
        wysiwyg: true,
        height: 400
    },
    category:{
        type: Types.Select,
        options: 'projects, thoughts, experiences, uncategorized',
        default: 'uncategorized',
        index: true
    },
    miscTags: {
        type: Types.Relationship,
        ref: 'Tag',
        filters: {
            type: 'misc'
        },
        many: true
    },
    // Used to search by tag,
    //  regardless of tag type
    allTags: {
        type: Types.Relationship,
        ref: 'Tag',
        many: true,
        index: true,
        hidden: true
    },
    searchString: {
      type: Types.Text,
      hidden: true,
    }
});

/**
 * Depends On Media List
 */
Post.add({
    heading: 'MediaLst Options',
    dependsOn: 'mediaList'
}, {
    mediaList: {
        type: Types.Relationship,
        ref: 'MediaList'
    },
    mediaFormat: {
        type: Types.Select,
        dependsOn: 'mediaList',
        options: 'list, slideshow',
        default: 'list'
    }
});


// Boolean Switches
Post.add({
    heading: 'Advanced Options'
}, {
    hideFeaturedImage: {
        type: Types.Boolean
    },
    featureOnHomepage: {
        type: Types.Boolean,
        default: false,
    }
});

// Post Stats
Post.add({
    heading: 'Post Stats'
}, {
    uniquePageviews: {
        type: Types.Number,
        noedit: true,
        default: 0,
        index: true
    }
});

/**
 * Pre Save
 */
// Populate allTags field for sorting by tags
Post.schema.pre('save', function(next) {
  var allTags = [];
  if (this.categoryTags && this.categoryTags.length > 0) {
    allTags = allTags.concat(this.categoryTags);
  }
  if (this.miscTags && this.miscTags.length > 0) {
    allTags = allTags.concat(this.miscTags);
  }
  this.allTags = allTags;
  next();
});


// Create searchable string with tag names,
//  title, and subtitle
Post.schema.pre('save', function(next) {
  var self = this;

  var searchString = this.title + ' ';
  if (this.subHeadline !== undefined) {
    searchString += this.subHeadline + ' ';
  }
  // Get tag names
  keystone.list('Tag').model.find()
  .where('_id').in(this.allTags)
  .exec(function (err, results) {
    if (!err) {
      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        searchString += result.name + ' ';
      }
    }
    self.searchString = searchString;
    next();
  });
});

/**
 * Virtual Properties
 */
Post.schema.virtual('url').get(function() {
    return '/' + this.category + '/' + this.slug;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';

Post.schema.statics.findOnePublished = function(postSlug, user) {
    var q = Post.model.findOne()
            .where('slug', postSlug);

    // Allow admin users to view posts
    // that are not published
    if (!(user && user.isAdmin)) {
        q.where('state', 'published');
        q.where('publishedDate').lt(new Date())
    }

    return q;
}

Post.schema.statics.findPublished = function(options) {
    options = options || {};
    var resultsPerPage = options.resultsPerPage || 12;
    var page = options.page;

    return keystone.list('Post').paginate({
            page: page,
            perPage: resultsPerPage,
            maxPages: 1
        })
        .where('state', 'published')
        .where('publishedDate').lt(new Date())
        .where('category').ne('uncategorized')
}

// Search
Post.schema.statics.search = function(options) {
    options = options || {};

    var q = this.findPublished(options)
        .sort('-publishedDate');

    // Filter Search
    var searchQuery = options.search;
    if (searchQuery) {
        q.where('searchString', {
            $regex: '.*' + searchQuery + '.*',
            $options: '-i'
        });
    }

    // Filter Category
    var category = options.category;
    if (category) {
        q.where('category', category);
    }

    // Filter Multiple Categories
    var categories = options.categories;
    if (categories && categories.length > 0) {
        q.where('category').in(categories);
    }

    // Filter Tag : Note use tag ID
    var tag = options.tag;
    if (tag) {
        q.where('allTags', tag);
    }

    // Filter Multiple Tags
    var tags = options.tags;
    if (tags && tags.length > 0) {
        q.where('allTags').in(tags);
    }

    // Filter Author
    var author = options.author;
    if (author) {
        q.where('author', author);
    }

    return q;
}

Post.schema.set('autoIndex', false);
Post.register();
