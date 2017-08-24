'use strict';

function Article (rawDataObj) {
  Object.keys(rawDataObj).forEach(function(key) {
    this[key] = rawDataObj[key]
  }, this);
}

Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.loadAll = function(rows) {
  rows.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  Article.all = rows.map(function(ele) {
    return new Article(ele);
  });
};

Article.fetchAll = function(callback) {
  $.get('/articles')
  .then(
    function(results) {
      Article.loadAll(results);
      callback();
    }
  )
};

Article.truncateTable = function(callback) {
  $.ajax({
    url: '/articles',
    method: 'DELETE',
  })
  .then(function(data) {
    console.log(data);
    if (callback) callback();
  });
};

Article.prototype.insertRecord = function(callback) {
  $.post('/articles', {author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title})
  .then(function(data) {
    console.log(data);
    if (callback) callback();
  })
};

Article.prototype.deleteRecord = function(callback) {
  $.ajax({
    url: `/articles/${this.article_id}`,
    method: 'DELETE'
  })
  .then(function(data) {
    console.log(data);
    if (callback) callback();
  });
};

Article.prototype.updateRecord = function(callback) {
  $.ajax({
    url: `/articles/${this.article_id}`,
    method: 'PUT',
    data: {
      author: this.author,
      authorUrl: this.authorUrl,
      body: this.body,
      category: this.category,
      publishedOn: this.publishedOn,
      title: this.title,
      author_id: this.author_id
    }
  })
  .then(function(data) {
    console.log(data);
    if (callback) callback();
  });
};
